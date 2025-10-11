import { TOPIC_NAME } from "@repo/common/config";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker-process",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        offset: message.offset,
        partition: partition,
        value: message.value?.toString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 4000));

      console.log("PROCESS DONE");

      //manually adding commit, instead of default autocommit
      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(), //we mention the offset, which should be processed next, so give next offset so that same msg dont repeat twice.
        },
      ]);
    },
  });
}

main();
