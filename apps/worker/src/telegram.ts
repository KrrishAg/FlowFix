import axios from "axios";

interface TelegramDatatype {
  botToken: string;
  chatId: string;
  message: string;
}

export async function sendTelegramMessage(data: TelegramDatatype) {
  try {
    let { botToken, chatId, message } = data;
    if (!botToken) botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    if (!chatId) chatId = process.env.TELEGRAM_CHATID || "";
    if (!message) message = "This is the default message, ENJOY :D";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    console.log("Telegram message sent successfully");
  } catch (error: any) {
    console.error("Telegram action failed:", error);
  }
}
