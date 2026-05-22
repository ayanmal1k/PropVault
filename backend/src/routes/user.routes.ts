import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/me", authenticate(), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      locale: true,
      darkMode: true,
      agent: { include: { agency: true } },
    },
  });
  if (!user) return sendError(res, "User not found", 404);
  sendSuccess(res, user);
});

router.patch("/me", authenticate(), async (req, res) => {
  const { firstName, lastName, locale, darkMode, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { firstName, lastName, locale, darkMode, avatar },
    select: { id: true, email: true, firstName: true, lastName: true, locale: true, darkMode: true },
  });
  sendSuccess(res, user);
});

router.get("/me/dashboard", authenticate(), async (req, res) => {
  const userId = req.user!.userId;
  const [favorites, savedSearches, messages] = await Promise.all([
    prisma.favorite.count({ where: { userId } }),
    prisma.savedSearch.count({ where: { userId } }),
    prisma.message.count({ where: { userId, status: "NEW" } }),
  ]);
  sendSuccess(res, { favorites, savedSearches, messages });
});

export default router;
