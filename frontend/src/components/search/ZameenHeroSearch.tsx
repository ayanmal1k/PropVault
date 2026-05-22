"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import searchBg from "@/assets/searchbg.png";

type Tab = "buy" | "rent" | "projects";

interface Suggestion { id: string; name: string; type: string; }

export function ZameenHeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("buy");
  const [city, setCity] = useState("Islamabad");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [propertyType, setPropertyType] = useState("Homes");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [minArea, setMinArea] = useState("0");
  const [maxArea, setMaxArea] = useState("Any");
  const [beds, setBeds] = useState("All");
  const suggRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (location.length < 2) { setSuggestions([]); return; }
      try {
        const data = await api<Suggestion[]>(`/properties/autocomplete?q=${encodeURIComponent(location)}`);
        setSuggestions(data);
        setShowSugg(true);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (suggRef.current && !suggRef.current.contains(e.target as Node)) setShowSugg(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function handleSearch() {
    if (tab === "projects") { router.push("/projects"); return; }
    const p = new URLSearchParams({ purpose: tab === "rent" ? "RENT" : "SALE" });
    if (location) p.set("q", location);
    if (city) p.set("city", city.toLowerCase());
    if (propertyType === "Plots") p.set("category", "PLOT");
    else if (propertyType === "Commercial") p.set("category", "COMMERCIAL");
    if (minPrice !== "0") p.set("minPrice", minPrice);
    if (maxPrice !== "Any") p.set("maxPrice", maxPrice);
    if (minArea !== "0") p.set("minArea", minArea);
    if (maxArea !== "Any") p.set("maxArea", maxArea);
    if (beds !== "All") p.set("bedrooms", beds);
    router.push(`/search?${p.toString()}`);
  }

  const heroTitle =
    tab === "rent" ? "Search properties for rent in Pakistan"
    : tab === "projects" ? "Search new projects in Pakistan"
    : "Search properties for sale in Pakistan";

  const priceOptions = ["Any", "5 Lac", "10 Lac", "25 Lac", "50 Lac", "1 Cr", "2 Cr", "5 Cr"];
  const areaOptions = ["Any", "1", "2", "3", "5", "10", "20"];

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        minHeight: 500,
        paddingTop: 56,
        paddingBottom: 56,
        background: "linear-gradient(180deg, rgba(47,154,53,0.95) 0%, rgba(30,127,49,0.92) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${searchBg.src})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4">
      <h1
        className="mb-8 text-center text-white"
        style={{ fontSize: 34, lineHeight: 1.2, fontWeight: 600 }}
      >
        {heroTitle}
      </h1>

      <div className="mb-4 flex space-x-2" data-purpose="search-tabs">
        {(["buy", "rent", "projects"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="rounded-sm px-10 py-3 text-sm font-bold transition"
              style={{
                background: active ? "#fff" : "transparent",
                color: active ? "#33a137" : "#fff",
                border: active ? "1px solid #fff" : "1px solid rgba(255,255,255,0.95)",
              }}
            >
              {t === "buy" ? "BUY" : t === "rent" ? "RENT" : "PROJECTS"}
            </button>
          );
        })}
      </div>

      <div
        className="w-full max-w-4xl rounded-md p-4 backdrop-blur-sm"
        data-purpose="search-bar"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="bg-white rounded p-3 flex-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">CITY</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-none p-0 font-semibold text-slate-700 focus:ring-0"
            >
              {[
                "Islamabad",
                "Lahore",
                "Karachi",
                "Rawalpindi",
                "Multan",
                "Faisalabad",
                "Peshawar",
                "Quetta",
                "Sialkot",
                "Gujranwala",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-[2] rounded bg-white p-3" ref={suggRef}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">LOCATION</span>
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => suggestions.length && setShowSugg(true)}
                className="border-none p-0 font-semibold text-slate-700 focus:ring-0"
              />
            </div>

            {showSugg && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 200,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderTop: "none",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setLocation(s.name);
                      setShowSugg(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#333",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    {s.name}
                    <span style={{ fontSize: 11, color: "#999", marginLeft: 6 }}>({s.type})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded bg-[#33a137] px-12 py-3 font-bold uppercase text-white transition-colors hover:bg-[#33a137]"
          >
            Find
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-xs text-white md:flex-row md:items-center md:justify-between md:px-1">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="cursor-pointer hover:underline">More Options</span>
            <span className="cursor-pointer hover:underline">Change Currency</span>
            <span className="cursor-pointer hover:underline">Change Area Unit</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setLocation("");
              setMinPrice("0");
              setMaxPrice("Any");
              setMinArea("0");
              setMaxArea("Any");
              setBeds("All");
              setPropertyType("Homes");
            }}
            className="cursor-pointer hover:underline"
          >
            Reset Search
          </button>
        </div>
      </div>
      </div>

    </section>
  );
}
