import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config";
import apiRoutes from "./routes";
import { ensurePropertyIndex } from "./lib/elasticsearch";
import { prisma } from "./lib/prisma";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: config.corsOrigin, credentials: true },
});

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api",
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    skip: (req) => req.path.startsWith("/auth/login") || req.path.startsWith("/auth/otp/send") || req.path.startsWith("/auth/otp/verify"),
    standardHeaders: true,
    legacyHeaders: false,
  }),
  apiRoutes
);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("chat-message", async ({ roomId, senderId, content }: { roomId: string; senderId: string; content: string }) => {
    if (!roomId || !senderId || !content?.trim()) return;
    try {
      const msg = await prisma.chatMessage.create({
        data: { roomId, senderId, content: content.trim() },
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      });
      await prisma.chatRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });
      io.to(roomId).emit("chat-message", msg);
    } catch {
      socket.emit("chat-error", { message: "Failed to send message" });
    }
  });
});

async function bootstrap() {
  try {
    await ensurePropertyIndex();
  } catch (e) {
    console.warn("Startup optional services:", (e as Error).message);
  }
  httpServer.listen(config.port, () => {
    console.log(`PropVault API running on http://localhost:${config.port}`);
  });
}

bootstrap();

export { app, io };
