import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfCookie = (req: Request, res: Response, next: NextFunction): void => {
  let token = req.cookies.csrfToken as string | undefined;
  if (!token) {
    token = crypto.randomBytes(24).toString("hex");
    res.cookie("csrfToken", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
  }
  req.csrfToken = token;
  next();
};

export const verifyCsrf = (req: Request, _res: Response, next: NextFunction): void => {
  if (safeMethods.has(req.method)) {
    next();
    return;
  }

  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = req.cookies.csrfToken;
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    next(new AppError("Invalid CSRF token", 403));
    return;
  }

  next();
};
