import express from "express";
import cors from "cors";
import userRouter from "./routes/user.js";
import zapRouter from "./routes/zap.js";
import { triggerRouter } from "./routes/trigger.js";
import { actionRouter } from "./routes/action.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.listen(3000, () => {
  console.log("Primary backend listening on prt 3000");
});
