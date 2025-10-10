import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;

  await client.$transaction(async (tx) => {
    //storing in db
    const run = await client.zapRun.create({
      data: {
        zapId,
      },
    });

    //storing in the outbox as well
    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });

    //push it onto a queue like redis or kafka
  });
});
