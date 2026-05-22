import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { PropertyDetailsClient } from "@/components/property/PropertyDetailsClient";
import { DEMO_PROPERTY_DETAILS, DEMO_PROPERTIES } from "@/lib/demo-data";

interface PropertyDetail {
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

async function getProperty(slug: string): Promise<PropertyDetail | null> {
  if (DEMO_PROPERTY_DETAILS[slug]) {
    return DEMO_PROPERTY_DETAILS[slug] as unknown as PropertyDetail;
  }
  try {
    return await api<PropertyDetail>(`/properties/${slug}`, { timeoutMs: 6000 });
  } catch {
    return null;
  }
}

async function getSimilar(slug: string): Promise<PropertyCardData[]> {
  if (DEMO_PROPERTY_DETAILS[slug]) {
    return DEMO_PROPERTIES.filter(p => p.slug !== slug);
  }
  try {
    return await api<PropertyCardData[]>(`/properties/${slug}/similar`, { timeoutMs: 4000 });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) return { title: "Property Not Found" };
  return { title: p.title, description: p.description.slice(0, 160) };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const similar = await getSimilar(slug);

  return (
    <div>
      {/* Redesigned Zameen-style Property Details Main Content */}
      <PropertyDetailsClient property={property} />

      {/* Similar properties section */}
      {similar.length > 0 && (
        <div className="bg-[#f5f5f5] pb-12">
          <div className="z-container">
            <div className="bg-white border border-[#e0e0e0] rounded-[3px] p-5">
              <h2 className="text-sm font-extrabold text-[#333] border-b-2 border-[#1a7a30] pb-2 mb-4 uppercase tracking-wider">
                Similar Properties
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similar.slice(0, 4).map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

