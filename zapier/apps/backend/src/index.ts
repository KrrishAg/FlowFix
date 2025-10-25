import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.js";
import { zapRouter } from "./routes/zap.js";
import { triggerRouter } from "./routes/trigger.js";
import { actionRouter } from "./routes/action.js";
import { userCredRouter } from "./routes/userCred.js";
import { notionRouter } from "./routes/notion.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.use("/api/v1/usercred", userCredRouter);

app.use("/api/v1/notion", notionRouter);

app.listen(3001, () => {
  console.log("Primary backend listening on prt 3001");
});
