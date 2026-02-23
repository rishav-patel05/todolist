import { z } from "zod";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().regex(passwordRule, "Password must contain uppercase, lowercase, number and symbol")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
