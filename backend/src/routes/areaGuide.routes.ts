import { Router } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await prisma.areaGuide.findMany({
    where: { published: true },
    include: { city: true, area: true },
    orderBy: { createdAt: "desc" },
  });
  sendSuccess(res, items);
});

router.get("/:slug", async (req, res) => {
  const guide = await prisma.areaGuide.findUnique({
    where: { slug: req.params.slug },
    include: { city: true, area: true },
  });
  if (!guide) return sendError(res, "Guide not found", 404);
  sendSuccess(res, guide);
});

export default router;
