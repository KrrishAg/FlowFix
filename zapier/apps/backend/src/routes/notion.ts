import express from "express";
import { authMiddleware } from "../middleware.js";
import prisma from "@repo/db/client";
import { Client } from "@notionhq/client";
import axios from "axios";

export const notionRouter = express.Router();
const NOTION_API_URL = "https://api.notion.com/v1";

//creating a zap
notionRouter.get("/databases", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.id;
    const credentials = await prisma.userCredentials.findFirst({
      where: { userId, service: "NOTION" },
    });

    if (!credentials) {
      return res.status(401).json({ error: "Notion account not connected." });
    }

    const notionApiKey = credentials.apikey;

    const notion = new Client({ auth: notionApiKey });

    //using the url version
    const response = await axios.post(
      `${NOTION_API_URL}/search`,
      {}, // no filters
      {
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );

    console.log(response.data);
    console.log(response.data.results);
    const results: any[] = response.data.results; //pages/databases, everything here

    const databases = results
      .filter((db) => db.object === "database") //filter dbs
      .map((db) => {
        //convertig into a smaller object
        const title = db.title?.[0]?.plain_text || "Untitled Database";
        return {
          id: db.id,
          name: title,
        };
      });

    res.json(databases);
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});
