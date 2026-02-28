import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import healthRoutes from "./routes/health.routes";
import { csrfCookie, verifyCsrf } from "./middlewares/csrf.middleware";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

app.set("trust proxy", 1);

const allowedOrigins = env.frontendUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7"
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(csrfCookie);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// Protect only todos (example)
app.use("/api/todos", verifyCsrf, todoRoutes);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);
