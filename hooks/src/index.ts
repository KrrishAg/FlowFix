import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const client = new PrismaClient();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  await client.$transaction(async (tx) => {
    //storing in db
    const run = await client.zapRun.create({
      data: {
        zapId,
        metadata: body,   //this would be data sent in body in json format
      },
    });

    //storing in the outbox as well
    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });

    //maybe push it onto a queue like redis or kafka
  });

  res.send("ZapRun added");
});

app.listen(3000, () => {
  console.log("Hook server listening on port 3000");
});
