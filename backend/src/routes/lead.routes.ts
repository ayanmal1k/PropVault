import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { sendSuccess } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

const router = Router();

const inquirySchema = z.object({
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().min(1),
  whatsapp: z.boolean().optional(),
});

router.post("/inquiry", validateBody(inquirySchema), async (req, res) => {
  const { propertyId, agentId, name, email, phone, subject, body, whatsapp } = req.body;

  const message = await prisma.message.create({
    data: {
      name,
      email,
      phone,
      subject: subject || "Property Inquiry",
      body,
      whatsapp: whatsapp ?? false,
      propertyId,
      userId: req.body.userId,
    },
  });

  if (agentId) {
    await prisma.lead.create({
      data: { agentId, propertyId, name, email, phone: phone || "", source: whatsapp ? "whatsapp" : "form" },
    });
  }

  sendSuccess(res, { message, whatsappLink: whatsapp && phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null }, 201);
});

router.get("/agent", authenticate(), async (req, res) => {
  const agent = await prisma.agent.findUnique({ where: { userId: req.user!.userId } });
  if (!agent) return sendSuccess(res, []);
  const leads = await prisma.lead.findMany({
    where: { agentId: agent.id },
    include: { property: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  sendSuccess(res, leads);
});

export default router;
