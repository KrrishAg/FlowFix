import prisma from "@repo/db/client";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/hooks/catch/:userId/:flowId", async (req, res) => {
  const userId = req.params.userId;
  const flowId = req.params.flowId;
  const body = req.body;

  await prisma.$transaction(async (tx) => {
    //storing in db
    const run = await tx.flowRun.create({
      data: {
        flowId,
        metadata: body, //this would be data sent in body in json format
      },
    });

    //storing in the outbox as well
    await tx.flowRunOutbox.create({
      data: {
        flowRunId: run.id,
      },
    });

    //maybe push it onto a queue like redis or kafka
  });

  res.send("FlowRun added");
});

app.listen(3002, () => {
  console.log("Hook server listening on port 3002");
});
