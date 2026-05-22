"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const inp: React.CSSProperties = { width: "100%", border: "1px solid #ccc", borderRadius: 3, padding: "9px 12px", fontSize: 14, outline: "none" };
const lbl: React.CSSProperties = { fontSize: 12, color: "#888", display: "block", marginBottom: 4 };

function fmt(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(2)} Lac`;
  return `PKR ${Math.round(n).toLocaleString()}`;
}

export default function ROICalculatorPage() {
  const [result, setResult] = useState<{ cashOnCashReturn: number; roiPercent: number; fiveYearProjectedValue: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const form = new FormData(e.currentTarget);
    const purchasePrice = Number(form.get("price"));
    const monthlyRent = Number(form.get("rent"));
    const annualExpenses = Number(form.get("expenses")) || 0;
    const appreciationRate = Number(form.get("appreciation")) || 5;
    try {
      const data = await api<{ cashOnCashReturn: number; roiPercent: number; fiveYearProjectedValue: number }>(
        "/calculators/roi",
        { method: "POST", body: JSON.stringify({ purchasePrice, monthlyRent, annualExpenses, appreciationRate }) }
      );
      setResult(data);
    } catch {
      /* client fallback */
      const annualRent = monthlyRent * 12;
      const netIncome = annualRent - annualExpenses;
      const cashOnCash = (netIncome / purchasePrice) * 100;
      const fiveYr = purchasePrice * Math.pow(1 + appreciationRate / 100, 5);
      setResult({ cashOnCashReturn: parseFloat(cashOnCash.toFixed(2)), roiPercent: parseFloat((cashOnCash + appreciationRate).toFixed(2)), fiveYearProjectedValue: fiveYr });
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <Link href="/tools" style={{ color: "#33a137" }}>Tools</Link> › <span>Construction Cost Calculator</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px", maxWidth: 560 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>🧮 Investment ROI Calculator</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Calculate returns on your property investment</p>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lbl}>Purchase Price (PKR)</label><input name="price" type="number" required placeholder="e.g. 5000000" style={inp} /></div>
            <div><label style={lbl}>Expected Monthly Rent (PKR)</label><input name="rent" type="number" required placeholder="e.g. 30000" style={inp} /></div>
            <div><label style={lbl}>Annual Expenses (PKR)</label><input name="expenses" type="number" placeholder="e.g. 50000" style={inp} defaultValue={0} /></div>
            <div><label style={lbl}>Annual Appreciation Rate (%)</label><input name="appreciation" type="number" placeholder="e.g. 5" style={inp} defaultValue={5} /></div>
            <button type="submit" disabled={loading} style={{
              background: "#33a137", color: "#fff", border: "none", borderRadius: 3,
              padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{loading ? "Calculating…" : "Calculate ROI"}</button>
          </form>

          {result && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Cash-on-Cash Return", value: `${result.cashOnCashReturn}%` },
                  { label: "Combined ROI", value: `${result.roiPercent}%` },
                  { label: "5-Year Value", value: fmt(result.fiveYearProjectedValue) },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#f0faf4", border: "1px solid #c3e6cb", borderRadius: 3,
                    padding: 14, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#33a137" }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
