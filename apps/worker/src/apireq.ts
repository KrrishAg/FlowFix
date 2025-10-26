("use server");

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface ApiDatatype {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function sendAPIReq(apiData: ApiDatatype) {
  try {
    let { url, method, headers = {}, body = {} } = apiData;

    if (!url) url = process.env.API_URL_TO_CHECK || "";

    console.log(url, method, headers, body);

    let response;

    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(url, { headers });
        break;

      case "POST":
        response = await axios.post(url, body, { headers });
        break;

      case "PUT":
        response = await axios.put(url, body, { headers });
        break;

      case "PATCH":
        response = await axios.patch(url, body, { headers });
        break;

      case "DELETE":
        response = await axios.delete(url, { headers, data: body }); // Axios allows body with delete
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    console.log("Status:", response.status);
    console.log("Data:", response.data);

    console.log("API req sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Hitting api endpoint sending error:", error);
    return {
      success: false,
      error: "Failed to hit thew endpoint. Please try again.",
    };
  }
}
