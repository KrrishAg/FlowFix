import prisma from "@repo/db/client";
import express from "express";
export const triggerRouter = express.Router();
triggerRouter.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTrigger.findMany({});
    res.json({ availableTriggers });
});
