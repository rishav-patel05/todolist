import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export const connectDb = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
};
