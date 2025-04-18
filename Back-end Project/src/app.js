import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import homeRouter from "./routes/home";
import staffRouter from "./routes/staff";
import eventTypeRouter from "./routes/evenType";
import eventRouter from "./routes/event";
import eventVotes from "./routes/eventVotes";
import accountRouter from "./routes/account";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import serviceRouter from "./routes/service";
import serviceTypeRouter from "./routes/serviceType";
import serviceVotesRouter from "./routes/serviceVotes";
import rooms from "./routes/room";
import roomTypeRouter from "./routes/roomType";
import device from "./routes/device";
import deviceType from "./routes/deviceType";
import bookingVotes from "./routes/bookingVotes";
import bookingVotesDetail from "./routes/bookingVotesDetail";
import rentRoomVotes from "./routes/rentRoomVotes";
import rentRoomVotesDetail from "./routes/rentRoomVotesDetail";
import bill from "./routes/bill";
import evaluation from "./routes/evaluation";
import payment from "./routes/payment";

// import connectDB from "./config/db";
// import { connectSQLServer } from "./config/db";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
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
app.use("/api", eventVotes);
app.use("/api", accountRouter);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", serviceRouter);
app.use("/api", serviceTypeRouter);
app.use("/api", serviceVotesRouter);
app.use("/api", rooms);
app.use("/api", roomTypeRouter);
app.use("/api", device);
app.use("/api", deviceType);
app.use("/api", bookingVotes);
app.use("/api", bookingVotesDetail);
app.use("/api", rentRoomVotes);
app.use("/api", rentRoomVotesDetail);
app.use("/api", bill);
app.use("/api", evaluation);
app.use("/api", payment);

export const viteNodeApp = app;
