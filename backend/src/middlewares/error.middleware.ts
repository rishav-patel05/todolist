import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError("Route not found", 404));
};

export const errorHandler = (err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  logger.error(err.message, { stack: err.stack, statusCode });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
};
