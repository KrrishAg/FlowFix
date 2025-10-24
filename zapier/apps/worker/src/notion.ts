import prisma from "@repo/db/client";
import axios from "axios";
import cryptojs from "crypto-js";

type notionDatatype = Record<string, { type: string; value: string }>;

export async function createNotion(
  data: notionDatatype,
  dbId: string,
  userId: number
) {
  try {
    // console.log("DATA", data);
    // console.log("dbId", dbId);
    // console.log("userId", userId);

    const encryption_key = process.env.ENCRYPTION_KEY;
    //decrypting the notion api key from db
    if (!encryption_key) {
      throw new Error("No encryption key found in env while setting the api");
    }

    const credentials = await prisma.userCredentials.findFirst({
      where: { userId, service: "NOTION" },
    });

    if (!credentials) {
      throw new Error("Notion account not connected.");
    }

    const notionEncryptedApiKey = credentials.apikey;
    console.log("notionEncryptedApiKey", notionEncryptedApiKey, encryption_key);
    const bytes = cryptojs.AES.decrypt(notionEncryptedApiKey, encryption_key);
    const notionDecryptedApiKey = bytes.toString(cryptojs.enc.Utf8);

    console.log("notionDecryptedApiKey", notionDecryptedApiKey);

    if (!notionDecryptedApiKey) {
      console.log("Failed to decrypt credentials");
      throw new Error("Failed to decrypt credentials");
    }
    //done with getting notion api key

    const properties = buildNotionProperties(data);

    const response = await axios.post(
      `https://api.notion.com/v1/pages`,
      {
        parent: { database_id: dbId },
        properties: properties, // The dynamically built object
      },
      {
        headers: {
          Authorization: `Bearer ${notionDecryptedApiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );
    const pageUrl = response.data.url;

    console.log("Notion db updated successfully");

    //returning the page url so that next action may use it
    return pageUrl;
  } catch (error: any) {
    console.error("Failed to deal with notion:", error.message);
    return {
      success: false,
      error: "Failed to deal with notion.",
    };
  }
}

function buildNotionProperties(data: notionDatatype) {
  const properties: Record<string, any> = {};

  for (const [key, valueObj] of Object.entries(data)) {
    const propName = key;
    const propType = valueObj.type;
    const realValue = valueObj.value;

    switch (propType) {
      case "title":
        properties[propName] = {
          title: [{ text: { content: String(realValue) } }],
        };
        break;
      case "rich_text":
        properties[propName] = {
          rich_text: [{ text: { content: String(realValue) } }],
        };
        break;
      case "number":
        properties[propName] = { number: Number(realValue) };
        break;
      case "email":
        properties[propName] = { email: String(realValue) };
        break;
      case "select":
        properties[propName] = { select: { name: String(realValue) } };
        break;
      case "date":
        properties[propName] = { date: { start: String(realValue) } };
        break;
      // Can add more types here as cases
      default:
        console.warn(`Unsupported Notion property type: ${propType}`);
    }
  }

  return properties;
}
