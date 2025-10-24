import axios from "axios";

type notionDatatype = Record<string, { type: string; value: string }>;
const BACKEND_URL = "http://localhost:3000";

export async function createNotion(data: notionDatatype, userId: number) {
  try {
    console.log("DATA", data);
    console.log("userId", userId);

    const properties = buildNotionProperties(data);

    // console.log(properties);

    console.log("Notion db updated successfully");
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
