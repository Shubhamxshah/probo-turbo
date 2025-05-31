import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { eventRouter } from "./routes/event";
import { balanceRouter } from "./routes/balance";
import { tradeRouter } from "./routes/trade";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/balance", balanceRouter);
app.use("/api/v1/trade", tradeRouter);

const PORT = process.env.PORT || 3001;

app.get("/health", (_, res) => {
  res.json({message: "hello shubham"})
})
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})



