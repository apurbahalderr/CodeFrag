import { z } from "zod";

export const SignupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(20, "Username must be atmost 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
