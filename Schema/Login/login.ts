import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().trim().email("Invalid email address"),
  password: zod.string().min(1, "Password is required"),
});
