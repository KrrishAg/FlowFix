//@ts-ignore
import prisma from "./index.ts";

async function main() {
  await prisma.availableTrigger.create({
    data: {
      id: "webhook",
      name: "Webhook",
      image:
        "https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "send-sol",
      name: "Send Solana",
      image: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "email",
      name: "Send Email",
      image:
        "https://img.freepik.com/premium-vector/orange-envelope-with-t-mail-logo-it_1277826-407.jpg?semt=ais_hybrid&w=740&q=80",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "sms",
      name: "Send SMS",
      image:
        "https://media.istockphoto.com/id/1047557398/vector/chat-bubble-message-vector-icon-or-typing-chat-or-comment-notification.jpg?s=612x612&w=0&k=20&c=r3ixDRcehZq1Mh9kgRqfuzn3e11MPP5w7CjoFjHkzkk=",
    },
  });
}

main();
