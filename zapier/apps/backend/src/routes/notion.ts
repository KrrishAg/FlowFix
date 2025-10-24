import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import axios from "axios";
import { notionKeyMiddleware } from "../middlewares/notionKeyMiddleware.js";

export const notionRouter = express.Router();
const NOTION_API_URL = "https://api.notion.com/v1";

notionRouter.get(
  "/databases",
  authMiddleware,
  notionKeyMiddleware,
  async (req, res) => {
    try {

      //already have notionApiKey in req object due to middleware
      //@ts-ignore
      const notionApiKey = req.notionApiKey;

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
  }
);

//getting schema for a databse
notionRouter.get(
  "/database/:dbId",
  authMiddleware,
  notionKeyMiddleware,
  async (req, res) => {
    try {
      //@ts-ignore
      const userId = req.id;
      const { dbId } = req.params;
      // console.log(dbId);

      //already have notionApiKey in req object due to middleware
      //@ts-ignore
      const notionApiKey = req.notionApiKey;

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
  }
);
