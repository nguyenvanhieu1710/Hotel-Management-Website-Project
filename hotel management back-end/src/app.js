import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import homeRouter from "./routes/home";
import staffRouter from "./routes/staff";
import eventTypeRouter from "./routes/evenType";
import eventRouter from "./routes/event";
import accountRouter from "./routes/account";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import serviceRouter from "./routes/service";
import serviceTypeRouter from "./routes/serviceType";
import roomTypeRouter from "./routes/roomType";
import deviceType from "./routes/deviceType";

import connectDB from "./config/db";
import { connectSQLServer } from "./config/db";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

// connect database
// connectDB();
// connectSQLServer();

// routes
app.use("/", homeRouter);
app.use("/api", staffRouter);
app.use("/api", eventTypeRouter);
app.use("/api", eventRouter);
app.use("/api", accountRouter);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", serviceRouter);
app.use("/api", serviceTypeRouter);
app.use("/api", roomTypeRouter);
app.use("/api", deviceType);

// your beautiful code...

// if (import.meta.env.PROD) app.listen(3000);

export const viteNodeApp = app;
