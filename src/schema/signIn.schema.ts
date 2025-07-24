import * as z from "zod/v4";

export const SignInSchema = z.object({
  email: z.email({ error: "invalid email" }).trim(),
  password: z
    .string()
    .min(6, { error: "minimum of 6 characters required" })
    .trim(),
});
