import { TOPIC_NAME } from "@repo/common/config";
import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";
import { parse } from "./parse.js";
import { sendEmail } from "./email.js";
import { sendSms } from "./sms.js";
import { sendDiscordMessage } from "./discord.js";
import { sendAPIReq } from "./apireq.js";
import { sendTelegramMessage } from "./telegram.js";
import { sendDataToFilter } from "./filter.js";
import { sendRazorpay } from "./razorpay.js";
import { createNotion } from "./notion.js";

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
      console.log("PARSED DATA", parsedData);
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

      //TILL NOW zapRunDetails?.metadata for the values in the parse function was fine but WITH INTRO of Razorpay, I need link as well which is there in parsedObject, as I put it there while producing the next stage
      let metadataObject = {};

      // This 'if' block safely checks if Metadata is *actually* an object
      if (
        zapRunDetails?.metadata &&
        typeof zapRunDetails.metadata === "object"
      ) {
        // If it's a real object, assign it
        metadataObject = zapRunDetails.metadata;
      }

      // 4. Now, you can safely combine them!
      const combinedObject = {
        ...parsedData,
        ...metadataObject, // This is now guaranteed to be an object
      };

      const actionMetadata = currAction.metadata as
        | Record<string, any>
        | undefined;

      if (currAction.actionTypeId === "email") {
        console.log(`Stage ${stage} running: Sending out an email`);

        const email = parse(actionMetadata?.email, combinedObject);
        const body = parse(actionMetadata?.body, combinedObject);
        console.log(`Sending out an email ${email} with the body ${body}`);
        sendEmail({ email, message: body });
      }
      if (currAction.actionTypeId === "send-sol") {
        console.log(`Stage ${stage} running: Sending out solana`);

        const address = parse(actionMetadata?.address, combinedObject);
        const amount = parse(actionMetadata?.amount, combinedObject);
        console.log(`Sending out SOLana of quantity ${amount} to ${address}`);
      }
      if (currAction.actionTypeId === "sms") {
        console.log(`Stage ${stage} running: Sending out an sms`);

        const phone = parse(actionMetadata?.phone, combinedObject);
        const body = parse(actionMetadata?.body, combinedObject);
        console.log(`Sending out sms to ${phone} with message ${body}`);
        sendSms({ phone, message: body });
      }
      if (currAction.actionTypeId === "discord") {
        console.log(`Stage ${stage} running: Sending out a discord message`);

        console.log(actionMetadata);

        const url = parse(actionMetadata?.url, combinedObject);
        const message = parse(actionMetadata?.message, combinedObject);
        const hyperlink = parse(actionMetadata?.hyperlink, combinedObject);
        const title = parse(actionMetadata?.title, combinedObject);
        console.log(url, message, hyperlink, title);
        console.log(
          `Sending out discord message to webhook url: ${url} with message ${message}`
        );
        sendDiscordMessage({ url, message, hyperlink, title });
      }

      if (currAction.actionTypeId === "apireq") {
        console.log(`Stage ${stage} running: Hitting an api endpoint`);

        const url = parse(actionMetadata?.url, combinedObject);
        const method = parse(actionMetadata?.method, combinedObject);

        let parsedHeaders = {};
        if (actionMetadata?.headers) {
          for (const [key, value] of Object.entries(
            JSON.parse(actionMetadata?.headers)
          )) {
            //@ts-ignore
            parsedHeaders[key] = parse(value as string, combinedObject);
          }
        }

        let parsedBody = {};
        if (actionMetadata?.body) {
          for (const [key, value] of Object.entries(
            JSON.parse(actionMetadata?.body)
          )) {
            //@ts-ignore
            parsedBody[key] = parse(value as string, combinedObject);
          }
        }
        console.log(
          `Trying to hit an api endpoint: ${url}, method ${method} with headers ${parsedHeaders} and body ${parsedBody}`
        );
        sendAPIReq({
          url,
          method,
          //@ts-ignore
          headers: parsedHeaders,
          //@ts-ignore
          body: parsedBody,
        });
      }

      if (currAction.actionTypeId === "telegram") {
        console.log(`Stage ${stage} running: Sending out a telegram message`);

        const botToken = parse(actionMetadata?.botToken, combinedObject);
        const chatId = parse(actionMetadata?.chatId, combinedObject);
        const message = parse(actionMetadata?.message, combinedObject);

        console.log(`Sending out telegram with message ${message}`);
        sendTelegramMessage({ botToken, chatId, message });
      }

      let res = true;
      if (currAction.actionTypeId === "filter") {
        console.log(
          `Stage ${stage} running: Filtering based on the user inputs and conditions`
        );

        console.log(actionMetadata);
        console.log(combinedObject);

        const logic = parse(actionMetadata?.logic, combinedObject);
        console.log(logic);
        let condition1 = {};
        if (actionMetadata?.condition1) {
          for (const [key, value] of Object.entries(
            actionMetadata?.condition1
          )) {
            //@ts-ignore
            condition1[key] = parse(value as string, combinedObject);
          }
        }
        let condition2 = {};
        if (actionMetadata?.condition2) {
          for (const [key, value] of Object.entries(
            actionMetadata?.condition2
          )) {
            //@ts-ignore
            condition2[key] = parse(value as string, combinedObject);
          }
        }

        console.log(`Sending the data for filtering`);
        //@ts-ignore
        res = sendDataToFilter({ logic, condition1, condition2 });
      }

      const extra: Record<string, any> = {};
      if (currAction.actionTypeId === "razorpay") {
        console.log(`Stage ${stage} running: Creatiing a new razorpay link`);

        // console.log(actionMetadata);
        // console.log(zapRunDetails?.metadata);

        const keyId = parse(actionMetadata?.keyId, zapRunDetails?.metadata);
        const keySecret = parse(actionMetadata?.keySecret, combinedObject);
        const amntInPaise = parse(actionMetadata?.amntInPaise, combinedObject);
        const description = parse(actionMetadata?.description, combinedObject);
        const custName = parse(actionMetadata?.custName, combinedObject);
        const custEmail = parse(actionMetadata?.custEmail, combinedObject);

        console.log();

        console.log(`Sending the data to create razorpay link`);

        const razorpayUrl = await sendRazorpay({
          keyId,
          keySecret,
          amntInPaise,
          description,
          custName,
          custEmail,
        });

        extra["razorpayUrl"] = razorpayUrl; //adding that razorpay link url in the extra so that it gets added on message for next kafka message
      }

      if (currAction.actionTypeId === "notion") {
        console.log(`Stage ${stage} running: Dealing with notion`);

        console.log(actionMetadata);
        console.log(combinedObject);

        // const keyId = parse(actionMetadata?.keyId, zapRunDetails?.metadata);

        const valsToSend: Record<string, any> = {};

        if (actionMetadata) {
          for (const [key, valueObj] of Object.entries(actionMetadata)) {
            if (key === "dbId") continue;
            valsToSend[key] = {};
            valsToSend[key].type = valueObj.type;
            valsToSend[key].value = parse(valueObj.value, combinedObject);
          }
        }

        console.log(valsToSend);

        console.log(`Sending the data to create notion field`);

        const notionUrl = createNotion(
          valsToSend,
          //@ts-ignore
          actionMetadata["dbId"],
          combinedObject.userId
        );

        extra["notionUrl"] = await notionUrl;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("PROCESS DONE");

      const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1; //figuring out the last sortorder which tells if there is any further action for that zap

      if (stage !== lastStage && res) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                ...parsedData,
                ...extra,
                zapRunId,
                stage: stage + 1,
              }),
            },
          ],
        });
      } else if (!res) {
        console.log("ZAP RUN STOPPED DUE TO FALSE FILTER CONDITION");
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
