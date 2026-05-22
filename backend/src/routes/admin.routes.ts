import { Router } from "express";
import { z } from "zod";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole, PropertyStatus } from "@prisma/client";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";
import * as propertyService from "../services/property.service";

const router = Router();
router.use(authenticate(), authorize(UserRole.ADMIN));

const updatePropertySchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  purpose: z.enum(["SALE", "RENT"]).optional(),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT", "PROJECT"]).optional(),
  price: z.number().positive().optional(),
  bedrooms: z.number().int().nullable().optional(),
  bathrooms: z.number().int().nullable().optional(),
  areaSize: z.number().positive().optional(),
  areaUnit: z.string().optional(),
  address: z.string().min(3).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  cityId: z.string().optional(),
  areaId: z.string().nullable().optional(),
  propertyTypeId: z.string().optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  furnishingStatus: z.string().nullable().optional(),
  possessionStatus: z.string().nullable().optional(),
  builtYear: z.number().int().nullable().optional(),
  floorsCount: z.number().int().nullable().optional(),
  facingDirection: z.string().nullable().optional(),
});

router.get("/dashboard", async (_req, res) => {
  const [users, properties, pending, revenue, reports] = await Promise.all([
    prisma.user.count(),
    prisma.property.count({ where: { status: PropertyStatus.ACTIVE } }),
    prisma.property.count({ where: { status: PropertyStatus.PENDING } }),
    prisma.subscription.count({ where: { active: true, plan: { not: "FREE" } } }),
    prisma.report.count({ where: { status: "OPEN" } }),
  ]);
  sendSuccess(res, { users, properties, pending, activeSubscriptions: revenue, openReports: reports });
});

router.get("/users", async (req, res) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = 20;
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);
  sendSuccess(res, { items, total, page, limit });
});

router.get("/properties", async (req, res) => {
  const status = req.query.status as PropertyStatus | "ALL" | undefined;
  const items = await prisma.property.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    include: {
      city: true,
      area: true,
      agency: true,
      propertyType: true,
      images: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  sendSuccess(res, items);
});

router.patch("/properties/:id", async (req, res) => {
  try {
    const data = updatePropertySchema.parse(req.body);
    const property = await propertyService.updateProperty(req.params.id, data);
    sendSuccess(res, property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    sendError(res, "Failed to update property", 400);
  }
});

router.delete("/properties/:id", async (req, res) => {
  try {
    await propertyService.removeProperty(req.params.id);
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete property", 400);
  }
});

router.post("/properties/:id/approve", async (req, res) => {
  const p = await propertyService.approveProperty(req.params.id);
  sendSuccess(res, p);
});

router.post("/properties/:id/reject", async (req, res) => {
  const p = await prisma.property.update({
    where: { id: req.params.id },
    data: { status: PropertyStatus.REJECTED },
  });
  sendSuccess(res, p);
});

router.get("/reports", async (_req, res) => {
  const items = await prisma.report.findMany({
    include: { user: { select: { firstName: true, lastName: true } }, property: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  sendSuccess(res, items);
});

router.get("/advertisements", async (_req, res) => {
  const items = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, items);
});

export default router;
