import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
}

const isStringValue = (value: string): value is StringValue => {
  return /^-?\d+(\.\d+)?\s?(ms|s|m|h|d|w|y)$/.test(value);
};

const toExpiresIn = (value: string, fallback: StringValue): number | StringValue => {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }

  if (isStringValue(value)) {
    return value;
  }

  return fallback;
};

export const createAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: toExpiresIn(env.accessTokenExpiresIn, "15m")
  });

export const createRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: toExpiresIn(env.refreshTokenExpiresIn, "7d")
  });

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtAccessSecret) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
