import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authenticate());

router.get("/", async (req, res) => {
  const items = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    include: {
      property: {
        include: { images: { where: { isPrimary: true }, take: 1 }, city: true, area: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  sendSuccess(res, items.map((f) => f.property));
});

router.post("/:propertyId", async (req, res) => {
  const fav = await prisma.favorite.upsert({
    where: {
      userId_propertyId: { userId: req.user!.userId, propertyId: req.params.propertyId },
    },
    create: { userId: req.user!.userId, propertyId: req.params.propertyId },
    update: {},
  });
  sendSuccess(res, fav, 201);
});

router.delete("/:propertyId", async (req, res) => {
  await prisma.favorite.deleteMany({
    where: { userId: req.user!.userId, propertyId: req.params.propertyId },
  });
  sendSuccess(res, { removed: true });
});

router.get("/check/:propertyId", async (req, res) => {
  const fav = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: { userId: req.user!.userId, propertyId: req.params.propertyId },
    },
  });
  sendSuccess(res, { favorited: !!fav });
});

export default router;
