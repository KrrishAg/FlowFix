import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { signinSchema, signupSchema } from "../types/index.js";
import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config.js";
import bcrypt from "bcrypt";

export const userRouter = express.Router();

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

    const hashedPassword =
      (await bcrypt.hash(parsedData.data.password, 10)) || "";

    const user = await prisma.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });

    //await send email
    if (!jwtsecret) {
      return res
        .status(411)
        .json({ error: "No jwt secret found in signin endpoint" });
    }
    const token = jwt.sign({ id: user.id }, jwtsecret);

    res.json({
      message: "User created",
      token,
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
      },
    });
    if (!user) {
      return res.status(411).json({ error: "User doesn't exist" });
    }

    const equal = await bcrypt.compare(parsedData.data.password, user.password);

    if (!equal) throw new Error("Passwords do not match/Wrong Credentials");

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
