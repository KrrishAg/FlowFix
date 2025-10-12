import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtsecret } from "./config.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization as string;
  try {
    if (!jwtsecret) {
      return res.status(500).json({ error: "JWT secret is not defined" });
    }
    const payload = jwt.verify(token, jwtsecret);

    //@ts-ignore
    req.id = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
