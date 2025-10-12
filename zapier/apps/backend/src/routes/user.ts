import express from "express";
import { authMiddleware } from "../middleware.js";
import { signinSchema, signupSchema } from "../types/index.js";
import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const parsedData = signupSchema.safeParse(body);

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res.status(411).json({ error: "Incorrect data sent" });
    }

    const userExists = await prisma.user.findFirst({
      where: { email: parsedData.data.username },
    });
    if (userExists) {
      return res.status(411).json({ error: "User exists" });
    }

    await prisma.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    //await send email

    res.json({
      message: "User created",
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const body = req.body;
    const parsedData = signinSchema.safeParse(body);

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res.status(411).json({ error: "Incorrect data sent" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password,
      },
    });
    if (!user) {
      return res.status(411).json({ error: "User doesn't exist" });
    }

    if (!jwtsecret) {
      return res
        .status(411)
        .json({ error: "No jwt secret found in signin endpoint" });
    }
    const token = jwt.sign({ id: user.id }, jwtsecret);

    res.json({
      token,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

userRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        //@ts-ignore
        id: req.id,
      },
      select: {
        email: true,
        name: true,
      },
    });

    return res.json({ user });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

export default userRouter;
