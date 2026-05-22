import { Router } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const featured = req.query.featured === "true";
  const items = await prisma.agency.findMany({
    where: featured ? { featured: true } : undefined,
    include: { city: true, _count: { select: { agents: true, properties: true } } },
    orderBy: { rating: "desc" },
    take: 20,
  });
  sendSuccess(res, items);
});

router.get("/:slug", async (req, res) => {
  const agency = await prisma.agency.findUnique({
    where: { slug: req.params.slug },
    include: {
      city: true,
      agents: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
      properties: {
        where: { status: "ACTIVE" },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        take: 12,
      },
    },
  });
  if (!agency) return sendError(res, "Agency not found", 404);
  sendSuccess(res, agency);
});

export default router;
