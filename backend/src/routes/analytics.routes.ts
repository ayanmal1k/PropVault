import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { sendSuccess } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/event", async (req, res) => {
  const { event, entityType, entityId, metadata } = req.body;
  await prisma.analyticsEvent.create({
    data: { event, entityType, entityId, userId: req.body.userId, metadata },
  });
  sendSuccess(res, { tracked: true });
});

router.get("/overview", authenticate(), authorize(UserRole.ADMIN), async (_req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const events = await prisma.analyticsEvent.groupBy({
    by: ["event"],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: true,
  });
  const topProperties = await prisma.property.findMany({
    orderBy: { views: "desc" },
    take: 10,
    select: { id: true, title: true, slug: true, views: true },
  });
  sendSuccess(res, { events, topProperties });
});

export default router;
