"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SearchFiltersZameen({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="z-card p-4">
      <h3 className="mb-3 font-semibold text-zameen-text">Filters</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-zameen-muted">Purpose</label>
          <select className="z-select mt-1" defaultValue={initial.purpose || "SALE"} onChange={(e) => update("purpose", e.target.value)}>
            <option value="SALE">Buy</option>
            <option value="RENT">Rent</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zameen-muted">Min Price</label>
          <input type="number" className="z-input mt-1" defaultValue={initial.minPrice} onBlur={(e) => update("minPrice", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-zameen-muted">Max Price</label>
          <input type="number" className="z-input mt-1" defaultValue={initial.maxPrice} onBlur={(e) => update("maxPrice", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-zameen-muted">Bedrooms</label>
          <select className="z-select mt-1" defaultValue={initial.bedrooms || ""} onChange={(e) => update("bedrooms", e.target.value)}>
            <option value="">All</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
