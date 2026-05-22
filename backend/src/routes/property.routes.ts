import { Router } from "express";
import { z } from "zod";
import * as propertyService from "../services/property.service";
import { elasticsearchSearch, locationAutocomplete } from "../services/search.service";
import { predictPropertyPrice, getPropertyRecommendations } from "../services/ai.service";
import { validateQuery } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../lib/prisma";
import { indexProperty, type ESPropertyDoc } from "../lib/elasticsearch";
import { slugify, uniqueSlug } from "../utils/slugify";
import { UserRole } from "@prisma/client";

const router = Router();

const searchSchema = z.object({
  q: z.string().optional(),
  purpose: z.enum(["SALE", "RENT"]).optional(),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT", "PROJECT"]).optional(),
  cityId: z.string().optional(),
  areaId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  propertyTypeId: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "area_asc", "area_desc", "featured"]).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  useElasticsearch: z.coerce.boolean().optional(),
});

const createPropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  purpose: z.enum(["SALE", "RENT"]),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT", "PROJECT"]),
  price: z.number().positive("Price must be positive"),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  areaSize: z.number().positive("Area must be positive"),
  areaUnit: z.string().default("MARLA"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.number(),
  longitude: z.number(),
  cityId: z.string(),
  areaId: z.string().optional(),
  propertyTypeId: z.string(),
  furnishingStatus: z.string().optional(),
  possessionStatus: z.string().optional(),
  builtYear: z.number().int().optional(),
  floorsCount: z.number().int().optional(),
  facingDirection: z.string().optional(),
  images: z.array(z.object({ url: z.string(), isPrimary: z.boolean().optional() })).optional(),
});

// Public: Get all cities
router.get("/cities/list", async (req, res) => {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
    sendSuccess(res, cities);
  } catch (error) {
    sendError(res, "Failed to fetch cities");
  }
});

// Public: Get areas for a city
router.get("/cities/:cityId/areas", async (req, res) => {
  try {
    const areas = await prisma.area.findMany({
      where: { cityId: req.params.cityId },
      orderBy: { name: "asc" },
    });
    sendSuccess(res, areas);
  } catch (error) {
    sendError(res, "Failed to fetch areas");
  }
});

// Public: Get all property types
router.get("/types", async (req, res) => {
  try {
    const types = await prisma.propertyType.findMany({ orderBy: { name: "asc" } });
    sendSuccess(res, types);
  } catch (error) {
    sendError(res, "Failed to fetch property types");
  }
});

// Authenticated: Create property
router.post("/", authenticate(), async (req, res) => {
  try {
    const validated = createPropertySchema.parse(req.body);
    const user = req.user!;

    // Get agent details for non-admin users.
    const agent = await prisma.agent.findUnique({ where: { userId: user.userId } });
    if (!agent && user.role !== UserRole.ADMIN) {
      return sendError(res, "User is not an agent", 403);
    }

    const createData = (slug: string) => ({
      title: validated.title,
      slug,
      description: validated.description,
      purpose: validated.purpose,
      category: validated.category,
      status: "PENDING" as const,
      price: validated.price,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms,
      areaSize: validated.areaSize,
      areaUnit: validated.areaUnit || "MARLA",
      address: validated.address,
      latitude: validated.latitude,
      longitude: validated.longitude,
      cityId: validated.cityId,
      areaId: validated.areaId,
      propertyTypeId: validated.propertyTypeId,
      agentId: agent?.id,
      agencyId: agent?.agencyId,
      furnishingStatus: validated.furnishingStatus,
      possessionStatus: validated.possessionStatus,
      builtYear: validated.builtYear,
      floorsCount: validated.floorsCount,
      facingDirection: validated.facingDirection,
      images: validated.images
        ? {
            createMany: {
              data: validated.images.map((img, idx) => ({
                url: img.url,
                isPrimary: img.isPrimary || idx === 0,
                order: idx,
              })),
            },
          }
        : undefined,
    });

    let property = null;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const slugSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const slug = uniqueSlug(validated.title, slugSuffix);

      try {
        property = await prisma.property.create({
          data: createData(slug),
          include: {
            images: true,
            agent: { include: { user: true } },
            city: true,
            area: true,
            propertyType: true,
          },
        });
        break;
      } catch (error) {
        lastError = error;
        if (!(error instanceof Error) || !("code" in error) || (error as { code?: string }).code !== "P2002") {
          throw error;
        }
      }
    }

    if (!property) {
      console.error("Create property error:", lastError);
      return sendError(res, "Failed to create property", 500);
    }

    // Index in Elasticsearch for search
    await indexProperty({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      city: property.city?.name || "",
      area: property.area?.name || "",
      address: property.address,
      lat: property.latitude,
      lng: property.longitude,
    } as ESPropertyDoc);

    sendSuccess(res, property, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    console.error("Create property error:", error);
    sendError(res, "Failed to create property");
  }
});

router.get("/search", validateQuery(searchSchema), async (req, res) => {
  const filters = req.query as z.infer<typeof searchSchema>;
  const result = filters.useElasticsearch
    ? await elasticsearchSearch(filters)
    : await propertyService.searchProperties(filters);
  sendSuccess(res, result, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

router.get("/search", validateQuery(searchSchema), async (req, res) => {
  const filters = req.query as z.infer<typeof searchSchema>;
  const result = filters.useElasticsearch
    ? await elasticsearchSearch(filters)
    : await propertyService.searchProperties(filters);
  sendSuccess(res, result, 200, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

router.get("/autocomplete", async (req, res) => {
  const q = (req.query.q as string) || "";
  if (q.length < 2) return sendSuccess(res, []);
  const results = await locationAutocomplete(q);
  sendSuccess(res, results);
});

router.get("/recommendations/me", authenticate(), async (req, res) => {
  const items = await getPropertyRecommendations(req.user!.userId);
  sendSuccess(res, items);
});

router.get("/featured", async (req, res) => {
  const limit = parseInt((req.query.limit as string) || "8", 10);
  const items = await propertyService.getFeatured(limit);
  sendSuccess(res, items);
});

router.get("/trending", async (req, res) => {
  const limit = parseInt((req.query.limit as string) || "8", 10);
  const items = await propertyService.getTrending(limit);
  sendSuccess(res, items);
});

router.get("/:slug", async (req, res) => {
  const property = await propertyService.getPropertyBySlug(req.params.slug);
  if (!property) return sendError(res, "Property not found", 404);
  sendSuccess(res, property);
});

router.get("/:slug/similar", async (req, res) => {
  const property = await prisma.property.findUnique({ where: { slug: req.params.slug } });
  if (!property) return sendError(res, "Property not found", 404);
  const similar = await propertyService.getSimilar(property.id);
  sendSuccess(res, similar);
});

router.get("/:slug/price-prediction", async (req, res) => {
  const property = await prisma.property.findUnique({ where: { slug: req.params.slug } });
  if (!property) return sendError(res, "Property not found", 404);
  const estimate = await predictPropertyPrice(property.id);
  sendSuccess(res, { estimate, listedPrice: Number(property.price) });
});

export default router;
