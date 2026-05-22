import { Router } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = 10;
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);
  sendSuccess(res, { items, total, page, limit });
});

router.get("/:slug", async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug, published: true },
    include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
  });
  if (!post) return sendError(res, "Post not found", 404);
  await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  sendSuccess(res, post);
});

export default router;
