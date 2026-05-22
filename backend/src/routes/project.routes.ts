import { Router } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const featured = req.query.featured === "true";
  const items = await prisma.project.findMany({
    where: featured ? { featured: true } : undefined,
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  sendSuccess(res, items);
});

router.get("/:slug", async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: {
      properties: {
        where: { status: "ACTIVE" },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      },
    },
  });
  if (!project) return sendError(res, "Project not found", 404);
  sendSuccess(res, project);
});

export default router;
