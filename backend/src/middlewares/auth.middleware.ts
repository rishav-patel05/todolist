import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    req.user = user;
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
};
