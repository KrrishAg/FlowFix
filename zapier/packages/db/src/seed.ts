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

  await prisma.availableAction.create({
    data: {
      id: "discord",
      name: "Discord Message",
      image:
        "https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "telegram",
      name: "Telegram",
      image:
        "https://pngdownload.io/wp-content/uploads/2025/07/Telegram-Logo-Icon-Messaging-App.webp",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "apireq",
      name: "HTTP Endpoint",
      image: "https://cdn-icons-png.flaticon.com/512/3165/3165065.png",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "filter",
      name: "Filter Condition",
      image:
        "https://img.freepik.com/free-photo/filter-icon-front-side_187299-45145.jpg?semt=ais_hybrid&w=740&q=80",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "razorpay",
      name: "Create Razorpay Link",
      image:
        "https://play-lh.googleusercontent.com/2BQu8Y7Ah9Gh9CZvmaMSYIcZvdO4KfdJ26EZ1WGyaOG_xxeDxNn-AZYxOtQJvyQQPFY",
    },
  });
  
  await prisma.availableAction.create({
    data: {
      id: "notion",
      name: "Notion",
      image:
        "https://cdn.iconscout.com/icon/free/png-256/free-notion-logo-icon-svg-download-png-8630396.png",
    },
  });
}

main();
