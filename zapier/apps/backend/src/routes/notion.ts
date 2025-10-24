import express from "express";
import { authMiddleware } from "../middleware.js";
import prisma from "@repo/db/client";
import { Client } from "@notionhq/client";
import axios from "axios";

export const notionRouter = express.Router();
const NOTION_API_URL = "https://api.notion.com/v1";

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

    // console.log(response.data);

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

    res.json({ databases });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(404).json({ error });
  }
});

//getting schema for a databse
notionRouter.get("/database/:dbId", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.id;
    const { dbId } = req.params;
    // console.log(dbId);
    const credentials = await prisma.userCredentials.findFirst({
      where: { userId, service: "NOTION" },
    });

    if (!credentials) {
      return res.status(401).json({ error: "Notion account not connected." });
    }

    const notionApiKey = credentials.apikey;

    //using the url version
    const response = await axios.get(`${NOTION_API_URL}/databases/${dbId}`, {
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Notion-Version": "2022-06-28",
      },
    });

    // console.log(response.data);

    const props = response.data.properties; //This is the schema

    const properties = Object.keys(props).map((key) => ({
      name: key,
      type: props[key].type,
    }));

    console.log(properties);

    res.json({ properties });
  } catch (error: any) {
    console.log("ERROR", error.message);
    return res.status(404).json({ error });
  }
});
