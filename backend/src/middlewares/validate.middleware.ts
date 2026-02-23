import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "../utils/appError";

export const validate = (schema: AnyZodObject, target: "body" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(new AppError(result.error.errors.map((e) => e.message).join(", "), 400));
      return;
    }
    req[target] = result.data;
    next();
  };
