import express from "express";
import { authMiddleware } from "../middleware.js";

const zapRouter = express.Router();

zapRouter.post("/", authMiddleware, (req, res) => {
  console.log("Trying to create a zap");
});

zapRouter.get("/", authMiddleware, (req, res) => {
  console.log("Get all zaps");
});

zapRouter.get("/:zapid", authMiddleware, (req, res) => {
  console.log("Trying to details of a particular zap");
});

export default zapRouter;
