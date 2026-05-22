"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BadgeDollarSign,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  Flag,
  LayoutGrid,
  MapPin,
  PenSquare,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

interface DashboardStats {
  users: number;
  properties: number;
  pending: number;
  activeSubscriptions: number;
  openReports: number;
}

interface City {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
}

interface PropertyType {
  id: string;
  name: string;
}

interface AdminProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  purpose: "SALE" | "RENT";
  category: string;
  status: string;
  featured: boolean;
  trending: boolean;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSize: number;
  areaUnit: string;
  address: string;
  cityId: string;
  areaId?: string | null;
  propertyTypeId: string;
  furnishingStatus?: string | null;
  possessionStatus?: string | null;
  builtYear?: number | null;
  floorsCount?: number | null;
  facingDirection?: string | null;
  city: { name: string };
  area?: { name: string } | null;
  propertyType?: { name: string } | null;
  images?: { url: string; isPrimary: boolean }[];
  createdAt: string;
}

interface PropertyFormState {
  title: string;
  description: string;
  purpose: "SALE" | "RENT";
  category: "RESIDENTIAL" | "COMMERCIAL" | "PLOT" | "PROJECT";
  status: string;
  featured: boolean;
  trending: boolean;
  price: number;
  bedrooms: string;
  bathrooms: string;
  areaSize: number;
  areaUnit: string;
  address: string;
  cityId: string;
  areaId: string;
  propertyTypeId: string;
  furnishingStatus: string;
  possessionStatus: string;
  builtYear: string;
  floorsCount: string;
  facingDirection: string;
}

const initialFormState: PropertyFormState = {
  title: "",
  description: "",
  purpose: "SALE",
  category: "RESIDENTIAL",
  status: "PENDING",
  featured: false,
  trending: false,
  price: 0,
  bedrooms: "",
  bathrooms: "",
  areaSize: 0,
  areaUnit: "MARLA",
  address: "",
  cityId: "",
  areaId: "",
  propertyTypeId: "",
  furnishingStatus: "",
  possessionStatus: "",
  builtYear: "",
  floorsCount: "",
  facingDirection: "",
};

function formatPrice(n: number | string) {
  const value = Number(n);
  if (Number.isNaN(value)) return String(n);
  if (value >= 10000000) return `PKR ${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)} Crore`;
  if (value >= 100000) return `PKR ${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)} Lakh`;
  return `PKR ${value.toLocaleString()}`;
}

function statusTone(status: string) {
  switch (status) {
    case "ACTIVE":
      return { bg: "#dcfce7", fg: "#166534" };
    case "PENDING":
      return { bg: "#fef3c7", fg: "#b45309" };
    case "REJECTED":
      return { bg: "#fee2e2", fg: "#b91c1c" };
    case "DRAFT":
      return { bg: "#e2e8f0", fg: "#334155" };
    default:
      return { bg: "#e2e8f0", fg: "#334155" };
  }
}

export default function AdminPage() {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pending, setPending] = useState<AdminProperty[]>([]);
  const [allProperties, setAllProperties] = useState<AdminProperty[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "all">("overview");
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const [editorLoading, setEditorLoading] = useState(false);

  const adminRequestTimeoutMs = 20000;

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }
    if (!accessToken) return;

    setLoading(true);
    Promise.all([
      api<DashboardStats>("/admin/dashboard", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
      api<AdminProperty[]>("/admin/properties?status=PENDING", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
      api<AdminProperty[]>("/admin/properties?status=ALL", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
      api<City[]>("/properties/cities/list", { timeoutMs: adminRequestTimeoutMs }),
      api<PropertyType[]>("/properties/types", { timeoutMs: adminRequestTimeoutMs }),
    ])
      .then(([statsData, pendingData, allData, citiesData, typesData]) => {
        setStats(statsData);
        setPending(pendingData || []);
        setAllProperties(allData || []);
        setCities(citiesData || []);
        setPropertyTypes(typesData || []);
      })
      .catch((err) => console.error("Error loading admin data:", err))
      .finally(() => setLoading(false));
  }, [user, accessToken, router]);

  async function refreshData() {
    if (!accessToken) return;
    try {
      const [statsData, pendingData, allData] = await Promise.all([
        api<DashboardStats>("/admin/dashboard", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
        api<AdminProperty[]>("/admin/properties?status=PENDING", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
        api<AdminProperty[]>("/admin/properties?status=ALL", { token: accessToken, timeoutMs: adminRequestTimeoutMs }),
      ]);
      setStats(statsData);
      setPending(pendingData || []);
      setAllProperties(allData || []);
    } catch (err) {
      console.error(err);
    }
  }

  function openEditor(property?: AdminProperty) {
    setFormError("");
    if (!property) {
      setEditingId(null);
      setForm(initialFormState);
      setShowEditor(true);
      return;
    }

    setEditingId(property.id);
    setForm({
      title: property.title,
      description: property.description,
      purpose: property.purpose,
      category: property.category as PropertyFormState["category"],
      status: property.status,
      featured: property.featured,
      trending: property.trending,
      price: property.price,
      bedrooms: property.bedrooms?.toString() ?? "",
      bathrooms: property.bathrooms?.toString() ?? "",
      areaSize: property.areaSize,
      areaUnit: property.areaUnit,
      address: property.address,
      cityId: property.cityId,
      areaId: property.areaId ?? "",
      propertyTypeId: property.propertyTypeId,
      furnishingStatus: property.furnishingStatus ?? "",
      possessionStatus: property.possessionStatus ?? "",
      builtYear: property.builtYear?.toString() ?? "",
      floorsCount: property.floorsCount?.toString() ?? "",
      facingDirection: property.facingDirection ?? "",
    });
    if (property.cityId) {
      api<Area[]>(`/properties/cities/${property.cityId}/areas`, { timeoutMs: adminRequestTimeoutMs })
        .then((data) => setAreas(data || []))
        .catch(() => setAreas([]));
    }
    setShowEditor(true);
  }

  async function saveProperty() {
    if (!accessToken || !editingId) return;
    setEditorLoading(true);
    setFormError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        purpose: form.purpose,
        category: form.category,
        status: form.status,
        featured: form.featured,
        trending: form.trending,
        price: form.price,
        bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
        bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
        areaSize: form.areaSize,
        areaUnit: form.areaUnit,
        address: form.address,
        cityId: form.cityId,
        areaId: form.areaId || null,
        propertyTypeId: form.propertyTypeId,
        furnishingStatus: form.furnishingStatus || null,
        possessionStatus: form.possessionStatus || null,
        builtYear: form.builtYear === "" ? null : Number(form.builtYear),
        floorsCount: form.floorsCount === "" ? null : Number(form.floorsCount),
        facingDirection: form.facingDirection || null,
      };

      await api(`/admin/properties/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        token: accessToken,
        timeoutMs: adminRequestTimeoutMs,
      });
      setShowEditor(false);
      setEditingId(null);
      setForm(initialFormState);
      await refreshData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save property");
    } finally {
      setEditorLoading(false);
    }
  }

  async function createProperty() {
    if (!accessToken) return;
    setEditorLoading(true);
    setFormError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        purpose: form.purpose,
        category: form.category,
        status: form.status,
        featured: form.featured,
        trending: form.trending,
        price: form.price,
        bedrooms: form.bedrooms === "" ? undefined : Number(form.bedrooms),
        bathrooms: form.bathrooms === "" ? undefined : Number(form.bathrooms),
        areaSize: form.areaSize,
        areaUnit: form.areaUnit,
        address: form.address,
        latitude: 0,
        longitude: 0,
        cityId: form.cityId,
        areaId: form.areaId || undefined,
        propertyTypeId: form.propertyTypeId,
      };

      await api(`/properties`, {
        method: "POST",
        body: JSON.stringify(payload),
        token: accessToken,
        timeoutMs: adminRequestTimeoutMs,
      });
      setShowEditor(false);
      setEditingId(null);
      setForm(initialFormState);
      await refreshData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to create property");
    } finally {
      setEditorLoading(false);
    }
  }

  async function approve(id: string) {
    if (!accessToken) return;
    try {
      await api(`/admin/properties/${id}/approve`, { method: "POST", token: accessToken, timeoutMs: adminRequestTimeoutMs });
      await refreshData();
    } catch (error) {
      alert(`Failed to approve property: ${error}`);
    }
  }

  async function reject(id: string) {
    if (!accessToken) return;
    if (!window.confirm("Reject this listing?")) return;
    try {
      await api(`/admin/properties/${id}/reject`, { method: "POST", token: accessToken, timeoutMs: adminRequestTimeoutMs });
      await refreshData();
    } catch (error) {
      alert(`Failed to reject property: ${error}`);
    }
  }

  async function remove(id: string) {
    if (!accessToken) return;
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      setSavingId(id);
      await api(`/admin/properties/${id}`, { method: "DELETE", token: accessToken, timeoutMs: adminRequestTimeoutMs });
      await refreshData();
    } catch (error) {
      alert(`Failed to delete property: ${error}`);
    } finally {
      setSavingId(null);
    }
  }

  async function changeCity(cityId: string) {
    setForm((prev) => ({ ...prev, cityId, areaId: "" }));
    if (!cityId) {
      setAreas([]);
      return;
    }
    try {
      const data = await api<Area[]>(`/properties/cities/${cityId}/areas`, { timeoutMs: adminRequestTimeoutMs });
      setAreas(data || []);
    } catch {
      setAreas([]);
    }
  }

  if (!user || user.role !== "ADMIN") return null;

  const filteredAll = allProperties.filter((property) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [property.title, property.city?.name, property.area?.name, property.status, property.category]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.users, icon: Users, color: "#2563eb" },
        { label: "Active Listings", value: stats.properties, icon: Building2, color: "#16a34a" },
        { label: "Pending Approval", value: stats.pending, icon: Clock3, color: "#d97706" },
        { label: "Subscriptions", value: stats.activeSubscriptions, icon: BadgeDollarSign, color: "#7c3aed" },
        { label: "Open Reports", value: stats.openReports, icon: Flag, color: "#dc2626" },
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #14532d 45%, #16a34a 100%)", color: "#fff", padding: "28px 0 32px" }}>
        <div className="z-container" style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", opacity: 0.8, fontWeight: 700 }}>Admin Control Center</div>
              <h1 style={{ margin: "8px 0 4px", fontSize: 30, lineHeight: 1.1, fontWeight: 900 }}>Property Management Dashboard</h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>Approve, edit, feature, and remove listings from one place.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", textDecoration: "none", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
              <button type="button" onClick={() => { setEditingId(null); setForm(initialFormState); setShowEditor(true); }} style={{ background: "#fff", color: "#14532d", border: "none", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <PenSquare size={14} /> Add Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px 48px" }}>
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginTop: -24, marginBottom: 24 }}>
            {statCards.map((card) => (
              <div key={card.label} style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,0.06)", padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${card.color}15`, color: card.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <card.icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>
          <aside style={{ position: "sticky", top: 16 }}>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", boxShadow: "0 10px 28px rgba(15,23,42,0.05)", padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.6 }}>Management Mode</div>
              <button type="button" onClick={() => setActiveTab("overview")} style={{ width: "100%", marginBottom: 10, background: activeTab === "overview" ? "#14532d" : "#f8fafc", color: activeTab === "overview" ? "#fff" : "#0f172a", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, cursor: "pointer" }}>
                <LayoutGrid size={16} /> Pending Review
              </button>
              <button type="button" onClick={() => setActiveTab("all")} style={{ width: "100%", background: activeTab === "all" ? "#14532d" : "#f8fafc", color: activeTab === "all" ? "#fff" : "#0f172a", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, cursor: "pointer" }}>
                <Building2 size={16} /> All Listings
              </button>

              <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "linear-gradient(180deg, #f0fdf4 0%, #ecfeff 100%)", border: "1px solid #d1fae5" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#166534", marginBottom: 8, textTransform: "uppercase" }}>Quick Actions</div>
                <div style={{ display: "grid", gap: 8 }}>
                  <button type="button" onClick={() => setActiveTab("overview")} style={{ border: "none", background: "#fff", padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", fontWeight: 700, color: "#0f172a" }}>Review pending</button>
                  <button type="button" onClick={() => setActiveTab("all")} style={{ border: "none", background: "#fff", padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", fontWeight: 700, color: "#0f172a" }}>Manage all properties</button>
                  <button type="button" onClick={() => { setEditingId(null); setForm(initialFormState); setShowEditor(true); }} style={{ border: "none", background: "#fff", padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", fontWeight: 700, color: "#0f172a" }}>Create listing</button>
                </div>
              </div>
            </div>
          </aside>

          <main>
            <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #e2e8f0", boxShadow: "0 12px 34px rgba(15,23,42,0.06)", overflow: "hidden" }}>
              <div style={{ padding: 18, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#64748b" }}>Listing Center</div>
                  <h2 style={{ margin: "4px 0 0", fontSize: 20, color: "#0f172a" }}>{activeTab === "overview" ? `Pending Properties (${pending.length})` : `All Listings (${filteredAll.length})`}</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {activeTab === "all" && (
                    <div style={{ position: "relative" }}>
                      <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, city, status..." style={{ width: 300, maxWidth: "70vw", padding: "11px 14px 11px 36px", borderRadius: 12, border: "1px solid #cbd5e1", outline: "none", fontSize: 13 }} />
                    </div>
                  )}
                  <button type="button" onClick={() => { setEditingId(null); setForm(initialFormState); setShowEditor(true); }} style={{ background: "#14532d", color: "#fff", border: "none", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Edit3 size={14} /> Create Property
                  </button>
                </div>
              </div>

              <div style={{ padding: 18 }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ display: "inline-block", width: 34, height: 34, border: "3px solid #e2e8f0", borderTop: "3px solid #14532d", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 12 }}>Loading property management data...</p>
                  </div>
                ) : activeTab === "overview" ? (
                  pending.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "72px 20px", borderRadius: 20, background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", border: "1px dashed #cbd5e1" }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", color: "#166534", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                        <ShieldCheck size={36} />
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "#0f172a" }}>No pending listings</h3>
                      <p style={{ margin: "0 auto", maxWidth: 460, color: "#64748b", fontSize: 13 }}>Listings submitted by agents and admins will appear here for review. You can jump to All Listings to edit or remove any record.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 14 }}>
                      {pending.map((property) => (
                        <div key={property.id} style={{ border: "1px solid #e2e8f0", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 20px rgba(15,23,42,0.04)", background: "#fff" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 220px", gap: 16, padding: 16, alignItems: "center" }}>
                            <div style={{ position: "relative", width: "100%", height: 132, borderRadius: 16, overflow: "hidden", background: "#f8fafc" }}>
                              <Image src={property.images?.find((i) => i.isPrimary)?.url ?? property.images?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600"} alt={property.title} fill style={{ objectFit: "cover" }} unoptimized />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "5px 10px", background: "#dcfce7", color: "#166534" }}>{property.status}</span>
                                <span style={{ fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "5px 10px", background: "#eef2ff", color: "#4338ca" }}>{property.category}</span>
                                <span style={{ fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "5px 10px", background: "#fef3c7", color: "#b45309" }}>{property.purpose}</span>
                              </div>
                              <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#0f172a", lineHeight: 1.25 }}>{property.title}</h3>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, color: "#64748b", fontSize: 13, marginBottom: 10 }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {property.address}</span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Bath size={14} /> {property.bedrooms ?? 0} beds / {property.bathrooms ?? 0} baths</span>
                              </div>
                              <p style={{ margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{property.description}</p>
                            </div>
                            <div style={{ display: "grid", gap: 10 }}>
                              <div style={{ fontSize: 22, fontWeight: 900, color: "#14532d" }}>{formatPrice(property.price)}</div>
                              <button type="button" onClick={() => approve(property.id)} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                                <Check size={14} /> Approve
                              </button>
                              <button type="button" onClick={() => reject(property.id)} style={{ background: "#fff", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                                <X size={14} /> Reject
                              </button>
                              <button type="button" onClick={() => openEditor(property)} style={{ background: "#fff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                                <Edit3 size={14} /> Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : filteredAll.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "72px 20px", borderRadius: 20, background: "#fff", border: "1px dashed #cbd5e1" }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>No listings match your search</h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Try a different keyword or clear the search box.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {filteredAll.map((property) => {
                      const tone = statusTone(property.status);
                      return (
                        <div key={property.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, display: "grid", gridTemplateColumns: "140px 1fr 270px", gap: 16, alignItems: "center" }}>
                          <div style={{ position: "relative", width: "100%", height: 108, borderRadius: 16, overflow: "hidden", background: "#f8fafc" }}>
                            <Image src={property.images?.find((i) => i.isPrimary)?.url ?? property.images?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600"} alt={property.title} fill style={{ objectFit: "cover" }} unoptimized />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                              <span style={{ background: tone.bg, color: tone.fg, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>{property.status}</span>
                              <span style={{ background: "#eef2ff", color: "#4338ca", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>{property.category}</span>
                              {property.featured && <span style={{ background: "#fef3c7", color: "#b45309", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>Featured</span>}
                              {property.trending && <span style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>Trending</span>}
                            </div>
                            <h3 style={{ margin: "0 0 6px", fontSize: 17, color: "#0f172a" }}>{property.title}</h3>
                            <div style={{ color: "#64748b", fontSize: 13, display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                              <span>{formatPrice(property.price)}</span>
                              <span>•</span>
                              <span>{property.city?.name}</span>
                              <span>•</span>
                              <span>{property.propertyType?.name ?? "Property Type"}</span>
                            </div>
                            <div style={{ color: "#475569", fontSize: 13, display: "flex", flexWrap: "wrap", gap: 10 }}>
                              <span>{property.areaSize} {property.areaUnit}</span>
                              {property.bedrooms != null && <span>{property.bedrooms} beds</span>}
                              {property.bathrooms != null && <span>{property.bathrooms} baths</span>}
                              <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div style={{ display: "grid", gap: 8 }}>
                            <button type="button" onClick={() => openEditor(property)} style={{ background: "#14532d", color: "#fff", border: "none", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                              <Edit3 size={14} /> Edit
                            </button>
                            <button type="button" onClick={() => remove(property.id)} disabled={savingId === property.id} style={{ background: "#fff", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: savingId === property.id ? 0.6 : 1 }}>
                              <Trash2 size={14} /> Delete
                            </button>
                            <Link href={`/property/${property.slug}`} target="_blank" style={{ background: "#fff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                              <Eye size={14} /> View
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {showEditor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}>
          <div style={{ width: "min(980px, 100%)", maxHeight: "92vh", overflow: "auto", background: "#fff", borderRadius: 24, boxShadow: "0 24px 80px rgba(15,23,42,0.3)" }}>
            <div style={{ padding: 18, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.6 }}>{editingId ? "Edit Listing" : "Create Listing"}</div>
                <h3 style={{ margin: "4px 0 0", fontSize: 20, color: "#0f172a" }}>{editingId ? "Update existing property" : "Create a new property listing"}</h3>
              </div>
              <button type="button" onClick={() => setShowEditor(false)} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 18 }}>
              {formError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 14, padding: 12, marginBottom: 16, fontSize: 13 }}>{formError}</div>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Title</label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", outline: "none" }}>
                    { ["PENDING", "ACTIVE", "REJECTED", "DRAFT"].map((s) => <option key={s} value={s}>{s}</option>) }
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ width: "100%", minHeight: 120, border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Purpose</label>
                  <select value={form.purpose} onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value as PropertyFormState["purpose"] }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }}>
                    <option value="SALE">Sale</option>
                    <option value="RENT">Rent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as PropertyFormState["category"] }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }}>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="PLOT">Plot</option>
                    <option value="PROJECT">Project</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Price</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Area</label>
                  <input type="number" value={form.areaSize || ""} onChange={(e) => setForm((p) => ({ ...p, areaSize: Number(e.target.value) }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Area Unit</label>
                  <input value={form.areaUnit} onChange={(e) => setForm((p) => ({ ...p, areaUnit: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Bedrooms</label>
                  <input type="number" value={form.bedrooms} onChange={(e) => setForm((p) => ({ ...p, bedrooms: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Bathrooms</label>
                  <input type="number" value={form.bathrooms} onChange={(e) => setForm((p) => ({ ...p, bathrooms: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>City</label>
                  <select value={form.cityId} onChange={(e) => void changeCity(e.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }}>
                    <option value="">Select city</option>
                    {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Area</label>
                  <select value={form.areaId} onChange={(e) => setForm((p) => ({ ...p, areaId: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }}>
                    <option value="">Select area</option>
                    {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Property Type</label>
                  <select value={form.propertyTypeId} onChange={(e) => setForm((p) => ({ ...p, propertyTypeId: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }}>
                    <option value="">Select type</option>
                    {propertyTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Featured / Trending</label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", minHeight: 42 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><input type="checkbox" checked={form.trending} onChange={(e) => setForm((p) => ({ ...p, trending: e.target.checked }))} /> Trending</label>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Furnishing Status</label>
                  <input value={form.furnishingStatus} onChange={(e) => setForm((p) => ({ ...p, furnishingStatus: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Possession Status</label>
                  <input value={form.possessionStatus} onChange={(e) => setForm((p) => ({ ...p, possessionStatus: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Facing Direction</label>
                  <input value={form.facingDirection} onChange={(e) => setForm((p) => ({ ...p, facingDirection: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Built Year</label>
                  <input value={form.builtYear} onChange={(e) => setForm((p) => ({ ...p, builtYear: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Floors Count</label>
                  <input value={form.floorsCount} onChange={(e) => setForm((p) => ({ ...p, floorsCount: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                <button type="button" onClick={() => setShowEditor(false)} style={{ border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", borderRadius: 14, padding: "11px 16px", fontWeight: 800, cursor: "pointer" }}>
                  Cancel
                </button>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => { setEditingId(null); setForm(initialFormState); setShowEditor(true); }} style={{ border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", borderRadius: 14, padding: "11px 16px", fontWeight: 800, cursor: "pointer" }}>
                    Clear Form
                  </button>
                  <button type="button" onClick={() => (editingId ? saveProperty() : createProperty())} disabled={editorLoading} style={{ border: "none", background: editorLoading ? "#94a3b8" : "#14532d", color: "#fff", borderRadius: 14, padding: "11px 18px", fontWeight: 900, cursor: editorLoading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {editorLoading ? "Saving..." : editingId ? "Save Changes" : "Create Property"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}