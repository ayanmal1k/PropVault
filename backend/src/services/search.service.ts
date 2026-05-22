import type { PropertySearchFilters } from "../types/shared";
import { searchProperties } from "./property.service";
import { prisma } from "../lib/prisma";

export async function elasticsearchSearch(filters: PropertySearchFilters) {
  return searchProperties(filters);
}

export async function locationAutocomplete(q: string) {
  const [cities, areas] = await Promise.all([
    prisma.city
      .findMany({
        where: { name: { contains: q } },
        take: 5,
        select: { id: true, name: true, slug: true },
      })
      .then((r) => r.map((c) => ({ ...c, type: "city" as const }))),
    prisma.area
      .findMany({
        where: { name: { contains: q } },
        take: 10,
        include: { city: { select: { name: true } } },
      })
      .then((r) =>
        r.map((a) => ({
          id: a.id,
          name: `${a.name}, ${a.city.name}`,
          slug: a.slug,
          cityId: a.cityId,
          type: "area" as const,
        }))
      ),
  ]);

  return [...cities, ...areas].slice(0, 12);
}
