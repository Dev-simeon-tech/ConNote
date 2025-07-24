import * as z from "zod/v4";

export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "invalid email" }).trim(),
});
