"use client";

import { useState } from "react";
import Link from "next/link";
import { Ruler } from "lucide-react";
import { api } from "@/lib/api";

const UNITS = [
  { value: "MARLA", label: "Marla" },
  { value: "KANAL", label: "Kanal" },
  { value: "SQFT", label: "Square Feet" },
  { value: "SQYD", label: "Square Yards" },
  { value: "SQMETER", label: "Square Meters" },
  { value: "ACRE", label: "Acre" },
];

const inp: React.CSSProperties = { width: "100%", border: "1px solid #ccc", borderRadius: 3, padding: "9px 12px", fontSize: 14, outline: "none" };
const lbl: React.CSSProperties = { fontSize: 12, color: "#888", display: "block", marginBottom: 4 };
const sel: React.CSSProperties = { ...inp };

export default function AreaConverterPage() {
  const [result, setResult] = useState<number | null>(null);
  const [from, setFrom] = useState("MARLA");
  const [to, setTo] = useState("SQFT");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = Number(form.get("value"));
    try {
      const data = await api<{ value: number }>("/calculators/area-convert", {
        method: "POST",
        body: JSON.stringify({ value, from, to }),
      });
      setResult(data.value);
    } catch {
      /* local conversion table */
      const toSqFt: Record<string, number> = {
        MARLA: 272.25, KANAL: 5445, SQFT: 1, SQYD: 9, SQMETER: 10.764, ACRE: 43560,
      };
      const inSqFt = value * (toSqFt[from] ?? 1);
      setResult(parseFloat((inSqFt / (toSqFt[to] ?? 1)).toFixed(4)));
    }
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <Link href="/tools" style={{ color: "#33a137" }}>Tools</Link> › <span>Area Unit Converter</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px", maxWidth: 520 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Ruler size={18} color="#33a137" /> Area Unit Converter</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Convert any area unit instantly</p>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lbl}>Value</label><input name="value" type="number" step="any" required placeholder="Enter value" style={inp} /></div>
            <div>
              <label style={lbl}>From Unit</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} style={sel}>
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>To Unit</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} style={sel}>
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            <button type="submit" style={{
              background: "#33a137", color: "#fff", border: "none", borderRadius: 3,
              padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>Convert</button>
          </form>

          {result != null && (
            <div style={{
              marginTop: 20, padding: 20, background: "#f0faf4",
              border: "1px solid #c3e6cb", borderRadius: 3, textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#33a137" }}>{result}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                {UNITS.find(u => u.value === to)?.label}
              </div>
            </div>
          )}
        </div>

        {/* Reference table */}
        <div style={{ marginTop: 20, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Common Conversions</div>
          {[
            ["1 Marla", "272.25 Sq Ft"],
            ["1 Kanal", "20 Marla"],
            ["1 Acre", "8 Kanal"],
            ["1 Sq Meter", "10.764 Sq Ft"],
          ].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ color: "#555" }}>{a}</span>
              <span style={{ color: "#33a137", fontWeight: 700 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
