import { createLogger, format, transports } from "winston";
import { env } from "../config/env";

export const logger = createLogger({
  level: env.logLevel,
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  ]
});
