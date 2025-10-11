import { TOPIC } from "@repo/common/config";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker-process",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();

  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        offset: message.offset,
        partition: partition,
        value: message.value?.toString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 4000));

      console.log("PROCESS DONE");
    },
  });
}

main();
