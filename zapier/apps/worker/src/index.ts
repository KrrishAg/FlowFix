import { TOPIC_NAME } from "@repo/common/config";
import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";
import { parse } from "./parse.js";
import { sendEmail } from "./email.js";
import { sendSms } from "./sms.js";

//sent data this from postman, so this was stores aas zapRun's metadata
// {
//     "comment": {
//         "email": "Krrish@temp.com",
//         "amount": 50,
//         "address": "1239213479hfdecifw9e79"
//     }
// }
//solana data what I filled in those fields on FE: { "amount" : " {comment. amount}" , " address" : " {comment. address}
//email data what I filled in those fields on FE: {"body" : "You have received a bounty of {comment. amount}, Thanks to krrish", "email " : "{comment . email}"}

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

      if (!message.value?.toString()) return;

      const parsedData = JSON.parse(message.value?.toString());
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

      const actionMetadata = currAction.metadata as
        | Record<string, any>
        | undefined;

      if (currAction.actionTypeId === "email") {
        console.log(`Stage ${stage} running: Sending out an email`);

        const email = parse(actionMetadata?.email, zapRunDetails?.metadata);
        const body = parse(actionMetadata?.body, zapRunDetails?.metadata);
        console.log(`Sending out an email ${email} with the body ${body}`);
        sendEmail({ email, message: body });
      }
      if (currAction.actionTypeId === "send-sol") {
        console.log(`Stage ${stage} running: Sending out solana`);

        const address = parse(actionMetadata?.address, zapRunDetails?.metadata);
        const amount = parse(actionMetadata?.amount, zapRunDetails?.metadata);
        console.log(`Sending out SOLana of quantity ${amount} to ${address}`);
      }
      if (currAction.actionTypeId === "sms") {
        console.log(`Stage ${stage} running: Sending out an sms`);

        const phone = parse(actionMetadata?.phone, zapRunDetails?.metadata);
        const body = parse(actionMetadata?.body, zapRunDetails?.metadata);
        console.log(`Sending out sms to ${phone} with message ${body}`);
        sendSms({ phone, message: body });
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
