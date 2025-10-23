import prisma from "@repo/db/client";
import express from "express";
import { authMiddleware } from "../middleware.js";

export const userCredRouter = express.Router();

userCredRouter.post("/setapi", authMiddleware, async (req, res) => {
  try {
    const { service, apikey } = req.body;
    if (!service || !apikey) {
      return res.status(400).send("Either service or apikey is missing");
    }

    await prisma.userCredentials.create({
      data: {
        //@ts-ignore
        userId: req.id,
        service,
        apikey,
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
