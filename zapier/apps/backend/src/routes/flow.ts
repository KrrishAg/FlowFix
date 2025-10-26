import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { flowCreateSchema } from "../types/index.js";
import prisma from "@repo/db/client";

export const flowRouter = express.Router();

//creating a flow
flowRouter.post("/createFlow", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId: string = req.id;
    const body = req.body;
    const parsedData = flowCreateSchema.safeParse(body);

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res
        .status(411)
        .json({ error: "Wrong data format sent for creating a flow" });
    }

    const flowId = await prisma.$transaction(async (tx) => {
      //creating a flow, but will need trigger id as well
      const flow = await tx.flow.create({
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

      //creating a trigger using the created flow
      const trigger = await tx.trigger.create({
        data: {
          flowId: flow.id,
          triggerTypeId: parsedData.data.availableTriggerId,
        },
      });

      //updating the flow with the new trigger id
      await tx.flow.update({
        where: {
          id: flow.id,
        },
        data: {
          triggerId: trigger.id,
        },
      });

      return flow.id;
    });

    res.json({ flowId });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

//editing a flow
flowRouter.post("/editFlow/:flowId", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId: string = req.id;
    const body = req.body;
    const parsedData = flowCreateSchema.safeParse(body);
    const flowId: string = req.params.flowId || "";

    if (!flowId) return res.status(411).json({ error: "No flow id found" });

    if (!parsedData.success) {
      console.log(parsedData.error);
      return res
        .status(411)
        .json({ error: "Wrong data format sent for editing a flow" });
    }

    await prisma.$transaction(async (tx) => {
      //updating available trigger type id
      await tx.trigger.update({
        where: {
          flowId: flowId,
        },
        data: {
          triggerTypeId: parsedData.data.availableTriggerId,
        },
      });

      //updating flow date
      await tx.flow.update({
        where: {
          id: flowId,
        },
        data: {
          date: new Date(),
        },
      });

      //deleting old actions associated with this flow
      await tx.action.deleteMany({
        where: {
          flowId: flowId,
        },
      });

      //creating new actiosns associated with this flow
      await Promise.all(
        parsedData.data.actions.map(async (act, idx) => {
          return await tx.action.create({
            data: {
              flowId: flowId,
              actionTypeId: act.availableActionId,
              metadata: act.actionMetaData,
              sortOrder: idx,
            },
          });
        })
      );
    });

    res.json({ flowId });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

//getting all the flows for the logged in user
flowRouter.get("/", authMiddleware, async (req, res) => {
  try {
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    const flows = await prisma.flow.findMany({
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

    return res.json({ flows });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

flowRouter.get("/:flowId", authMiddleware, async (req, res) => {
  try {
    const flowId = req.params.flowId;
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    const flow = await prisma.flow.findFirst({
      where: {
        userId: parseInt(userId),
        id: flowId,
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

    return res.json({ flow });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

flowRouter.delete("/:flowId", authMiddleware, async (req, res) => {
  try {
    const flowId = req.params.flowId;
    //need to include everything, as showing on FE
    //@ts-ignore
    const userId: string = req.id;
    await prisma.flow.delete({
      where: {
        id: flowId,
        userId: +userId,
      },
    });

    return res.json({ success: true, message: "Deleted flow successfully" });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});
