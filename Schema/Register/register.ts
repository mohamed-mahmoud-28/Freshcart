import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .trim()
      .min(4, "Name must be at least 4 characters long")
      .max(20, "Name must be at most 20 characters long"),
    email: zod.string().trim().email("Invalid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain an uppercase letter, lowercase letter, number, and special character",
      ),
    rePassword: zod.string().min(1, "Please confirm your password"),
    phone: zod
      .string()
      .trim()
      .regex(/^01[0125]\d{8}$/, "Phone number must be 11 digits long"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const schema = registerSchema;
