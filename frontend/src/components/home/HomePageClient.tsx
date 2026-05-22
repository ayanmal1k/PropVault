"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Calculator, Map, Sparkles, Star } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { api } from "@/lib/api";

const cities = [
  { name: "Lahore", slug: "lahore", count: "24K+", image: "https://images.unsplash.com/photo-1580218013284-2a69cac3d933?w=400" },
  { name: "Karachi", slug: "karachi", count: "12K+", image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400" },
  { name: "Islamabad", slug: "islamabad", count: "10K+", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400" },
  { name: "Rawalpindi", slug: "rawalpindi", count: "4K+", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" },
];

export function HomePageClient() {
  const [featured, setFeatured] = useState<PropertyCardData[]>([]);
  const [trending, setTrending] = useState<PropertyCardData[]>([]);
  const [agencies, setAgencies] = useState<{ id: string; name: string; slug: string; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<PropertyCardData[]>("/properties/featured?limit=8", { timeoutMs: 4000 }).catch(() => []),
      api<PropertyCardData[]>("/properties/trending?limit=4", { timeoutMs: 4000 }).catch(() => []),
      api<{ id: string; name: string; slug: string; rating: number }[]>("/agencies?featured=true", { timeoutMs: 4000 }).catch(() => []),
    ]).then(([f, t, a]) => {
      setFeatured(f);
      setTrending(t);
      setAgencies(a);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { href: "/tools/mortgage", icon: Calculator, title: "Mortgage Calculator" },
              { href: "/tools/roi", icon: Sparkles, title: "ROI Calculator" },
              { href: "/area-guides", icon: Map, title: "Area Guides" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="glass flex items-center gap-4 rounded-2xl p-6">
                <t.icon className="h-10 w-10 text-brand-600" />
                <span className="font-semibold">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold">Featured Properties</h2>
            <Link href="/search?featured=true" className="btn-secondary hidden sm:inline-flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <p className="mt-8 text-slate-500">Loading listings...</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.length > 0 ? (
                featured.map((p) => <PropertyCard key={p.id} property={p} />)
              ) : (
                <p className="col-span-full text-slate-500">No listings yet. Ensure the API is running on port 4000.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-100/50 py-16 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">Popular Cities</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <Link key={city.slug} href={`/search?city=${city.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={city.image} alt={city.name} fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm text-slate-300">{city.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!loading && trending.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-amber-500" /> Trending Now
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {agencies.length > 0 && (
        <section className="py-16 bg-brand-950 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold">Top Agencies</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agencies.map((a) => (
                <Link key={a.id} href={`/agencies/${a.slug}`} className="glass-dark rounded-2xl p-6">
                  <Building className="h-8 w-8 text-brand-400" />
                  <h3 className="mt-4 text-lg font-semibold">{a.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    {a.rating.toFixed(1)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
