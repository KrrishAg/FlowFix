import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "@repo/common/config";
import dotenv from "dotenv";

dotenv.config();

//broekr name in docker-compose
const broker = "localhost:9092";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: [broker],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRows = await prisma.flowRunOutbox.findMany({
      where: {},
      include: {
        flowRun: {
          include: {
            flow: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
      take: 10,
    });

    //created the topic from the akfka cli
    await producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((r) => ({
        value: JSON.stringify({
          userId: r.flowRun.flow.userId,
          flowRunId: r.flowRunId,
          stage: 0,
        }),
      })),
    });

    //after putting them in kafka, deleting from the flowrunoutbox table
    await prisma.flowRunOutbox.deleteMany({
      where: {
        id: {
          in: pendingRows.map((r) => r.id),
        },
      },
    });
  }
}

main();
