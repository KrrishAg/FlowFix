import dotenv from "dotenv";

dotenv.config();

export const jwtsecret = process.env.JWT_SECRET;
export const encryption_key = process.env.ENCRYPTION_KEY;
