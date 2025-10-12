import z from "zod";

export const signupSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(2),
  name: z.string().min(2),
});

export const signinSchema = z.object({
  username: z.string(),
  password: z.string(),
});
