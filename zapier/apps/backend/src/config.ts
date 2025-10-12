import dotenv from "dotenv";

dotenv.config();

export const jwtsecret = process.env.JWT_SECRET;
