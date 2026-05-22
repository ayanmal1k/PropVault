"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SearchFilters({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="glass sticky top-24 space-y-4 rounded-2xl p-6">
      <h3 className="font-semibold">Filters</h3>
      <div>
        <label className="text-sm text-slate-500">Purpose</label>
        <select className="input-field mt-1" defaultValue={initial.purpose || "SALE"} onChange={(e) => update("purpose", e.target.value)}>
          <option value="SALE">Buy</option>
          <option value="RENT">Rent</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-slate-500">Min Price (PKR)</label>
        <input type="number" className="input-field mt-1" defaultValue={initial.minPrice} onBlur={(e) => update("minPrice", e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-500">Max Price (PKR)</label>
        <input type="number" className="input-field mt-1" defaultValue={initial.maxPrice} onBlur={(e) => update("maxPrice", e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-slate-500">Bedrooms</label>
        <select className="input-field mt-1" defaultValue={initial.bedrooms || ""} onChange={(e) => update("bedrooms", e.target.value)}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-slate-500">Sort</label>
        <select className="input-field mt-1" defaultValue={initial.sort || "newest"} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="featured">Featured</option>
        </select>
      </div>
    </div>
  );
}
