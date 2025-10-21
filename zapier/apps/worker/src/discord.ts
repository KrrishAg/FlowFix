import axios from "axios";

interface DiscordType {
  url: string;
  message: string;
  hyperlink?: string;
  title?: string;
}

export async function sendDiscordMessage(data: DiscordType) {
  try {
    console.log("DATA", data);
    const url = data.url || process.env.DISCORD_WEBHOOK_URL || "";
    await axios.post(url, {
      username: "KrRiSh",
      content: `${data.message} ${data.title ? `==== [${data.title}](${data.hyperlink})` : ""}`,
    });
    console.log("Discord message sent successfully");
  } catch (error: any) {
    console.error("Failed to send Discord message:", error.message);
    return {
      success: false,
      error: "Failed to send discord msg. Please try again.",
    };
  }
}
