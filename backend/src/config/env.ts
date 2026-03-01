import dotenv from "dotenv";

dotenv.config();

const normalizeCookieDomain = (raw?: string): string | undefined => {
  const value = raw?.trim();
  if (!value) return undefined;

  const stripped = value
    .replace(/^\./, "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .trim();

  if (!/^[a-zA-Z0-9.-]+$/.test(stripped)) {
    return undefined;
  }

  return stripped;
};

const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "CSRF_SECRET"] as const;
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGO_URI as string,
  frontendUrl: process.env.FRONTEND_URL ?? "",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
  cookieDomain: normalizeCookieDomain(process.env.COOKIE_DOMAIN),
  cookieSecure: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : (process.env.NODE_ENV ?? "development") === "production",
  logLevel: process.env.LOG_LEVEL ?? "info",
  csrfSecret: process.env.CSRF_SECRET as string
};
