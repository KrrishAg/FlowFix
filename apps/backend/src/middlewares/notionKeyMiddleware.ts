import { Request, Response, NextFunction } from "express";
import { encryption_key } from "../config.js";
import prisma from "@repo/db/client";
import cryptojs from "crypto-js";

export async function notionKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization as string;
  try {
    //@ts-ignore
    if (!req.id) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    //@ts-ignore
    const userId = req.id;

    if (!encryption_key) {
      return res.status(411).json({
        error: "No encryption key found in env while setting the api",
      });
    }

    const credentials = await prisma.userCredentials.findFirst({
      where: { userId, service: "NOTION" },
    });

    if (!credentials) {
      return res.status(401).json({ error: "Notion account not connected." });
    }

    const notionEncryptedApiKey = credentials.apikey;

    const bytes = cryptojs.AES.decrypt(notionEncryptedApiKey, encryption_key);
    const notionDecryptedApiKey = bytes.toString(cryptojs.enc.Utf8);

    if (!notionDecryptedApiKey) {
      console.log("Failed to decrypt credentials");
      return { status: "FAILED", error: "Failed to decrypt credentials" };
    }

    // @ts-ignore
    req.notionApiKey = notionDecryptedApiKey;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Error while decrypting notion api token" });
  }
}
