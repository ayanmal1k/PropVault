import { prisma } from "../lib/prisma";

export async function getPropertyRecommendations(userId: string, limit = 8) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { property: { include: { city: true, propertyType: true } } },
    take: 10,
  });

  if (favorites.length === 0) {
    return prisma.property.findMany({
      where: { status: "ACTIVE", featured: true },
      include: { images: { where: { isPrimary: true }, take: 1 }, city: true },
      take: limit,
    });
  }

  const cityIds = [...new Set(favorites.map((f) => f.property.cityId))];
  const categories = [...new Set(favorites.map((f) => f.property.category))];
  const avgPrice =
    favorites.reduce((s, f) => s + Number(f.property.price), 0) / favorites.length;

  return prisma.property.findMany({
    where: {
      status: "ACTIVE",
      cityId: { in: cityIds },
      category: { in: categories },
      price: { gte: avgPrice * 0.7, lte: avgPrice * 1.3 },
      id: { notIn: favorites.map((f) => f.propertyId) },
    },
    include: { images: { where: { isPrimary: true }, take: 1 }, city: true },
    take: limit,
    orderBy: { views: "desc" },
  });
}

export async function predictPropertyPrice(propertyId: string): Promise<number | null> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { city: true, area: true, propertyType: true },
  });
  if (!property) return null;

  if (property.aiPriceEstimate) return Number(property.aiPriceEstimate);

  const comps = await prisma.property.findMany({
    where: {
      cityId: property.cityId,
      category: property.category,
      status: "ACTIVE",
      id: { not: propertyId },
    },
    select: { price: true, areaSize: true },
    take: 20,
  });

  const avgComp =
    comps.length > 0
      ? comps.reduce((s, c) => s + Number(c.price), 0) / comps.length
      : Number(property.price);

  const sizeFactor = property.areaSize > 0 ? 1 : 1;
  const estimate = Math.round((avgComp * 0.6 + Number(property.price) * 0.4) * sizeFactor);

  await prisma.property.update({
    where: { id: propertyId },
    data: { aiPriceEstimate: estimate },
  });

  return estimate;
}
