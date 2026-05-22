import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency = "PKR"): string {
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (currency === "PKR") {
    if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `PKR ${(n / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-PK", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export function formatArea(size: number, unit: string): string {
  return `${size} ${unit}`;
}
