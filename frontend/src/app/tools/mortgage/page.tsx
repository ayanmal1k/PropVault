"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const inp: React.CSSProperties = {
  width: "100%", border: "1px solid #ccc", borderRadius: 3,
  padding: "9px 12px", fontSize: 14, outline: "none",
};
const lbl: React.CSSProperties = { fontSize: 12, color: "#888", display: "block", marginBottom: 4 };

function fmt(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(2)} Lac`;
  return `PKR ${Math.round(n).toLocaleString()}`;
}

export default function MortgageCalculatorPage() {
  const [result, setResult] = useState<{ monthlyPayment: number; totalInterest: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const principal = Number(form.get("principal"));
    const downPayment = Number(form.get("downPayment"));
    const annualRate = Number(form.get("rate"));
    const years = Number(form.get("years"));
    try {
      const data = await api<{ monthlyPayment: number; totalInterest: number }>("/calculators/mortgage", {
        method: "POST",
        body: JSON.stringify({ principal, downPayment, annualRate, years }),
      });
      setResult(data);
    } catch {
      /* client-side fallback */
      const p = principal - downPayment;
      const r = annualRate / 100 / 12;
      const n = years * 12;
      const monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setResult({ monthlyPayment: monthly, totalInterest: monthly * n - p });
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <Link href="/tools" style={{ color: "#33a137" }}>Tools</Link> › <span>Home Loan Calculator</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px", maxWidth: 560 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 4 }}>Home Loan Calculator</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Find affordable loan packages for your property</p>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lbl}>Property Price (PKR)</label><input name="principal" type="number" required placeholder="e.g. 5000000" style={inp} /></div>
            <div><label style={lbl}>Down Payment (PKR)</label><input name="downPayment" type="number" placeholder="e.g. 1000000" style={inp} defaultValue={0} /></div>
            <div><label style={lbl}>Annual Interest Rate (%)</label><input name="rate" type="number" step="0.1" required placeholder="e.g. 14" style={inp} defaultValue={14} /></div>
            <div><label style={lbl}>Loan Term (Years)</label><input name="years" type="number" required placeholder="e.g. 20" style={inp} defaultValue={20} /></div>
            <button type="submit" disabled={loading} style={{
              background: "#33a137", color: "#fff", border: "none", borderRadius: 3,
              padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{loading ? "Calculating…" : "Calculate Monthly Payment"}</button>
          </form>

          {result && (
            <div style={{
              marginTop: 20, padding: 20, background: "#f0faf4",
              border: "1px solid #c3e6cb", borderRadius: 3, textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Estimated Monthly Payment</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#33a137" }}>{fmt(result.monthlyPayment)}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
                Total Interest: <strong style={{ color: "#555" }}>{fmt(result.totalInterest)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
