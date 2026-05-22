"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BarChart3, BadgeCheck, MessageCircle, Home, ChevronRight, ChevronLeft, Upload, Trash2, MapPin, FileText, LocateFixed, Home as HomeIcon, Sparkles, Camera, ClipboardCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

interface FormData {
  title: string;
  description: string;
  purpose: "SALE" | "RENT";
  category: "RESIDENTIAL" | "COMMERCIAL" | "PLOT" | "PROJECT";
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSize: number;
  areaUnit: string;
  address: string;
  latitude: number;
  longitude: number;
  cityId: string;
  areaId: string;
  propertyTypeId: string;
  furnishingStatus: string;
  possessionStatus: string;
  builtYear: number;
  floorsCount: number;
  facingDirection: string;
  images: { url: string; isPrimary: boolean }[];
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
  category: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  purpose: "SALE",
  category: "RESIDENTIAL",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  areaSize: 0,
  areaUnit: "MARLA",
  address: "",
  latitude: 0,
  longitude: 0,
  cityId: "",
  areaId: "",
  propertyTypeId: "",
  furnishingStatus: "",
  possessionStatus: "",
  builtYear: 0,
  floorsCount: 0,
  facingDirection: "",
  images: [],
};

const STEPS = [
  { num: 1, title: "Basic Info", icon: FileText },
  { num: 2, title: "Location", icon: LocateFixed },
  { num: 3, title: "Details", icon: HomeIcon },
  { num: 4, title: "Furnishing", icon: Sparkles },
  { num: 5, title: "Images", icon: Camera },
  { num: 6, title: "Review", icon: ClipboardCheck },
];

export default function ListPropertyPage() {
  const { user, accessToken } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    loadLookupData();
  }, []);

  const loadLookupData = async () => {
    try {
      const [citiesData, typesData] = await Promise.all([
        api<City[]>("/properties/cities/list"),
        api<PropertyType[]>("/properties/types"),
      ]);
      setCities(citiesData);
      setPropertyTypes(typesData);
    } catch (error) {
      console.error("Failed to load lookup data:", error);
    }
  };

  const loadAreas = async (cityId: string) => {
    try {
      const areasData = await api<Area[]>(`/properties/cities/${cityId}/areas`);
      setAreas(areasData);
    } catch (error) {
      console.error("Failed to load areas:", error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "cityId") {
      loadAreas(value);
      setForm(prev => ({ ...prev, areaId: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, { url: event.target?.result as string, isPrimary: prev.images.length === 0 }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) return form.title.trim().length > 0 && form.description.trim().length > 0 && form.price > 0;
    if (step === 2) return form.address.length >= 5 && form.cityId && form.latitude && form.longitude;
    if (step === 3) return form.areaSize > 0 && form.propertyTypeId;
    if (step === 4) return true;
    if (step === 5) return form.images.length > 0;
    if (step === 6) return true;
    return false;
  };

  const handleSubmit = async () => {
    try {
      if (!accessToken) {
        setSubmitError("Authentication required. Please sign in again.");
        return;
      }
      if (!form.price || form.price <= 0) {
        setSubmitError("Please add a valid price before publishing.");
        return;
      }
      setLoading(true);
      setSubmitError("");
      await api("/properties", {
        method: "POST",
        body: JSON.stringify(form),
        token: accessToken,
      });
      // Success - redirect to properties
      window.location.href = "/";
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
        <div style={{ background: "#33a137", color: "#fff", padding: "28px 0" }}>
          <div className="z-container" style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Add Your Property</h1>
          </div>
        </div>
        <div className="z-container" style={{ padding: "32px 16px", maxWidth: 720 }}>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 40, textAlign: "center" }}>
            <Home size={48} strokeWidth={1.8} style={{ color: "#33a137", marginBottom: 16, display: "block" }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#333", marginBottom: 8 }}>Sign in to List Your Property</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>You need an agent or agency account to post property listings on PropVault.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link href="/auth/login" style={{ background: "#33a137", color: "#fff", border: "none", borderRadius: 3, padding: "10px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
              <Link href="/auth/register" style={{ background: "#fff", color: "#33a137", border: "1px solid #33a137", borderRadius: 3, padding: "10px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Register Free</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: "radial-gradient(circle at top left, #e8fff0 0, #f8fafc 28%, #f8fafc 100%)" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #14532d 55%, #16a34a 100%)", color: "#fff", padding: "30px 0 34px" }}>
        <div className="z-container" style={{ padding: "0 16px" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "7px 12px", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
              <Sparkles size={14} /> Premium listing workflow
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0, letterSpacing: "-0.6px" }}>Add Your Property</h1>
            <p style={{ fontSize: 14, opacity: 0.88, marginTop: 8, lineHeight: 1.7 }}>A guided, icon-led flow for creating polished property listings with smoother navigation and clearer steps.</p>
          </div>
        </div>
      </div>

      <div className="z-container" style={{ padding: "28px 16px", maxWidth: 1040, marginTop: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16, marginBottom: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 12px 34px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#64748b" }}>Step navigation</div>
            <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.6 }}>Move through the listing wizard. Icons make each step easier to scan at a glance.</p>
          </div>
          <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)", border: "1px solid #d1fae5", borderRadius: 20, padding: 18, boxShadow: "0 12px 34px rgba(15,23,42,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#166534" }}>Tips</div>
            <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.6 }}>Use clear titles, high-quality photos, and complete location details to improve listing quality.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22, overflowX: "auto", paddingBottom: 8 }}>
          {STEPS.map((step) => (
            <div key={step.num} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  background: currentStep >= step.num ? "#14532d" : "#e2e8f0",
                  color: "#fff",
                  borderRadius: 14,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: currentStep >= step.num ? "0 10px 24px rgba(20,83,45,0.2)" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (validateStep(currentStep)) setCurrentStep(step.num);
                }}
              >
                <step.icon size={18} strokeWidth={2.3} />
              </div>
              {step.num < STEPS.length && (
                <div
                  style={{
                    width: 54,
                    height: 2,
                    background: currentStep > step.num ? "#14532d" : "#cbd5e1",
                  }}
                />
              )}
              <div style={{ minWidth: 82 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: currentStep >= step.num ? "#14532d" : "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 32, boxShadow: "0 16px 44px rgba(15,23,42,0.06)" }}>
          {submitError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: 12, marginBottom: 20, fontSize: 13, color: "#b91c1c" }}>
              {submitError}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: "#0f172a" }}>Basic Property Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Purpose *</label>
                  <select value={form.purpose} onChange={(e) => handleInputChange("purpose", e.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 12px", fontSize: 13, background: "#fff" }}>
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Category *</label>
                  <select value={form.category} onChange={(e) => handleInputChange("category", e.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 12px", fontSize: 13, background: "#fff" }}>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="PLOT">Plot</option>
                    <option value="PROJECT">Project</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Title *</label>
                <input value={form.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="e.g. Luxury 5 Bed Villa in DHA Phase 6" style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 12px", fontSize: 13 }} />
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{form.title.length}/100</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Description *</label>
                <textarea value={form.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Describe the property, its amenities, condition, etc." style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 12px", fontSize: 13, minHeight: 120, fontFamily: "inherit" }} />
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{form.description.length}/1000</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>Price (PKR) *</label>
                <input type="number" value={form.price || ""} onChange={(e) => handleInputChange("price", parseFloat(e.target.value))} placeholder="e.g. 15000000" style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "11px 12px", fontSize: 13 }} />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: "#0f172a" }}>Property Location</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>City *</label>
                  <select value={form.cityId} onChange={(e) => handleInputChange("cityId", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Area</label>
                  <select value={form.areaId} onChange={(e) => handleInputChange("areaId", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Select Area</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Address *</label>
                <input value={form.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="Enter property address" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Latitude *</label>
                  <input type="number" step="0.0001" value={form.latitude || ""} onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value))} placeholder="e.g. 31.5204" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Longitude *</label>
                  <input type="number" step="0.0001" value={form.longitude || ""} onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value))} placeholder="e.g. 74.3587" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#333" }}>Property Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Property Type *</label>
                  <select value={form.propertyTypeId} onChange={(e) => handleInputChange("propertyTypeId", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Select Type</option>
                    {propertyTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Bedrooms</label>
                  <input type="number" value={form.bedrooms || ""} onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))} placeholder="0" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Bathrooms</label>
                  <input type="number" value={form.bathrooms || ""} onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value))} placeholder="0" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Area Size *</label>
                  <input type="number" value={form.areaSize || ""} onChange={(e) => handleInputChange("areaSize", parseFloat(e.target.value))} placeholder="e.g. 5" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Unit</label>
                  <select value={form.areaUnit} onChange={(e) => handleInputChange("areaUnit", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="MARLA">Marla</option>
                    <option value="KANAL">Kanal</option>
                    <option value="SQFT">Sq Ft</option>
                    <option value="SQYD">Sq Yd</option>
                    <option value="SQMETER">Sq Meter</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Furnishing & Additional */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#333" }}>Furnishing & Additional Info</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Furnishing Status</label>
                  <select value={form.furnishingStatus} onChange={(e) => handleInputChange("furnishingStatus", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Not Specified</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully-Furnished">Fully Furnished</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Possession Status</label>
                  <select value={form.possessionStatus} onChange={(e) => handleInputChange("possessionStatus", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Not Specified</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Available-Soon">Available Soon</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Built Year</label>
                  <input type="number" value={form.builtYear || ""} onChange={(e) => handleInputChange("builtYear", parseInt(e.target.value))} placeholder="e.g. 2020" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Number of Floors</label>
                  <input type="number" value={form.floorsCount || ""} onChange={(e) => handleInputChange("floorsCount", parseInt(e.target.value))} placeholder="e.g. 3" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6 }}>Facing Direction</label>
                  <select value={form.facingDirection} onChange={(e) => handleInputChange("facingDirection", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: "9px 12px", fontSize: 13 }}>
                    <option value="">Not Specified</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North East</option>
                    <option value="North-West">North West</option>
                    <option value="South-East">South East</option>
                    <option value="South-West">South West</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Images */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#333" }}>Upload Images *</h2>
              <div style={{ border: "2px dashed #33a137", borderRadius: 6, padding: 32, textAlign: "center", marginBottom: 20 }}>
                <Upload size={32} style={{ color: "#33a137", margin: "0 auto 12px" }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 4 }}>Click to upload images</div>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>or drag and drop. PNG, JPG up to 10MB</div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="imageInput" />
                <label htmlFor="imageInput" style={{ background: "#33a137", color: "#fff", border: "none", borderRadius: 4, padding: "9px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-block" }}>
                  Select Images
                </label>
              </div>
              {form.images.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 12 }}>Uploaded Images ({form.images.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {form.images.map((img, idx) => (
                      <div key={idx} style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#f5f5f5" }}>
                        <img src={img.url} alt={`Property ${idx + 1}`} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                        <button
                          onClick={() => removeImage(idx)}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 3,
                            padding: 4,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={14} color="#c33" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#333" }}>Review Your Listing</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>TITLE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 4 }}>{form.title}</div>
                </div>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>PRICE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#33a137", marginTop: 4 }}>PKR {form.price.toLocaleString()}</div>
                </div>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>PURPOSE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 4 }}>{form.purpose}</div>
                </div>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>CATEGORY</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 4 }}>{form.category}</div>
                </div>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>AREA SIZE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 4 }}>{form.areaSize} {form.areaUnit}</div>
                </div>
                <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>BEDROOMS</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 4 }}>{form.bedrooms || "N/A"}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>DESCRIPTION</div>
                <div style={{ fontSize: 13, color: "#333", marginTop: 6, lineHeight: 1.6 }}>{form.description}</div>
              </div>
              {form.images.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 12 }}>Images ({form.images.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {form.images.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={img.url} alt={`Property ${idx + 1}`} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 4 }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "space-between" }}>
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              style={{
                background: currentStep === 1 ? "#f0f0f0" : "#fff",
                border: "1px solid #ddd",
                borderRadius: 4,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: currentStep === 1 ? "#999" : "#333",
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => {
                  if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
                }}
                disabled={!validateStep(currentStep)}
                style={{
                  background: validateStep(currentStep) ? "#33a137" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: validateStep(currentStep) ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: loading ? "#999" : "#33a137",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Publishing..." : "Publish Listing"}
              </button>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: BarChart3, title: "Millions of Visitors", desc: "Reach Pakistan's largest real estate audience" },
            { icon: BadgeCheck, title: "Verified Badge", desc: "Stand out with a verified listing badge" },
            { icon: MessageCircle, title: "Direct Chat", desc: "Chat with buyers instantly" },
          ].map((b) => (
            <div key={b.title} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12, color: "#33a137", display: "flex", justifyContent: "center" }}>
                <b.icon size={28} strokeWidth={1.8} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
