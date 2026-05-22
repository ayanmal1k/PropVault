import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();

/* POST /api/chat/rooms — create or fetch a room for this property */
router.post("/rooms", authenticate, async (req: Request, res: Response): Promise<void> => {
  const { propertyId } = req.body as { propertyId: string };
  const buyerId = (req as Request & { user: { id: string } }).user.id;

  if (!propertyId) { sendError(res, "propertyId required"); return; }

  try {
    /* find property and get agent's userId as seller */
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { agent: { include: { user: true } } },
    });
    if (!property) { sendError(res, "Property not found", 404); return; }

    const sellerId = property.agent?.user.id;
    if (!sellerId) { sendError(res, "No seller found for this property"); return; }
    if (sellerId === buyerId) { sendError(res, "Cannot chat with yourself"); return; }

    /* look for existing room with these exact 2 participants */
    const existing = await prisma.chatRoom.findFirst({
      where: {
        propertyId,
        AND: [
          { participants: { some: { userId: buyerId } } },
          { participants: { some: { userId: sellerId } } },
        ],
      },
      include: {
        participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      },
    });

    if (existing) { sendSuccess(res, existing); return; }

    /* create new room */
    const room = await prisma.chatRoom.create({
      data: {
        propertyId,
        participants: { create: [{ userId: buyerId }, { userId: sellerId }] },
      },
      include: {
        participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      },
    });

    sendSuccess(res, room, 201);
  } catch (e) {
    console.error(e);
    sendError(res, "Server error", 500);
  }
});

/* GET /api/chat/rooms — list my rooms */
router.get("/rooms", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    sendSuccess(res, rooms);
  } catch (e) {
    sendError(res, "Server error", 500);
  }
});

/* GET /api/chat/rooms/:roomId/messages */
router.get("/rooms/:roomId/messages", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const roomId = req.params.roomId as string;
  const page = parseInt((req.query.page as string) ?? "1");

  try {
    const participant = await prisma.chatParticipant.findFirst({ where: { roomId: roomId, userId: userId } });
    if (!participant) { sendError(res, "Forbidden", 403); return; }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId: roomId },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 50,
      take: 50,
    });
    sendSuccess(res, messages.reverse());
  } catch (e) {
    sendError(res, "Server error", 500);
  }
});

/* POST /api/chat/rooms/:roomId/messages */
router.post("/rooms/:roomId/messages", authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const roomId = req.params.roomId as string;
  const { content } = req.body as { content: string };

  if (!content?.trim()) { sendError(res, "content required"); return; }

  try {
    const participant = await prisma.chatParticipant.findFirst({ where: { roomId: roomId, userId: userId } });
    if (!participant) { sendError(res, "Forbidden", 403); return; }

    const message = await prisma.chatMessage.create({
      data: { roomId: roomId, senderId: userId, content: content.trim() },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    await prisma.chatRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });
    sendSuccess(res, message, 201);
  } catch (e) {
    sendError(res, "Server error", 500);
  }
});

export default router;
