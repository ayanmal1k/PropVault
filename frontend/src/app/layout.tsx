import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ZameenHeader } from "@/components/layout/ZameenHeader";
import { ZameenFooter } from "@/components/layout/ZameenFooter";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pakistan Property Real Estate - Sell Buy Rent Homes & Properties - PropVault",
    template: "%s | PropVault",
  },
  description: "Sell, Buy & Rent Homes and Properties in Pakistan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lato.className} style={{ margin: 0, padding: 0, background: "#f5f5f5" }}>
        <ZameenHeader />
        <main style={{ minHeight: "60vh" }}>{children}</main>
        <ZameenFooter />
      </body>
    </html>
  );
}
