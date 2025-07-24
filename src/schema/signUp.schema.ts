import * as z from "zod/v4";

export const SignUpSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }).trim(),
  email: z.email({ error: "Invalid email" }).trim(),
  password: z
    .string()
    .min(6, { error: "minimum of 6 characters required" })
    .trim(),
});
