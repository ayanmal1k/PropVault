"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Home, Database } from "lucide-react";
import { api } from "@/lib/api";
import { PropertyCard, PropertyCardSkeleton, type PropertyCardData } from "@/components/property/PropertyCard";
import { DEMO_PROPERTIES } from "@/lib/demo-data";

interface SearchResult { items: PropertyCardData[]; total: number; page: number; totalPages: number; }

const PURPOSES = ["SALE", "RENT"];
const BEDS = ["Any", "1", "2", "3", "4", "5", "6+"];
const PRICE_OPTIONS = ["Any", "5 Lac", "10 Lac", "25 Lac", "50 Lac", "1 Cr", "2 Cr", "5 Cr"];
const TYPES = ["All", "Homes", "Flats", "Plots", "Commercial", "Rooms", "Portions"];

export function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbDisconnected, setDbDisconnected] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("forceOfflineMode");
    if (stored === "true") {
      setForceOffline(true);
    }
  }, []);

  const purpose = sp.get("purpose") ?? "SALE";
  const q = sp.get("q") ?? "";
  const city = sp.get("city") ?? "";
  const beds = sp.get("bedrooms") ?? "";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";
  const sort = sp.get("sort") ?? "newest";
  const page = parseInt(sp.get("page") ?? "1");

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    if (forceOffline) {
      const timer = setTimeout(() => {
        setResult({ items: [], total: 0, page: 1, totalPages: 1 });
        setDbDisconnected(true);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    setDbDisconnected(false);
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(page));
    params.set("limit", "12");
    api<SearchResult>(`/properties/search?${params.toString()}`, { timeoutMs: 20000 })
      .then((res) => {
        setResult(res);
        setDbDisconnected(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        const isAbort = err instanceof DOMException && err.name === "AbortError" || message.includes("aborted");
        console.error(isAbort ? "Search request timed out." : "Database query failed.", err);
        setLoadError(isAbort ? "The database is taking longer than expected to respond. Please retry." : "Unable to load live database results right now.");
        setResult(null);
        setDbDisconnected(false);
      })
      .finally(() => setLoading(false));
  }, [sp, page, forceOffline]);

  function toggleForceOffline() {
    const nextVal = !forceOffline;
    setForceOffline(nextVal);
    localStorage.setItem("forceOfflineMode", String(nextVal));
  }

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(sp.toString());
    if (value && value !== "Any") p.set(key, value);
    else p.delete(key);
    p.set("page", "1");
    router.push(`/search?${p.toString()}`);
  }

  const label = `${purpose === "RENT" ? "Rent" : "Buy"} in ${city || "Pakistan"}`;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "10px 0" }}>
        <div className="z-container" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333", marginRight: 8 }}>{label}</span>

          {/* Purpose */}
          <div style={{ display: "flex", gap: 0 }}>
            {PURPOSES.map((p) => (
              <button key={p} type="button"
                onClick={() => updateParam("purpose", p)}
                style={{
                  padding: "5px 14px", fontSize: 12, cursor: "pointer", border: "1px solid #ccc",
                  background: purpose === p ? "#33a137" : "#fff", color: purpose === p ? "#fff" : "#555",
                  fontWeight: purpose === p ? 700 : 400,
                  borderRadius: p === "SALE" ? "2px 0 0 2px" : "0 2px 2px 0",
                  marginLeft: p === "RENT" ? -1 : 0,
                }}>
                {p === "SALE" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>

          <select
            value={beds}
            onChange={(e) => updateParam("bedrooms", e.target.value)}
            style={{ border: "1px solid #ccc", borderRadius: 2, padding: "5px 8px", fontSize: 12, color: "#333" }}
          >
            <option value="">Beds (All)</option>
            {BEDS.filter(b => b !== "Any").map(b => <option key={b} value={b}>{b} Bed{b !== "1" ? "s" : ""}</option>)}
          </select>

          {/* Database Offline simulation toggle */}
          <button
            type="button"
            onClick={toggleForceOffline}
            style={{
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              border: "1px solid " + (forceOffline ? "#d97706" : "#ccc"),
              background: forceOffline ? "#fffbeb" : "#fff",
              color: forceOffline ? "#b45309" : "#555",
              fontWeight: 600,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s ease",
            }}
          >
            <Database size={13} fill={forceOffline ? "#d97706" : "transparent"} stroke={forceOffline ? "#d97706" : "#555"} />
            <span>{forceOffline ? "Database: OFFLINE (Demo)" : "Database: ONLINE"}</span>
          </button>

          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            style={{ border: "1px solid #ccc", borderRadius: 2, padding: "5px 8px", fontSize: 12, color: "#333", marginLeft: "auto" }}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="featured">Featured</option>
          </select>

          {result && (
            <span style={{ fontSize: 12, color: "#888" }}>
              {(dbDisconnected ? DEMO_PROPERTIES.length : result.total).toLocaleString()} results
            </span>
          )}
        </div>
      </div>

      <div className="z-container" style={{ padding: "20px 16px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>

        {/* Sidebar filters */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
            Filters
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>PROPERTY TYPE</div>
            {TYPES.map((t) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "pointer" }}>
                <input type="radio" name="ptype" checked={!sp.get("category") && t === "All" || sp.get("category") === t.toUpperCase()}
                  onChange={() => updateParam("category", t === "All" ? "" : t.toUpperCase())}
                  style={{ accentColor: "#33a137" }} />
                <span style={{ fontSize: 13, color: "#333" }}>{t}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>PRICE (PKR)</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <select
                value={minPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                style={{ flex: 1, border: "1px solid #ccc", borderRadius: 2, padding: "5px 4px", fontSize: 12 }}
              >
                <option value="">Min</option>
                {PRICE_OPTIONS.filter(v => v !== "Any").map(v => <option key={v}>{v}</option>)}
              </select>
              <span style={{ fontSize: 11, color: "#999" }}>to</span>
              <select
                value={maxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                style={{ flex: 1, border: "1px solid #ccc", borderRadius: 2, padding: "5px 4px", fontSize: 12 }}
              >
                <option value="">Max</option>
                {PRICE_OPTIONS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>BEDROOMS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {BEDS.map(b => (
                <button key={b} type="button"
                  onClick={() => updateParam("bedrooms", b === "Any" ? "" : b)}
                  style={{
                    padding: "4px 10px", fontSize: 12, borderRadius: 2, cursor: "pointer",
                    border: "1px solid " + (beds === b || (!beds && b === "Any") ? "#33a137" : "#ccc"),
                    background: beds === b || (!beds && b === "Any") ? "#33a137" : "#fff",
                    color: beds === b || (!beds && b === "Any") ? "#fff" : "#555",
                  }}>{b}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {dbDisconnected && (
            <div style={{
              background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 4,
              padding: "12px 16px", marginBottom: 16, color: "#b45309", fontSize: 13,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <Database size={16} />
              <span><strong>Offline Demonstration Mode:</strong> Database is offline. Displaying premium offline placeholder listings.</span>
            </div>
          )}

          {loadError && !dbDisconnected && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4,
              padding: "12px 16px", marginBottom: 16, color: "#b91c1c", fontSize: 13,
            }}>
              {loadError}
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : dbDisconnected ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {DEMO_PROPERTIES.map((p) => (
                  <PropertyCard key={p.id} property={p} variant="zameen" />
                ))}
              </div>
            </>
          ) : !result || result.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#888", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3 }}>
              <div style={{ fontSize: 32, marginBottom: 12, color: "#33a137", display: "inline-flex" }}><Home size={32} strokeWidth={1.9} /></div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>No properties found</div>
              <div>Try adjusting your search filters</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {result.items.map((p) => (
                  <PropertyCard key={p.id} property={p} variant="zameen" />
                ))}
              </div>

              {/* Pagination */}
              {result.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 28 }}>
                  {Array.from({ length: Math.min(result.totalPages, 10) }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} type="button"
                      onClick={() => updateParam("page", String(pg))}
                      style={{
                        padding: "6px 12px", fontSize: 13, cursor: "pointer",
                        border: "1px solid " + (page === pg ? "#33a137" : "#ccc"),
                        background: page === pg ? "#33a137" : "#fff",
                        color: page === pg ? "#fff" : "#555",
                        borderRadius: 2,
                      }}>{pg}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
