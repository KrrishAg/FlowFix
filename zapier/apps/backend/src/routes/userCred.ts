import prisma from "@repo/db/client";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cryptojs from "crypto-js";
import { encryption_key } from "../config.js";

export const userCredRouter = express.Router();

userCredRouter.post("/setapi", authMiddleware, async (req, res) => {
  try {
    const { service, apikey } = req.body;
    if (!service || !apikey) {
      return res.status(400).send("Either service or apikey is missing");
    }

    if (!encryption_key) {
      return res
        .status(411)
        .json({ error: "No encryption key found while setting the api" });
    }

    const encryptedApiKey = cryptojs.AES.encrypt(
      apikey,
      encryption_key
    ).toString();

    const user = await prisma.userCredentials.findFirst({
      where: {
        //@ts-ignore
        userId: req.id,
        service,
      },
    });

    if (user) {
      console.log("User with this service already has an api key set");
      throw new Error("Api key already exists");
    }

    await prisma.userCredentials.create({
      data: {
        //@ts-ignore
        userId: req.id,
        service,
        apikey: encryptedApiKey,
      },
    });

    return res.json({ msg: "User credentials updated" });
  } catch (error) {
    return res.status(401).send("Error while adding the apikey of the user");
  }
});

userCredRouter.get("/available", authMiddleware, async (req, res) => {
  try {
    const service = req.query.service;
    if (typeof service !== "string") {
      return res.status(400).send("Service parameter must be a string");
    }

    const user = await prisma.userCredentials.findFirst({
      where: {
        //@ts-ignore
        userId: req.id,
        service,
      },
    });

    if (user) return res.json({ isConnected: true });
    else return res.json({ isConnected: false });
  } catch (error) {
    return res
      .status(401)
      .send("Error while checking if certain user has a service api or not");
  }
});

userCredRouter.get("/getapi", authMiddleware, async (req, res) => {
  try {
    const service = req.query.service;
    if (typeof service !== "string") {
      return res.status(400).send("Service parameter must be a string");
    }

    const user = await prisma.userCredentials.findFirst({
      where: {
        //@ts-ignore
        userId: req.id,
        service,
      },
    });

    if (!user) return res.json({ error: "No user with that service" });

    return res.json({ apikey: user.apikey });
  } catch (error) {
    return res.status(401).send("Error while returning the apikey of the user");
  }
});
