import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";
import { TOPIC } from "@repo/common/config";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRows = await prisma.zapRunOutbox.findMany({
      where: {},
      take: 10,
    });

    //created the topic from the akfka cli
    pendingRows.forEach((row, idx) => {
      producer.send({
        topic: TOPIC,
        messages: pendingRows.map((r) => ({
          value: r.zapRunId,
        })),
      });
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
