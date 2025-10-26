import prisma from "@repo/db/client";
import express from "express";

export const actionRouter = express.Router();

actionRouter.get("/available", async (req, res) => {
  const availableActions = await prisma.availableAction.findMany({});
  res.json({ availableActions });
});
