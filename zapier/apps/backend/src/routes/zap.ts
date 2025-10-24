import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { zapCreateSchema } from "../types/index.js";
import prisma from "@repo/db/client";

export const zapRouter = express.Router();

//creating a zap
zapRouter.post("/createZap", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId: string = req.id;
    const body = req.body;
    const parsedData = zapCreateSchema.safeParse(body);

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res
        .status(411)
        .json({ error: "Wrong data format sent for creating a zap" });
    }

    const zapId = await prisma.$transaction(async (tx) => {
      //creating a zap, but will need trigger id as well
      const zap = await tx.zap.create({
        data: {
          userId: parseInt(userId),
          triggerId: "",
          date: new Date(),
          actions: {
            create: parsedData.data.actions.map((xx, idx) => ({
              sortOrder: idx,
              actionTypeId: xx.availableActionId,
              metadata: xx.actionMetaData,
            })),
          },
        },
      });

      //creating a trigger using the created zap
      const trigger = await tx.trigger.create({
        data: {
          zapId: zap.id,
          triggerTypeId: parsedData.data.availableTriggerId,
        },
      });

      //updating the zap with the new trigger id
      await tx.zap.update({
        where: {
          id: zap.id,
        },
        data: {
          triggerId: trigger.id,
        },
      });

      return zap.id;
    });

    res.json({ zapId });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

//editing a zap
zapRouter.post("/editZap/:zapId", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId: string = req.id;
    const body = req.body;
    const parsedData = zapCreateSchema.safeParse(body);
    const zapId: string = req.params.zapId || "";

    if (!zapId) return res.status(411).json({ error: "No zap id found" });

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res
        .status(411)
        .json({ error: "Wrong data format sent for editing a zap" });
    }

    await prisma.$transaction(async (tx) => {
      //updating available trigger type id
      await tx.trigger.update({
        where: {
          zapId: zapId,
        },
        data: {
          triggerTypeId: parsedData.data.availableTriggerId,
        },
      });

      //updating zap date
      await tx.zap.update({
        where: {
          id: zapId,
        },
        data: {
          date: new Date(),
        },
      });

      //deleting old actions associated with this zap
      await tx.action.deleteMany({
        where: {
          zapId: zapId,
        },
      });

      //creating new actiosns associated with this zap
      await Promise.all(
        parsedData.data.actions.map(async (act, idx) => {
          return await tx.action.create({
            data: {
              zapId: zapId,
              actionTypeId: act.availableActionId,
              metadata: act.actionMetaData,
              sortOrder: idx,
            },
          });
        })
      );
    });

    res.json({ zapId });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

//getting all the zaps for the logged in user
zapRouter.get("/", authMiddleware, async (req, res) => {
  try {
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    const zaps = await prisma.zap.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        actions: {
          include: {
            AvailableAction: true,
          },
        },
        trigger: {
          include: {
            AvailableTrigger: true,
          },
        },
      },
    });

    return res.json({ zaps });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

zapRouter.get("/:zapid", authMiddleware, async (req, res) => {
  try {
    const zapid = req.params.zapid;
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    const zap = await prisma.zap.findFirst({
      where: {
        userId: parseInt(userId),
        id: zapid,
      },
      include: {
        actions: {
          include: {
            AvailableAction: true,
          },
        },
        trigger: {
          include: {
            AvailableTrigger: true,
          },
        },
      },
    });

    return res.json({ zap });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

zapRouter.delete("/:zapid", authMiddleware, async (req, res) => {
  try {
    const zapid = req.params.zapid;
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    await prisma.zap.delete({
      where: {
        id: zapid,
        userId: +userId,
      },
    });

    return res.json({ success: true, message: "Deleted zap successfully" });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});
