"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Search, MessageCircle, ArrowRight, Sparkles, ShieldCheck, MapPin, Building2, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

const statCard: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 20,
  display: "flex",
  alignItems: "center",
  gap: 16,
  textDecoration: "none",
  transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
  boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
};

export default function DashboardPage() {
  const { user, accessToken, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ favorites: 0, savedSearches: 0, messages: 0 });

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    if (accessToken) {
      api<{ favorites: number; savedSearches: number; messages: number }>("/users/me/dashboard", { token: accessToken })
        .then(setStats).catch(() => null);
    }
  }, [user, accessToken, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const cards = [
    { href: "/dashboard/favorites", icon: Heart, label: "Saved Properties", value: stats.favorites, tone: "#2563eb" },
    { href: "/search", icon: Search, label: "Saved Searches", value: stats.savedSearches, tone: "#16a34a" },
    { href: "#", icon: MessageCircle, label: "Messages", value: stats.messages, tone: "#7c3aed" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top left, #e8fff0 0, #f8fafc 28%, #f8fafc 100%)" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #14532d 55%, #16a34a 100%)", color: "#fff", padding: "34px 0 30px" }}>
        <div className="z-container" style={{ padding: "0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 18, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "7px 12px", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
                <Sparkles size={14} /> Personal dashboard
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.6px" }}>Welcome back, {user.firstName}!</h1>
              <p style={{ fontSize: 14, opacity: 0.88, marginTop: 8, maxWidth: 640, lineHeight: 1.7 }}>Track saved homes, jump back into your searches, or list a property with a cleaner, faster workflow.</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    marginTop: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={16} /> Log out
                </button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 22, padding: 18, backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.8, marginBottom: 10 }}>Quick glance</div>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ShieldCheck size={16} /><span style={{ fontSize: 13 }}>Secure account access</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><MapPin size={16} /><span style={{ fontSize: 13 }}>Fast property discovery</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Building2 size={16} /><span style={{ fontSize: 13 }}>Listing tools ready</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 22 }}>
          {cards.map((c) => (
            <Link key={c.href} href={c.href} style={statCard}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 18px 40px rgba(15,23,42,0.08)"; e.currentTarget.style.borderColor = `${c.tone}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <span style={{ width: 54, height: 54, borderRadius: 16, background: `${c.tone}14`, color: c.tone, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.icon size={26} strokeWidth={2.2} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginTop: 4 }}>{c.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 22, padding: 22, boxShadow: "0 12px 34px rgba(15,23,42,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#64748b" }}>Quick Actions</div>
                <h2 style={{ margin: "4px 0 0", fontSize: 18, color: "#0f172a" }}>Jump back in</h2>
              </div>
              <ArrowRight size={18} color="#16a34a" />
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <Link href="/search" style={{ background: "#14532d", color: "#fff", borderRadius: 16, padding: "14px 16px", textDecoration: "none", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Search size={16} /> Search Properties</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/list-property" style={{ background: "#fff", color: "#14532d", border: "1px solid #bbf7d0", borderRadius: 16, padding: "14px 16px", textDecoration: "none", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Building2 size={16} /> List a Property</span>
                <ArrowRight size={16} />
              </Link>
              {(user.role === "AGENT" || user.role === "AGENCY_ADMIN") && (
                <Link href="/dashboard/agent" style={{ background: "#fff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: 16, padding: "14px 16px", textDecoration: "none", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Heart size={16} /> Agent Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#fff", borderRadius: 16, padding: "14px 16px", textDecoration: "none", fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><ShieldCheck size={16} /> Admin Panel</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)", border: "1px solid #d1fae5", borderRadius: 22, padding: 22, boxShadow: "0 12px 34px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#166534", marginBottom: 10 }}>Your workspace</div>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Stay organized</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.6 }}>Saved properties, searches, and messages are surfaced in one place so you can return to them quickly.</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Premium workflow</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.6 }}>Use the refined listing page to submit properties with a more guided, icon-driven flow.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
