import Link from "next/link";
import { api } from "@/lib/api";
import { BadgeCheck } from "lucide-react";

interface Agency { id: string; name: string; slug: string; rating: number; verified: boolean; city?: { name: string }; logo?: string; }

export const metadata = { title: "Real Estate Agencies in Pakistan — PropVault" };

async function getAgencies() {
  try { return await api<Agency[]>("/agencies", { timeoutMs: 5000 }); }
  catch { return []; }
}

export default async function AgenciesPage() {
  const agencies = await getAgencies();

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <span>Agencies</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>Real Estate Agencies in Pakistan</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Find trusted, verified real estate professionals</p>

        {agencies.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 40, textAlign: "center", color: "#888" }}>
            No agencies listed yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {agencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`} className="z-agency-card" style={{ textDecoration: "none" }}>
                <div style={{
                  width: 60, height: 60, border: "1px solid #e0e0e0", borderRadius: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 22, color: "#33a137", background: "#f0faf4", flexShrink: 0,
                }}>
                  {a.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>{a.name}</div>
                  {a.city && <div style={{ fontSize: 12, color: "#888" }}>{a.city.name}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
                    <span style={{ fontSize: 12, color: "#555" }}>{a.rating?.toFixed(1) ?? "N/A"}</span>
                    {a.verified && (
                      <span style={{ fontSize: 11, color: "#33a137", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><BadgeCheck size={12} /> Verified</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
