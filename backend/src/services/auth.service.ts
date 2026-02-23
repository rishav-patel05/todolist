import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AppError } from "../utils/appError";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const issueTokens = (userId: string): AuthTokens => ({
  accessToken: createAccessToken({ userId }),
  refreshToken: createRefreshToken({ userId })
});

export const registerUser = async (name: string, email: string, password: string): Promise<AuthTokens> => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });
  const tokens = issueTokens(user.id);

  await User.findByIdAndUpdate(user.id, { refreshToken: tokens.refreshToken });
  return tokens;
};

export const loginUser = async (email: string, password: string): Promise<AuthTokens> => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const tokens = issueTokens(user.id);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

export const refreshUserToken = async (refreshToken: string): Promise<AuthTokens> => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId).select("+refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokens = issueTokens(user.id);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
