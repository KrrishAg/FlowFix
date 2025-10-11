import z from "zod";

export const signupData = z.object({
  username: z.string().min(2),
  password: z.string().min(2),
  name: z.string().min(2),
});

export const signinData = z.object({
  username: z.string(),
  password: z.string(),
});
