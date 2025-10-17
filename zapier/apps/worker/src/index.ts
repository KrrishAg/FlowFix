import { TOPIC_NAME } from "@repo/common/config";
import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker-process",
  brokers: ["localhost:9092"],
});

async function main() {
  //cnsumer to consumer actions from kafka queue
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  //producer for oushing the next stage to the akfka queue
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        offset: message.offset,
        partition: partition,
        value: message.value?.toString(),
      });

      console.log("CAMME1");
      if (!message.value?.toString()) return;

      console.log("CAMME2", message.value.toString());

      const parsedData = JSON.parse(message.value?.toString());
      console.log("CAMME3");
      const zapRunId = parsedData.zapRunId;
      const stage = parsedData.stage; //this stage tells which action is/should currently be run

      const zapRunDetails = await prisma.zapRun.findFirst({
        where: {
          id: zapRunId,
        },
        include: {
          zap: {
            include: {
              actions: true,
            },
          },
        },
      });

      //trying to grab WHICH zap's WHICH action is currently being executed
      const currAction = zapRunDetails?.zap.actions.find(
        (act) => act.sortOrder === stage
      );
      if (!currAction) {
        console.log("No action found for the stage", stage);
        return;
      }

      if (currAction.actionTypeId === "email") {
        console.log(`Stage ${stage} running: Sending out an email`);
      }
      if (currAction.actionTypeId === "send-sol") {
        console.log(`Stage ${stage} running: Sending out solana`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("PROCESS DONE");

      const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1; //figuring out the last sortorder which tells if there is any further action for that zap

      if (stage !== lastStage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({ zapRunId, stage: stage + 1 }),
            },
          ],
        });
      } else {
        console.log("THIS IS THE LAST STAGE");
      }

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
