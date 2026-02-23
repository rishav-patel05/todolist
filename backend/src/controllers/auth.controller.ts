import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUser, logoutUser, refreshUserToken, registerUser } from "../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production"
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { accessToken, refreshToken } = await registerUser(name, email, password);

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(201).json({ success: true, message: "Registered successfully" });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.json({ success: true, message: "Logged in successfully" });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  const tokens = await refreshUserToken(refreshToken);

  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.json({ success: true, message: "Token refreshed" });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    await logoutUser(req.user.id);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("csrfToken");

  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: req.user?.id,
      name: req.user?.name,
      email: req.user?.email
    }
  });
});

export const csrf = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { csrfToken: req.csrfToken } });
});
