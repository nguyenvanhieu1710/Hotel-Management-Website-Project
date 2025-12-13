import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Import middleware
import { apiLimiter } from "./middleware/rateLimiter.js";
import errorHandler, { notFoundHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

// Import routes
import homeRouter from "./routes/home.js";
import staffRouter from "./routes/staff.js";
import eventTypeRouter from "./routes/evenType.js";
import eventRouter from "./routes/event.js";
import eventVotes from "./routes/eventVotes.js";
import accountRouter from "./routes/account.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import serviceRouter from "./routes/service.js";
import serviceTypeRouter from "./routes/serviceType.js";
import serviceVotesRouter from "./routes/serviceVotes.js";
import rooms from "./routes/room.js";
import roomTypeRouter from "./routes/roomType.js";
import device from "./routes/device.js";
import deviceType from "./routes/deviceType.js";
import bookingVotes from "./routes/bookingVotes.js";
import bookingVotesDetail from "./routes/bookingVotesDetail.js";
import rentRoomVotes from "./routes/rentRoomVotes.js";
import rentRoomVotesDetail from "./routes/rentRoomVotesDetail.js";
import bill from "./routes/bill.js";
import evaluation from "./routes/evaluation.js";
import payment from "./routes/payment.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api", apiLimiter);

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/", homeRouter);
app.use("/api", authRouter);
app.use("/api", accountRouter);
app.use("/api", userRouter);
app.use("/api", staffRouter);
app.use("/api", eventTypeRouter);
app.use("/api", eventRouter);
app.use("/api", eventVotes);
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

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

export const viteNodeApp = app;
