import { Prisma, PropertyStatus, ListingPurpose, PropertyCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { cacheGet, cacheSet, cacheDel } from "../lib/redis";
import { indexProperty, deletePropertyFromIndex, type ESPropertyDoc } from "../lib/elasticsearch";
import { slugify, uniqueSlug } from "../utils/slugify";
import type { PropertySearchFilters } from "../types/shared";

const propertyInclude = {
  images: { orderBy: { order: "asc" as const } },
  videos: true,
  amenities: { include: { amenity: true } },
  nearbyPlaces: true,
  city: true,
  area: true,
  propertyType: true,
  agent: { include: { user: { select: { firstName: true, lastName: true, avatar: true, phone: true, email: true } } } },
  agency: true,
  project: true,
} satisfies Prisma.PropertyInclude;

export async function searchProperties(filters: PropertySearchFilters) {
  const page = filters.page ?? 1;
  const limit = Math.min(filters.limit ?? 20, 50);
  const skip = (page - 1) * limit;
  const cacheKey = `search:${JSON.stringify(filters)}`;

  const cached = await cacheGet<{ items: unknown[]; total: number }>(cacheKey);
  if (cached) return { ...cached, page, limit, totalPages: Math.ceil(cached.total / limit) };

  const where: Prisma.PropertyWhereInput = {
    status: PropertyStatus.ACTIVE,
    ...(filters.purpose && { purpose: filters.purpose as ListingPurpose }),
    ...(filters.category && { category: filters.category as PropertyCategory }),
    ...(filters.cityId && { cityId: filters.cityId }),
    ...(filters.areaId && { areaId: filters.areaId }),
    ...(filters.propertyTypeId && { propertyTypeId: filters.propertyTypeId }),
    ...(filters.featured !== undefined && { featured: filters.featured }),
    ...(filters.bedrooms && { bedrooms: { gte: filters.bedrooms } }),
    ...(filters.bathrooms && { bathrooms: { gte: filters.bathrooms } }),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice && { gte: filters.minPrice }),
            ...(filters.maxPrice && { lte: filters.maxPrice }),
          },
        }
      : {}),
    ...(filters.minArea || filters.maxArea
      ? {
          areaSize: {
            ...(filters.minArea && { gte: filters.minArea }),
            ...(filters.maxArea && { lte: filters.maxArea }),
          },
        }
      : {}),
    ...(filters.q && {
      OR: [
        { title: { contains: filters.q } },
        { description: { contains: filters.q } },
        { address: { contains: filters.q } },
      ],
    }),
  };

  let orderBy: Prisma.PropertyOrderByWithRelationInput | Prisma.PropertyOrderByWithRelationInput[] = {
    createdAt: "desc",
  };
  switch (filters.sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "area_asc":
      orderBy = { areaSize: "asc" };
      break;
    case "area_desc":
      orderBy = { areaSize: "desc" };
      break;
    case "featured":
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
      break;
  }

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        city: true,
        area: true,
        propertyType: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  const result = { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  await cacheSet(cacheKey, { items, total }, 120);
  return result;
}

export async function getPropertyBySlug(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
    include: propertyInclude,
  });
  if (property) {
    await prisma.property.update({
      where: { id: property.id },
      data: { views: { increment: 1 } },
    });
  }
  return property;
}

export async function getFeatured(limit = 8) {
  const cacheKey = `featured:${limit}`;
  const cached = await cacheGet<unknown[]>(cacheKey);
  if (cached) return cached;

  const items = await prisma.property.findMany({
    where: { status: PropertyStatus.ACTIVE, featured: true },
    include: { images: { where: { isPrimary: true }, take: 1 }, city: true, area: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  await cacheSet(cacheKey, items, 300);
  return items;
}

export async function getTrending(limit = 8) {
  return prisma.property.findMany({
    where: { status: PropertyStatus.ACTIVE, trending: true },
    include: { images: { where: { isPrimary: true }, take: 1 }, city: true },
    take: limit,
    orderBy: { views: "desc" },
  });
}

export async function getSimilar(propertyId: string, limit = 6) {
  const prop = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!prop) return [];

  return prisma.property.findMany({
    where: {
      id: { not: propertyId },
      status: PropertyStatus.ACTIVE,
      cityId: prop.cityId,
      category: prop.category,
      purpose: prop.purpose,
    },
    include: { images: { where: { isPrimary: true }, take: 1 }, city: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function syncPropertyToElasticsearch(propertyId: string) {
  const p = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { city: true, area: true, propertyType: true, images: true },
  });
  if (!p || p.status !== PropertyStatus.ACTIVE) {
    await deletePropertyFromIndex(propertyId);
    return;
  }

  const doc: ESPropertyDoc = {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    purpose: p.purpose,
    category: p.category,
    price: Number(p.price),
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    areaSize: p.areaSize,
    areaUnit: p.areaUnit,
    cityId: p.cityId,
    cityName: p.city.name,
    areaId: p.areaId ?? undefined,
    areaName: p.area?.name,
    propertyTypeId: p.propertyTypeId,
    propertyTypeName: p.propertyType.name,
    featured: p.featured,
    trending: p.trending,
    latitude: p.latitude,
    longitude: p.longitude,
    location: { lat: p.latitude, lon: p.longitude },
    images: p.images.map((i) => i.url),
    createdAt: p.createdAt.toISOString(),
  };
  await indexProperty(doc);
}

export async function approveProperty(id: string) {
  const p = await prisma.property.update({
    where: { id },
    data: { status: PropertyStatus.ACTIVE, publishedAt: new Date() },
  });
  await syncPropertyToElasticsearch(id);
  await cacheDel("search:*");
  await cacheDel("featured:*");
  return p;
}

export async function createProperty(data: Prisma.PropertyCreateInput) {
  const slug = uniqueSlug(data.title as string, Date.now().toString(36).slice(-4));
  const property = await prisma.property.create({
    data: { ...data, slug: slugify(slug) },
    include: propertyInclude,
  });
  return property;
}

export async function updateProperty(id: string, data: Prisma.PropertyUpdateInput) {
  const property = await prisma.property.update({
    where: { id },
    data,
    include: propertyInclude,
  });

  await syncPropertyToElasticsearch(id);
  await cacheDel("search:*");
  await cacheDel("featured:*");
  return property;
}

export async function removeProperty(id: string) {
  const property = await prisma.property.delete({
    where: { id },
  });

  await deletePropertyFromIndex(id);
  await cacheDel("search:*");
  await cacheDel("featured:*");
  return property;
}
