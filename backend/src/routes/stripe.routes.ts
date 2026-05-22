import { Router } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { config } from "../config";

const router = Router();

router.post("/checkout", authenticate(), authorize(UserRole.AGENCY_ADMIN, UserRole.ADMIN), async (req, res) => {
  if (!config.stripe.secretKey) return sendError(res, "Stripe not configured", 503);
  sendSuccess(res, { message: "Configure STRIPE_SECRET_KEY for checkout" });
});

router.post("/webhook", async (_req, res) => {
  const agencyId = _req.body?.metadata?.agencyId;
  if (agencyId) {
    await prisma.subscription.upsert({
      where: { agencyId },
      create: {
        agencyId,
        plan: "PREMIUM",
        active: true,
        listingsLimit: 50,
        featuredSlots: 5,
      },
      update: { active: true, plan: "PREMIUM" },
    });
  }
  res.json({ received: true });
});

export default router;
