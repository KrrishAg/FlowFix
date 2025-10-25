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
    const pendingRows = await prisma.zapRunOutbox.findMany({
      where: {},
      include: {
        zapRun: {
          include: {
            zap: {
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
          userId: r.zapRun.zap.userId,
          zapRunId: r.zapRunId,
          stage: 0,
        }),
      })),
    });

    //after putting them in kafka, deleting from the zaprunoutbox table
    await prisma.zapRunOutbox.deleteMany({
      where: {
        id: {
          in: pendingRows.map((r) => r.id),
        },
      },
    });
  }
}

main();
