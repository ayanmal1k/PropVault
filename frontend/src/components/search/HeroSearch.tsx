"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

export function HeroSearch() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"SALE" | "RENT">("SALE");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("house");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSearch() {
    const params = new URLSearchParams({
      purpose,
      type: propertyType,
      ...(location && { q: location }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="glass w-full max-w-4xl rounded-2xl p-2 shadow-premium">
      <Tabs.Root value={purpose} onValueChange={(v) => setPurpose(v as "SALE" | "RENT")}>
        <Tabs.List className="mb-2 flex gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
          <Tabs.Trigger
            value="SALE"
            className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-700 data-[state=active]:shadow dark:data-[state=active]:bg-slate-900"
          >
            Buy
          </Tabs.Trigger>
          <Tabs.Trigger
            value="RENT"
            className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-700 data-[state=active]:shadow dark:data-[state=active]:bg-slate-900"
          >
            Rent
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="City, area, or society..."
            className="input-field pl-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <select className="input-field" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="house">Homes</option>
          <option value="flat">Flats</option>
          <option value="plot">Plots</option>
          <option value="office">Commercial</option>
        </select>
        <input type="number" placeholder="Min Price" className="input-field" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" className="input-field" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      <button type="button" onClick={handleSearch} className="btn-primary mt-2 w-full sm:w-auto">
        <Search className="h-4 w-4" />
        Search Properties
      </button>
    </div>
  );
}
