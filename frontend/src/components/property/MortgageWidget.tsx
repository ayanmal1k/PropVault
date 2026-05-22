"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { api } from "@/lib/api";

function fmt(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(2)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

const inputSt: React.CSSProperties = {
  width: "100%", border: "1px solid #ccc", borderRadius: 3,
  padding: "7px 10px", fontSize: 13, outline: "none",
};
const labelSt: React.CSSProperties = { fontSize: 11, color: "#888", display: "block", marginBottom: 4 };

export function MortgageWidget({ price }: { price: number }) {
  const [down, setDown] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(14);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState<{ monthlyPayment: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    try {
      const data = await api<{ monthlyPayment: number }>("/calculators/mortgage", {
        method: "POST",
        body: JSON.stringify({ principal: price, downPayment: down, annualRate: rate, years }),
      });
      setResult(data);
    } catch {
      /* fallback: client-side calculation */
      const p = price - down;
      const r = rate / 100 / 12;
      const n = years * 12;
      const monthly = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setResult({ monthlyPayment: monthly });
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, borderBottom: "2px solid #33a137", paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <Home size={16} color="#33a137" /> Home Loan Calculator
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={labelSt}>Property Price</label>
          <div style={{ ...inputSt, background: "#f5f5f5", color: "#888" }}>{fmt(price)}</div>
        </div>
        <div>
          <label style={labelSt}>Down Payment (PKR)</label>
          <input type="number" style={inputSt} value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>
        <div>
          <label style={labelSt}>Interest Rate (%/year)</label>
          <input type="number" step="0.1" style={inputSt} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <div>
          <label style={labelSt}>Loan Term (years)</label>
          <input type="number" style={inputSt} value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </div>
        <button type="button" onClick={calculate} disabled={loading}
          style={{
            background: "#33a137", color: "#fff", border: "none", borderRadius: 3,
            padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
          {loading ? "Calculating…" : "Calculate Monthly Payment"}
        </button>
        {result && (
          <div style={{ textAlign: "center", padding: "10px 0", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 11, color: "#888" }}>Estimated Monthly Payment</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#33a137" }}>{fmt(result.monthlyPayment)}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              Loan: {fmt(price - down)} · Rate: {rate}% · {years} years
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
