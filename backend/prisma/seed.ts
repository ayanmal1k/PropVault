import { PrismaClient, UserRole, ListingPurpose, PropertyCategory, PropertyStatus, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PropVault database...");

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@propvault.com" },
    update: {},
    create: {
      email: "admin@propvault.com",
      passwordHash,
      firstName: "System",
      lastName: "Admin",
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const cities = await Promise.all(
    [
      { name: "Lahore", slug: "lahore", featured: true, latitude: 31.5204, longitude: 74.3587 },
      { name: "Karachi", slug: "karachi", featured: true, latitude: 24.8607, longitude: 67.0011 },
      { name: "Islamabad", slug: "islamabad", featured: true, latitude: 33.6844, longitude: 73.0479 },
      { name: "Rawalpindi", slug: "rawalpindi", latitude: 33.5651, longitude: 73.0169 },
    ].map((c) =>
      prisma.city.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );

  const lahore = cities[0];
  const islamabad = cities[2];

  const areas = await Promise.all(
    [
      { name: "DHA Defence", slug: "dha-defence", cityId: lahore.id },
      { name: "Bahria Town", slug: "bahria-town", cityId: lahore.id },
      { name: "Gulberg", slug: "gulberg", cityId: lahore.id },
      { name: "DHA Defence", slug: "dha-defence-isb", cityId: islamabad.id },
      { name: "B-17", slug: "b-17", cityId: islamabad.id },
    ].map((a) =>
      prisma.area.upsert({
        where: { cityId_slug: { cityId: a.cityId, slug: a.slug } },
        update: {},
        create: a,
      })
    )
  );

  const types = await Promise.all(
    [
      { name: "House", slug: "house", category: PropertyCategory.RESIDENTIAL },
      { name: "Flat", slug: "flat", category: PropertyCategory.RESIDENTIAL },
      { name: "Plot", slug: "plot", category: PropertyCategory.PLOT },
      { name: "Office", slug: "office", category: PropertyCategory.COMMERCIAL },
      { name: "Shop", slug: "shop", category: PropertyCategory.COMMERCIAL },
    ].map((t) =>
      prisma.propertyType.upsert({
        where: { slug: t.slug },
        update: {},
        create: t,
      })
    )
  );

  const amenities = await Promise.all(
    ["Swimming Pool", "Gym", "Parking", "Security", "Garden", "Elevator", "Central AC", "Backup Generator"].map(
      (name, i) =>
        prisma.amenity.upsert({
          where: { slug: name.toLowerCase().replace(/\s/g, "-") },
          update: {},
          create: { name, slug: name.toLowerCase().replace(/\s/g, "-") },
        })
    )
  );

  const agency = await prisma.agency.upsert({
    where: { slug: "vertex-estates" },
    update: {},
    create: {
      name: "Vertex Estates",
      slug: "vertex-estates",
      email: "contact@vertexestates.com",
      phone: "+923001234567",
      description: "Premium real estate agency specializing in luxury residential properties.",
      cityId: lahore.id,
      verified: true,
      featured: true,
      rating: 4.8,
      reviewCount: 124,
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { email: "agent@propvault.com" },
    update: {},
    create: {
      email: "agent@propvault.com",
      passwordHash,
      firstName: "Sarah",
      lastName: "Khan",
      role: UserRole.AGENT,
      phone: "+923009876543",
      emailVerified: true,
    },
  });

  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      agencyId: agency.id,
      bio: "Licensed agent with 10+ years experience in Lahore and Islamabad markets.",
      verified: true,
      featured: true,
      whatsapp: "923009876543",
      rating: 4.9,
    },
  });

  const project = await prisma.project.upsert({
    where: { slug: "skyline-residences" },
    update: {},
    create: {
      name: "Skyline Residences",
      slug: "skyline-residences",
      description: "Luxury high-rise development with panoramic city views and world-class amenities.",
      developer: "Horizon Developers",
      cityId: islamabad.id,
      areaId: areas[4].id,
      minPrice: 8500000,
      maxPrice: 45000000,
      handover: "Q4 2027",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    },
  });

  const sampleProperties = [
    {
      title: "Modern 5 Marla House in DHA Phase 6",
      slug: "modern-5-marla-dha-phase-6",
      description: "Stunning contemporary house with premium finishes, open-plan living, and landscaped garden.",
      purpose: ListingPurpose.SALE,
      category: PropertyCategory.RESIDENTIAL,
      price: 32500000,
      bedrooms: 5,
      bathrooms: 4,
      areaSize: 5,
      cityId: lahore.id,
      areaId: areas[0].id,
      propertyTypeId: types[0].id,
      agencyId: agency.id,
      agentId: agent.id,
      address: "Street 12, DHA Phase 6, Lahore",
      latitude: 31.4707,
      longitude: 74.4089,
      featured: true,
      trending: true,
      verification: VerificationStatus.VERIFIED,
    },
    {
      title: "Luxury Penthouse with City Views",
      slug: "luxury-penthouse-city-views",
      description: "Exclusive penthouse apartment featuring floor-to-ceiling windows and private terrace.",
      purpose: ListingPurpose.SALE,
      category: PropertyCategory.RESIDENTIAL,
      price: 78000000,
      bedrooms: 4,
      bathrooms: 5,
      areaSize: 3500,
      areaUnit: "SQFT",
      cityId: islamabad.id,
      areaId: areas[3].id,
      propertyTypeId: types[1].id,
      agencyId: agency.id,
      agentId: agent.id,
      projectId: project.id,
      address: "Sector F, DHA Phase 2, Islamabad",
      latitude: 33.5212,
      longitude: 73.1583,
      featured: true,
      verification: VerificationStatus.VERIFIED,
    },
    {
      title: "Commercial Plot on Main Boulevard",
      slug: "commercial-plot-main-boulevard",
      description: "Prime commercial plot ideal for retail or mixed-use development.",
      purpose: ListingPurpose.SALE,
      category: PropertyCategory.PLOT,
      price: 45000000,
      areaSize: 2,
      areaUnit: "KANAL",
      cityId: lahore.id,
      areaId: areas[2].id,
      propertyTypeId: types[2].id,
      address: "Main Boulevard, Gulberg III, Lahore",
      latitude: 31.5204,
      longitude: 74.3487,
      featured: false,
      trending: true,
    },
    {
      title: "Furnished 2 Bed Flat for Rent",
      slug: "furnished-2-bed-flat-rent",
      description: "Fully furnished apartment in secure building with gym and parking.",
      purpose: ListingPurpose.RENT,
      category: PropertyCategory.RESIDENTIAL,
      price: 95000,
      rentPeriod: "monthly",
      bedrooms: 2,
      bathrooms: 2,
      areaSize: 1200,
      areaUnit: "SQFT",
      cityId: islamabad.id,
      areaId: areas[4].id,
      propertyTypeId: types[1].id,
      agentId: agent.id,
      address: "Block B-17, Multi Gardens, Islamabad",
      latitude: 33.6844,
      longitude: 72.9802,
      featured: true,
    },
  ];

  for (const p of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: { status: PropertyStatus.ACTIVE, publishedAt: new Date() },
      create: {
        ...p,
        status: PropertyStatus.ACTIVE,
        publishedAt: new Date(),
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-${p.slug.includes("penthouse") ? "1512918728675" : p.slug.includes("plot") ? "1560518883" : "1600596542815"}?w=800`,
              isPrimary: true,
              order: 0,
            },
          ],
        },
        amenities: {
          create: amenities.slice(0, 4).map((a) => ({ amenityId: a.id })),
        },
        nearbyPlaces: {
          create: [
            { name: "City School", type: "school", distance: 0.8 },
            { name: "Shaukat Khanum", type: "hospital", distance: 2.1 },
          ],
        },
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "real-estate-market-outlook-2026" },
    update: {},
    create: {
      title: "Pakistan Real Estate Market Outlook 2026",
      slug: "real-estate-market-outlook-2026",
      excerpt: "Key trends shaping property investment across major cities.",
      content: "## Market Overview\n\nThe Pakistani real estate sector continues to show resilience...",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      authorId: admin.id,
      published: true,
      publishedAt: new Date(),
      tags: JSON.stringify(["market", "investment", "2026"]),
    },
  });

  await prisma.areaGuide.upsert({
    where: { slug: "dha-lahore-area-guide" },
    update: {},
    create: {
      title: "DHA Lahore Area Guide",
      slug: "dha-lahore-area-guide",
      content: "Defence Housing Authority Lahore remains one of the most sought-after residential areas...",
      cityId: lahore.id,
      areaId: areas[0].id,
      avgPrice: 28000000,
      propertyCount: 7319,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },
  });

  console.log("Seed completed.");
  console.log("Admin: admin@propvault.com / Admin@123");
  console.log("Agent: agent@propvault.com / Admin@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
