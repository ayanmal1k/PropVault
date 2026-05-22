import { type PropertyCardData } from "@/components/property/PropertyCard";

export interface DemoPropertyDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  purpose: string;
  category?: string | null;
  propertyType: { name: string };
  price: number | string;
  currency: string;
  rentPeriod?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSize: number;
  areaUnit: string;
  address: string;
  latitude: number;
  longitude: number;
  verification: string;
  virtualTourUrl?: string | null;
  videoTourUrl?: string | null;
  images: { url: string; isPrimary: boolean }[];
  videos?: { url: string; title?: string }[];
  amenities: { amenity: { name: string; slug: string; category?: string | null; icon?: string | null } }[];
  nearbyPlaces: { name: string; type: string; distance: number; unit: string }[];
  city: { name: string };
  area?: { name: string } | null;
  agent?: {
    id: string;
    whatsapp?: string | null;
    user: { id: string; firstName: string; lastName: string; avatar?: string | null; phone?: string | null; email?: string | null };
  } | null;
  agency?: {
    id: string;
    name: string;
    logo?: string | null;
    slug: string;
    description?: string | null;
  } | null;
  createdAt: string;
}

export const DEMO_PROPERTIES: PropertyCardData[] = [
  {
    id: "demo-1",
    slug: "al-hafeez-garden-phase-2-5-marla-plot",
    title: "Facing Park Al Hafeez Garden - Phase 2 Residential Plot For Sale",
    price: 9500000,
    purpose: "SALE",
    category: "PLOT",
    bedrooms: null,
    bathrooms: null,
    areaSize: 5,
    areaUnit: "Marla",
    verification: "VERIFIED",
    city: { name: "Lahore" },
    area: { name: "Main Canal Bank Road" },
    images: [
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", isPrimary: true }
    ],
    description: "Looking to buy this property? Well, check out this 5 Marla Residential Plot in Al Hafeez Garden Phase 2, Lahore. Located on Main Canal Bank Road, facing a beautiful park, it represents an outstanding investment opportunity.",
    createdAt: "3 hours ago",
    isHot: true,
    isTitanium: true,
    agency: {
      name: "Darwaish Associates",
      logo: ""
    }
  },
  {
    id: "demo-2",
    slug: "dha-phase-6-luxury-1-kanal-house",
    title: "Elegant Luxury Designed 1 Kanal House For Sale in DHA Phase 6",
    price: 78000000,
    purpose: "SALE",
    category: "RESIDENTIAL",
    bedrooms: 5,
    bathrooms: 6,
    areaSize: 1,
    areaUnit: "Kanal",
    verification: "VERIFIED",
    city: { name: "Lahore" },
    area: { name: "DHA Phase 6" },
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1600596542815-fdef06020168?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800", isPrimary: false }
    ],
    description: "Looking to buy this house? This stunning 1 Kanal double-story house in DHA Phase 6, Lahore features 5 master bedrooms, high-end imported fixtures, double kitchens, and beautifully landscaped lawn.",
    createdAt: "5 hours ago",
    isHot: true,
    isTitanium: true,
    agency: {
      name: "Darwaish Associates",
      logo: ""
    }
  },
  {
    id: "demo-3",
    slug: "e11-apartment-two-bed-premium",
    title: "Modern Premium 2 Bedroom Luxury Apartment for Rent in E-11",
    price: 120000,
    purpose: "RENT",
    category: "RESIDENTIAL",
    bedrooms: 2,
    bathrooms: 2,
    areaSize: 8,
    areaUnit: "Marla",
    verification: "VERIFIED",
    city: { name: "Islamabad" },
    area: { name: "Sector E-11" },
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", isPrimary: false }
    ],
    description: "A brand new 2-bedroom executive apartment is available for rent in Sector E-11, Islamabad. Ready to move in, fully furnished option available with uninterrupted supply of gas and water.",
    createdAt: "1 day ago",
    isHot: false,
    isTitanium: true,
    agency: {
      name: "Darwaish Associates",
      logo: ""
    }
  },
  {
    id: "demo-4",
    slug: "bahria-town-karachi-commercial-shop",
    title: "Prime Location Commercial Shop For Sale in Bahria Town",
    price: 24500000,
    purpose: "SALE",
    category: "COMMERCIAL",
    bedrooms: null,
    bathrooms: 1,
    areaSize: 3.5,
    areaUnit: "Marla",
    verification: "VERIFIED",
    city: { name: "Karachi" },
    area: { name: "Bahria Town Karachi" },
    images: [
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", isPrimary: false }
    ],
    description: "Excellent commercial investment! A 3.5 Marla main boulevard shop for sale in Bahria Town Karachi. Highly populated area with heavy foot traffic, ideal for retail or office.",
    createdAt: "2 days ago",
    isHot: true,
    isTitanium: false,
    agency: {
      name: "Darwaish Associates",
      logo: ""
    }
  }
];

export const DEMO_PROPERTY_DETAILS: Record<string, DemoPropertyDetail> = {
  "al-hafeez-garden-phase-2-5-marla-plot": {
    id: "demo-1",
    slug: "al-hafeez-garden-phase-2-5-marla-plot",
    title: "Facing Park Al Hafeez Garden - Phase 2 Residential Plot For Sale",
    price: 9500000,
    purpose: "SALE",
    category: "PLOT",
    propertyType: { name: "Plot" },
    currency: "PKR",
    rentPeriod: null,
    bedrooms: null,
    bathrooms: null,
    areaSize: 5,
    areaUnit: "Marla",
    address: "Main Canal Bank Road, Al Hafeez Garden Phase 2, Lahore",
    latitude: 31.5497,
    longitude: 74.4533,
    verification: "VERIFIED",
    images: [
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", isPrimary: true }
    ],
    description: "Looking to buy this property? Well, check out this 5 Marla Residential Plot in Al Hafeez Garden Phase 2, Lahore.\n\nLocated on Main Canal Bank Road, facing a beautiful park, it represents an outstanding investment opportunity. Beautiful environment, safe neighborhood, fully developed sector, all utilities (electricity, water, gas) are available.\n\nIdeal for building your dream home or keeping it as a high-yield investment. Close proximity to top-tier schools, commercial areas, and modern infrastructure.\n\nGet in touch today for more details!",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    city: { name: "Lahore" },
    area: { name: "Main Canal Bank Road" },
    amenities: [
      { amenity: { name: "Park Facing", slug: "park-facing", category: "plot" } },
      { amenity: { name: "Corner Plot", slug: "corner-plot", category: "plot" } },
      { amenity: { name: "Water Supply", slug: "water-supply", category: "utilities" } },
      { amenity: { name: "Sui Gas Available", slug: "sui-gas", category: "utilities" } },
      { amenity: { name: "Electricity", slug: "electricity", category: "utilities" } },
      { amenity: { name: "Sewerage System", slug: "sewerage", category: "utilities" } }
    ],
    nearbyPlaces: [
      { name: "Al Hafeez Central School", type: "School", distance: 0.4, unit: "km" },
      { name: "Medicare Medical Clinic", type: "Hospital", distance: 1.2, unit: "km" },
      { name: "Canal View Super Market", type: "Shopping Mall", distance: 0.8, unit: "km" },
      { name: "Orange Line Metro Station", type: "Transport", distance: 2.5, unit: "km" }
    ],
    agent: {
      id: "agent-1",
      whatsapp: "+923001234567",
      user: {
        id: "user-agent-1",
        firstName: "Zeeshan",
        lastName: "Darwaish",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        phone: "+923001234567",
        email: "zeeshan@darwaishassociates.com"
      }
    },
    agency: {
      id: "agency-1",
      name: "Darwaish Associates",
      logo: "",
      slug: "darwaish-associates",
      description: "Premier real estate consulting agency operating in Lahore, providing exclusive verified plots and luxury homes with top-grade investment options."
    }
  },
  "dha-phase-6-luxury-1-kanal-house": {
    id: "demo-2",
    slug: "dha-phase-6-luxury-1-kanal-house",
    title: "Elegant Luxury Designed 1 Kanal House For Sale in DHA Phase 6",
    price: 78000000,
    purpose: "SALE",
    category: "RESIDENTIAL",
    propertyType: { name: "House" },
    currency: "PKR",
    rentPeriod: null,
    bedrooms: 5,
    bathrooms: 6,
    areaSize: 1,
    areaUnit: "Kanal",
    address: "Block K, DHA Phase 6, Lahore",
    latitude: 31.4789,
    longitude: 74.4356,
    verification: "VERIFIED",
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1600596542815-fdef06020168?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800", isPrimary: false }
    ],
    description: "Looking to buy this house?\n\nThis stunning 1 Kanal double-story house in DHA Phase 6, Lahore features 5 master bedrooms, high-end imported fixtures, double kitchens, and beautifully landscaped lawn.\n\nEvery bedroom features a luxurious walk-in closet and high-end modern bathroom layout with Spanish tiles. The custom-built kitchen features complete integrated appliances. Solid ash wood doors, premium marble floors, and state-of-the-art lighting fixture panels make this a complete architectural masterpiece.\n\nLocated in a highly secure block with 24/7 patrolling and zero outages.",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    city: { name: "Lahore" },
    area: { name: "DHA Phase 6" },
    amenities: [
      { amenity: { name: "Double Kitchen", slug: "double-kitchen", category: "features" } },
      { amenity: { name: "Security System", slug: "security", category: "features" } },
      { amenity: { name: "Landscaped Lawn", slug: "lawn", category: "features" } },
      { amenity: { name: "Servant Quarter", slug: "servant-q", category: "features" } },
      { amenity: { name: "Central Heating", slug: "heating", category: "utilities" } },
      { amenity: { name: "Spanish Tiled Baths", slug: "tiles", category: "features" } }
    ],
    nearbyPlaces: [
      { name: "DHA Phase 6 Central Park", type: "Park", distance: 0.3, unit: "km" },
      { name: "Raya Fairways Commercial Club", type: "Shopping Mall", distance: 1.1, unit: "km" },
      { name: "DHA Medical Center", type: "Hospital", distance: 1.5, unit: "km" }
    ],
    agent: {
      id: "agent-1",
      whatsapp: "+923001234567",
      user: {
        id: "user-agent-1",
        firstName: "Zeeshan",
        lastName: "Darwaish",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        phone: "+923001234567",
        email: "zeeshan@darwaishassociates.com"
      }
    },
    agency: {
      id: "agency-1",
      name: "Darwaish Associates",
      logo: "",
      slug: "darwaish-associates",
      description: "Premier real estate consulting agency operating in Lahore, providing exclusive verified plots and luxury homes with top-grade investment options."
    }
  },
  "e11-apartment-two-bed-premium": {
    id: "demo-3",
    slug: "e11-apartment-two-bed-premium",
    title: "Modern Premium 2 Bedroom Luxury Apartment for Rent in E-11",
    price: 120000,
    purpose: "RENT",
    category: "RESIDENTIAL",
    propertyType: { name: "Apartment" },
    currency: "PKR",
    rentPeriod: "Monthly",
    bedrooms: 2,
    bathrooms: 2,
    areaSize: 8,
    areaUnit: "Marla",
    address: "Executive Towers, Sector E-11, Islamabad",
    latitude: 33.6997,
    longitude: 72.9782,
    verification: "VERIFIED",
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", isPrimary: false }
    ],
    description: "A brand new 2-bedroom executive apartment is available for rent in Sector E-11, Islamabad.\n\nReady to move in, fully furnished option available with uninterrupted supply of gas and water. Enjoy stunning Margalla Hills views right from your private terrace.\n\nBuilding amenities include 24/7 power backup, modern gymnasium, high-speed elevator arrays, secured basement parking, and a dedicated reception front. High security block, very family-friendly environment.\n\nContact us for viewing!",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    city: { name: "Islamabad" },
    area: { name: "Sector E-11" },
    amenities: [
      { amenity: { name: "Furnished Option", slug: "furnished", category: "features" } },
      { amenity: { name: "Margalla Hills View", slug: "view", category: "features" } },
      { amenity: { name: "Gymnasium Access", slug: "gym", category: "features" } },
      { amenity: { name: "Basement Parking", slug: "parking", category: "features" } },
      { amenity: { name: "Power Backup", slug: "generator", category: "utilities" } },
      { amenity: { name: "24/7 Security", slug: "security", category: "features" } }
    ],
    nearbyPlaces: [
      { name: "Centaurus Mall", type: "Shopping Mall", distance: 4.2, unit: "km" },
      { name: "E-11 Markaz", type: "Shopping Mall", distance: 0.6, unit: "km" },
      { name: "Shifa International Clinic", type: "Hospital", distance: 1.8, unit: "km" }
    ],
    agent: {
      id: "agent-1",
      whatsapp: "+923001234567",
      user: {
        id: "user-agent-1",
        firstName: "Zeeshan",
        lastName: "Darwaish",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        phone: "+923001234567",
        email: "zeeshan@darwaishassociates.com"
      }
    },
    agency: {
      id: "agency-1",
      name: "Darwaish Associates",
      logo: "",
      slug: "darwaish-associates",
      description: "Premier real estate consulting agency operating in Lahore, providing exclusive verified plots and luxury homes with top-grade investment options."
    }
  },
  "bahria-town-karachi-commercial-shop": {
    id: "demo-4",
    slug: "bahria-town-karachi-commercial-shop",
    title: "Prime Location Commercial Shop For Sale in Bahria Town",
    price: 24500000,
    purpose: "SALE",
    category: "COMMERCIAL",
    propertyType: { name: "Shop" },
    currency: "PKR",
    rentPeriod: null,
    bedrooms: null,
    bathrooms: 1,
    areaSize: 3.5,
    areaUnit: "Marla",
    address: "Midway Commercial, Bahria Town, Karachi",
    latitude: 25.0456,
    longitude: 67.3245,
    verification: "VERIFIED",
    images: [
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", isPrimary: false }
    ],
    description: "Excellent commercial investment!\n\nA 3.5 Marla main boulevard shop for sale in Bahria Town Karachi. Highly populated area with heavy foot traffic, ideal for retail store, corporate office or showroom front.\n\nModern glass facade installed, double height ceiling architecture, dedicated storage room, individual kitchen area, premium fittings. High-demand market area with premium return potential.\n\nDon't miss this opportunity!",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    city: { name: "Karachi" },
    area: { name: "Bahria Town Karachi" },
    amenities: [
      { amenity: { name: "Main Boulevard Corner", slug: "corner", category: "features" } },
      { amenity: { name: "Double Height Ceilings", slug: "ceilings", category: "features" } },
      { amenity: { name: "Glass Facade", slug: "facade", category: "features" } },
      { amenity: { name: "Dedicated Storage", slug: "storage", category: "features" } },
      { amenity: { name: "Power Backup", slug: "generator", category: "utilities" } },
      { amenity: { name: "Heavy Foot Traffic", slug: "traffic", category: "features" } }
    ],
    nearbyPlaces: [
      { name: "Bahria International Hospital", type: "Hospital", distance: 1.2, unit: "km" },
      { name: "Theme Park Karachi", type: "Park", distance: 2.1, unit: "km" },
      { name: "Bahria Main Shopping Mall", type: "Shopping Mall", distance: 0.5, unit: "km" }
    ],
    agent: {
      id: "agent-1",
      whatsapp: "+923001234567",
      user: {
        id: "user-agent-1",
        firstName: "Zeeshan",
        lastName: "Darwaish",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        phone: "+923001234567",
        email: "zeeshan@darwaishassociates.com"
      }
    },
    agency: {
      id: "agency-1",
      name: "Darwaish Associates",
      logo: "",
      slug: "darwaish-associates",
      description: "Premier real estate consulting agency operating in Lahore, providing exclusive verified plots and luxury homes with top-grade investment options."
    }
  }
};
