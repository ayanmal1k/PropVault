"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Home, Menu, Settings, User } from "lucide-react";
import { useAuthStore } from "@/store/auth";
const topNav = [
  { label: "Properties", href: "/search" },
  { label: "Property Blocks", href: "/projects" },
  { label: "Area Guides", href: "/area-guides" },
  { label: "Blog", href: "/blog" },
  { label: "Maps", href: "/search?map=1" },
];

const buyNav = [
  { label: "Homes", href: "/buy", active: true },
  { label: "Plots", href: "/plots" },
  { label: "Commercial", href: "/commercial" },
  { label: "Rent", href: "/rent" },
  { label: "Agents", href: "/agencies" },
  { label: "New Projects", href: "/projects" },
];

const toolsItems = [
  { text: "Plot Finder", href: "/plots" },
  { text: "Home Loan Calculator", href: "/tools/mortgage" },
  { text: "Area Unit Converter", href: "/tools/area-converter" },
  { text: "Construction Cost Calculator", href: "/tools/roi" },
];

const moreItems = [
  { text: "Forum", href: "/blog" },
  { text: "Trends", href: "/search?sort=featured" },
  { text: "Saved Properties", href: "/saved" },
];

function Dropdown({ label, items }: { label: string; items: { text: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 text-white hover:underline"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm">{label}</span>
        <ChevronDown size={12} />
      </button>
      {open ? (
        <div className="absolute mt-2 right-0 bg-white shadow-md rounded text-sm z-50">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
              {item.text}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ZameenHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const { user } = useAuthStore();
  const userIconHref = user ? "/dashboard" : "/auth/login";

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top green bar */}
      <div style={{ backgroundColor: "#33a137" }} className="text-white w-full">
        <div className="w-full flex items-center justify-between px-4 md:px-6 py-2">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Home size={16} strokeWidth={2.6} />
            </Link>

            {topNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-white hover:underline flex items-center gap-2 tracking-wide"
                style={{ letterSpacing: '0.4px' }}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            <Dropdown label="Tools" items={toolsItems} />
            <Dropdown label="More" items={moreItems} />
          </div>

          <div className="flex items-center gap-3">
            <button className="text-white p-1"><Settings size={18} /></button>
            <Link href={userIconHref} className="text-white p-1" aria-label={user ? "Open account" : "Sign in"}>
              <User size={18} />
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1"><Menu size={18} /></button>
          </div>
        </div>
      </div>

      {/* White subnav with logo and category links */}
      <div className="bg-white border-b">
        <div className="w-full flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-md overflow-hidden shadow-sm">
                <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="40" height="28" rx="6" fill="#33a137" />
                  <path d="M7 17.5L14.5 10H18.5L12 16.5H16.8L20.2 13.1V10H24.5V18H20.6V14.8L17.8 17.6H12.7L11 19.3H7V17.5Z" fill="white" />
                  <circle cx="28.8" cy="11.3" r="2.2" fill="white" />
                  <path d="M26.9 16.8V13.2H31V16.8C31 18.1 30 19 28.9 19C27.8 19 26.9 18.1 26.9 16.8Z" fill="white" />
                </svg>
              </div>
              <div className="text-sm">
                  <strong className="text-gray-800">PropVault</strong>
                  <div className="text-xs text-gray-500">Enterprise Real Estate Marketplace</div>
                </div>
            </Link>

            <nav className="flex items-center">
              <div className="flex items-center pr-4">
                <button
                  type="button"
                  onClick={() => setBuyOpen((s) => !s)}
                  className="flex items-center gap-1 text-sm uppercase font-normal text-gray-600"
                  aria-expanded={buyOpen}
                  aria-controls="buy-inline-links"
                >
                  <span>Buy</span>
                  <ChevronRight size={12} className={buyOpen ? "rotate-90 transition-transform" : "transition-transform"} />
                </button>
              </div>

              <div
                className={
                  "flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-out " +
                  (buyOpen ? "max-w-[340px] opacity-100 translate-x-0 ml-0" : "max-w-0 opacity-0 -translate-x-1 ml-0")
                }
                aria-hidden={!buyOpen}
                id="buy-inline-links"
              >
                {buyNav.slice(0, 3).map((item) => (
                  <div key={item.href} className="flex items-center pl-6">
                    <span style={{ width: 1, height: 18, background: '#e5e7eb', marginRight: 12 }} aria-hidden="true" />
                    <Link
                      href={item.href}
                      className={"text-sm uppercase font-normal " + (item.active ? "text-[#33a137]" : "text-gray-600")}
                    >
                      {item.label.toUpperCase()}
                    </Link>
                  </div>
                ))}
              </div>

              {buyNav.slice(3).map((item, idx) => (
                <div key={item.href} className={buyOpen ? 'flex items-center pl-6' : idx === 0 ? 'flex items-center pr-4' : 'flex items-center pl-6'}>
                  {(buyOpen || idx > 0) && (
                    <span style={{ width: 1, height: 18, background: '#e5e7eb', marginRight: 12 }} aria-hidden="true" />
                  )}
                  <Link
                    href={item.href}
                    className={"text-sm uppercase font-normal " + (item.active ? "text-[#33a137]" : "text-gray-600")}
                  >
                    {item.label.toUpperCase()}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* placeholder for right-side utilities if needed */}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {topNav.map((t) => (
              <Link key={t.href} href={t.href} className="block text-gray-700">
                {t.label}
              </Link>
            ))}
            <hr />
            {buyNav.map((b) => (
              <Link key={b.href} href={b.href} className="block text-gray-700">
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
 
