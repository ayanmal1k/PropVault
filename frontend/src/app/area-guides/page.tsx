import Link from "next/link";
import { api } from "@/lib/api";

interface Guide { slug: string; title: string; city: { name: string }; avgPrice?: number; propertyCount: number; }

export const metadata = { title: "Area Guides — PropVault" };

function fmt(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(1)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

async function getGuides() {
  try { return await api<Guide[]>("/area-guides", { timeoutMs: 5000 }); }
  catch { return []; }
}

export default async function AreaGuidesPage() {
  const guides = await getGuides();

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <span>Area Guides</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>Area Guides</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Explore neighborhoods and housing societies across Pakistan</p>

        {guides.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 40, textAlign: "center", color: "#888" }}>
            No area guides yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {guides.map((g) => (
              <Link key={g.slug} href={`/area-guides/${g.slug}`}
                style={{
                  display: "block", background: "#fff", border: "1px solid #e0e0e0",
                  borderRadius: 3, padding: 20, textDecoration: "none",
                  transition: "box-shadow 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{g.title}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{g.city.name}</div>
                <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 13 }}>
                  {g.avgPrice && (
                    <span style={{ color: "#33a137", fontWeight: 700 }}>Avg. {fmt(Number(g.avgPrice))}</span>
                  )}
                  <span style={{ color: "#555" }}>{g.propertyCount.toLocaleString()} listings</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
