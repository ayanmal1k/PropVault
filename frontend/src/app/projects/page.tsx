import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";

interface Project { id: string; name: string; slug: string; coverImage?: string; developer?: string; minPrice?: number; city?: { name: string }; }

export const metadata = { title: "New Projects in Pakistan — PropVault" };

async function getProjects() {
  try { return await api<Project[]>("/projects", { timeoutMs: 5000 }); }
  catch { return []; }
}

function fmt(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(1)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <span>New Projects</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>New Projects in Pakistan</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Invest in the best new real estate projects</p>

        {projects.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 40, textAlign: "center", color: "#888" }}>
            No projects found. The backend may still be starting up.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="z-prop-card" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ position: "relative", height: 180 }}>
                  <Image
                    src={p.coverImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                    alt={p.name} fill style={{ objectFit: "cover" }} sizes="380px" unoptimized
                  />
                  <span style={{
                    position: "absolute", top: 8, left: 8, background: "#33a137", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
                  }}>NEW PROJECT</span>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>{p.name}</div>
                  {p.developer && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>By {p.developer}</div>}
                  {p.city && <div style={{ fontSize: 12, color: "#888" }}>{p.city.name}</div>}
                  {p.minPrice && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#33a137", marginTop: 6 }}>
                      From {fmt(Number(p.minPrice))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
