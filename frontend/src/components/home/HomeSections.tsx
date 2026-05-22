import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building, Calculator, Map, Sparkles, Star } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { api } from "@/lib/api";

async function fetchFeatured() {
  try {
    return await api<PropertyCardData[]>("/properties/featured?limit=8");
  } catch {
    return [];
  }
}

async function fetchTrending() {
  try {
    return await api<PropertyCardData[]>("/properties/trending?limit=4");
  } catch {
    return [];
  }
}

async function fetchAgencies() {
  try {
    return await api<{ id: string; name: string; slug: string; logo?: string; rating: number; featured: boolean }[]>(
      "/agencies?featured=true"
    );
  } catch {
    return [];
  }
}

async function fetchProjects() {
  try {
    return await api<{ id: string; name: string; slug: string; coverImage?: string; developer?: string; minPrice?: number }[]>(
      "/projects?featured=true"
    );
  } catch {
    return [];
  }
}

async function fetchBlog() {
  try {
    const res = await api<{ items: { slug: string; title: string; excerpt?: string; coverImage?: string }[] }>("/blog?limit=3");
    return res.items || [];
  } catch {
    return [];
  }
}

const cities = [
  { name: "Lahore", slug: "lahore", count: "24K+", image: "https://images.unsplash.com/photo-1580218013284-2a69cac3d933?w=400" },
  { name: "Karachi", slug: "karachi", count: "12K+", image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400" },
  { name: "Islamabad", slug: "islamabad", count: "10K+", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400" },
  { name: "Rawalpindi", slug: "rawalpindi", count: "4K+", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" },
];

export async function FeaturedListings() {
  const properties = await fetchFeatured();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Featured Properties</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Hand-picked premium listings</p>
          </div>
          <Link href="/search?featured=true" className="btn-secondary hidden sm:inline-flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.length > 0 ? (
            properties.map((p) => <PropertyCard key={p.id} property={p} />)
          ) : (
            <p className="col-span-full text-center text-slate-500">Start the API and seed database to see listings.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export async function PopularCities() {
  return (
    <section className="bg-slate-100/50 py-16 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">Popular Cities</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/search?city=${city.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
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
  );
}

export async function NewProjectsCarousel() {
  const projects = await fetchProjects();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">New Projects</h2>
        <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="card-premium min-w-[300px] shrink-0">
              <div className="relative aspect-video">
                <Image
                  src={p.coverImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                {p.developer && <p className="text-sm text-slate-500">{p.developer}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TopAgencies() {
  const agencies = await fetchAgencies();
  return (
    <section className="py-16 bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">Top Agencies</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agencies.map((a) => (
            <Link key={a.id} href={`/agencies/${a.slug}`} className="glass-dark rounded-2xl p-6 transition hover:bg-white/10">
              <Building className="h-8 w-8 text-brand-400" />
              <h3 className="mt-4 text-lg font-semibold">{a.name}</h3>
              <div className="mt-2 flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span>{a.rating.toFixed(1)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TrendingSection() {
  const items = await fetchTrending();
  if (!items.length) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-amber-500" /> Trending Now
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PropertyInsights() {
  const insights = [
    { label: "Avg. Price Index", value: "+4.2%", desc: "Lahore residential YoY" },
    { label: "Hot Markets", value: "DHA, B-17", desc: "Highest search volume" },
    { label: "Rental Yield", value: "6.8%", desc: "Islamabad apartments" },
  ];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">Property Insights</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {insights.map((i) => (
            <div key={i.label} className="glass rounded-2xl p-6">
              <p className="text-sm text-slate-500">{i.label}</p>
              <p className="mt-2 text-3xl font-bold text-brand-600">{i.value}</p>
              <p className="mt-1 text-sm text-slate-600">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = [
    { name: "Ahmed R.", text: "Found our dream home in DHA within a week. The verification badges gave us confidence.", role: "Home Buyer" },
    { name: "Fatima K.", text: "As an agent, PropVault's lead management transformed how I close deals.", role: "Real Estate Agent" },
  ];
  return (
    <section className="py-16 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-center">What People Say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <blockquote key={t.name} className="card-premium p-8">
              <p className="text-lg text-slate-700 dark:text-slate-300">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 font-semibold">{t.name} — <span className="font-normal text-slate-500">{t.role}</span></footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToolsGrid() {
  const tools = [
    { href: "/tools/mortgage", icon: Calculator, title: "Mortgage Calculator", desc: "Estimate monthly payments" },
    { href: "/tools/roi", icon: Sparkles, title: "ROI Calculator", desc: "Investment returns analysis" },
    { href: "/area-guides", icon: Map, title: "Area Guides", desc: "Explore neighborhoods" },
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="glass flex items-center gap-4 rounded-2xl p-6 transition hover:shadow-premium">
              <t.icon className="h-10 w-10 text-brand-600" />
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function BlogSection() {
  const posts = await fetchBlog();
  if (!posts.length) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end">
          <h2 className="font-display text-3xl font-bold">News & Insights</h2>
          <Link href="/blog" className="text-brand-600 font-medium">View all</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-premium">
              {post.coverImage && (
                <div className="relative aspect-video">
                  <Image src={post.coverImage} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-hero-gradient p-12 text-center text-white shadow-premium">
          <h2 className="font-display text-3xl font-bold">Get PropVault on Mobile</h2>
          <p className="mt-4 text-brand-100">Search, save, and inquire on the go. Coming soon to iOS & Android.</p>
          <div className="mt-8 flex justify-center gap-4">
            <button type="button" className="rounded-xl bg-white/20 px-6 py-3 font-semibold backdrop-blur hover:bg-white/30">
              App Store
            </button>
            <button type="button" className="rounded-xl bg-white/20 px-6 py-3 font-semibold backdrop-blur hover:bg-white/30">
              Google Play
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
