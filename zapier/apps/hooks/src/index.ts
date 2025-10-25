import prisma from "@repo/db/client";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  await prisma.$transaction(async (tx) => {
    //storing in db
    const run = await tx.zapRun.create({
      data: {
        zapId,
        metadata: body, //this would be data sent in body in json format
      },
    });

    //storing in the outbox as well
    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });

    //maybe push it onto a queue like redis or kafka
  });

  res.send("ZapRun added");
});

app.listen(3002, () => {
  console.log("Hook server listening on port 3002");
});
