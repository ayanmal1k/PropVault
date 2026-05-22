"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calculator, ChartColumn, Home, MapPinned, Search, Building2, TrendingUp } from "lucide-react";
import type { PropertyCardData } from "@/components/property/PropertyCard";

/* ─── Explore grid ─── */
const exploreItems = [
  { title: "New\nProjects", desc: "The best investment opportunities", href: "/projects", icon: Building2, iconBg: "#fef8ea", iconColor: "#f0b23d" },
  { title: "Construction\nCost Calculator", desc: "Get construction cost estimate", href: "/tools/roi", icon: Calculator, iconBg: "#eef7ff", iconColor: "#79bdf5" },
  { title: "Home Loan\nCalculator", desc: "Find affordable loan packages", href: "/tools/mortgage", icon: Home, iconBg: "#eefaf1", iconColor: "#76bf89" },
  { title: "Area\nGuides", desc: "Explore housing societies in Pakistan", href: "/area-guides", icon: Search, iconBg: "#fff1f1", iconColor: "#f4a08f" },
  { title: "Plot\nFinder", desc: "Find plots in any housing society", href: "/plots", icon: MapPinned, iconBg: "#f3faf6", iconColor: "#79d7a1" },
  { title: "Property\nIndex", desc: "Track changes in real estate prices", href: "/search", icon: ChartColumn, iconBg: "#f1f4ff", iconColor: "#7589cf" },
  { title: "Area Unit\nConverter", desc: "Convert any area unit instantly", href: "/tools/area-converter", icon: ArrowUpRight, iconBg: "#e9f7f7", iconColor: "#79cfd1" },
  { title: "Property\nTrends", desc: "Find popular areas to buy property", href: "/search?sort=featured", icon: TrendingUp, iconBg: "#f7f1ff", iconColor: "#8e79cc" },
];

type BrowseTab = "popular" | "type" | "areaSize";

const browseSections = [
  {
    key: "homes",
    label: "Homes",
    icon: Home,
    accent: "#16a34a",
    defaultTab: "popular" as BrowseTab,
    tabs: ["popular", "type", "areaSize"] as BrowseTab[],
    panels: {
      popular: [
        { label: "5 Marla", sub: "Houses", query: { category: "RESIDENTIAL", q: "5 Marla" } },
        { label: "10 Marla", sub: "Houses", query: { category: "RESIDENTIAL", q: "10 Marla" } },
        { label: "3 Marla", sub: "Houses", query: { category: "RESIDENTIAL", q: "3 Marla" } },
        { label: "New", sub: "Houses", query: { category: "RESIDENTIAL", q: "New Houses" } },
        { label: "Low Price", sub: "All Homes", query: { category: "RESIDENTIAL", sort: "price_asc" } },
        { label: "Small", sub: "Houses", query: { category: "RESIDENTIAL", q: "Small Houses" } },
      ],
      type: [
        { label: "Houses", sub: "Homes", query: { category: "RESIDENTIAL", q: "Houses" } },
        { label: "Flats", sub: "Homes", query: { category: "RESIDENTIAL", q: "Flats" } },
        { label: "Portions", sub: "Homes", query: { category: "RESIDENTIAL", q: "Portions" } },
        { label: "Rooms", sub: "Homes", query: { category: "RESIDENTIAL", q: "Rooms" } },
        { label: "Upper Portion", sub: "Homes", query: { category: "RESIDENTIAL", q: "Upper Portion" } },
        { label: "Lower Portion", sub: "Homes", query: { category: "RESIDENTIAL", q: "Lower Portion" } },
      ],
      areaSize: [
        { label: "1 Marla", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "1", maxArea: "1" } },
        { label: "3 Marla", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "3", maxArea: "3" } },
        { label: "5 Marla", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "5", maxArea: "5" } },
        { label: "10 Marla", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "10", maxArea: "10" } },
        { label: "1 Kanal", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "20", maxArea: "20" } },
        { label: "2 Kanal", sub: "Homes", query: { category: "RESIDENTIAL", minArea: "40", maxArea: "40" } },
      ],
    },
  },
  {
    key: "plots",
    label: "Plots",
    icon: MapPinned,
    accent: "#16a34a",
    defaultTab: "popular" as BrowseTab,
    tabs: ["popular", "type", "areaSize"] as BrowseTab[],
    panels: {
      popular: [
        { label: "DHA Defence", sub: "Plots", query: { category: "PLOT", q: "DHA Defence" } },
        { label: "Bahria Town", sub: "Plots", query: { category: "PLOT", q: "Bahria Town" } },
        { label: "Gulberg", sub: "Plots", query: { category: "PLOT", q: "Gulberg" } },
        { label: "B-17", sub: "Plots", query: { category: "PLOT", q: "B-17" } },
        { label: "DHA City", sub: "Plots", query: { category: "PLOT", q: "DHA City" } },
        { label: "LDA Avenue", sub: "Plots", query: { category: "PLOT", q: "LDA Avenue" } },
      ],
      type: [
        { label: "Residential Plot", sub: "Plots", query: { category: "PLOT", q: "Residential Plot" } },
        { label: "Commercial Plot", sub: "Plots", query: { category: "PLOT", q: "Commercial Plot" } },
        { label: "Plot File", sub: "Plots", query: { category: "PLOT", q: "Plot File" } },
        { label: "Plot Form", sub: "Plots", query: { category: "PLOT", q: "Plot Form" } },
        { label: "Agricultural Land", sub: "Plots", query: { category: "PLOT", q: "Agricultural Land" } },
        { label: "Industrial Land", sub: "Plots", query: { category: "PLOT", q: "Industrial Land" } },
      ],
      areaSize: [
        { label: "5 Marla", sub: "Plots", query: { category: "PLOT", minArea: "5", maxArea: "5" } },
        { label: "10 Marla", sub: "Plots", query: { category: "PLOT", minArea: "10", maxArea: "10" } },
        { label: "1 Kanal", sub: "Plots", query: { category: "PLOT", minArea: "20", maxArea: "20" } },
        { label: "2 Kanal", sub: "Plots", query: { category: "PLOT", minArea: "40", maxArea: "40" } },
        { label: "4 Kanal", sub: "Plots", query: { category: "PLOT", minArea: "80", maxArea: "80" } },
        { label: "8 Kanal", sub: "Plots", query: { category: "PLOT", minArea: "160", maxArea: "160" } },
      ],
    },
  },
  {
    key: "commercial",
    label: "Commercial",
    icon: Building2,
    accent: "#16a34a",
    defaultTab: "popular" as BrowseTab,
    tabs: ["popular", "type", "areaSize"] as BrowseTab[],
    panels: {
      popular: [
        { label: "Offices", sub: "Commercial", query: { category: "COMMERCIAL", q: "Offices" } },
        { label: "Shops", sub: "Commercial", query: { category: "COMMERCIAL", q: "Shops" } },
        { label: "Buildings", sub: "Commercial", query: { category: "COMMERCIAL", q: "Buildings" } },
        { label: "Warehouse", sub: "Commercial", query: { category: "COMMERCIAL", q: "Warehouse" } },
        { label: "Factory", sub: "Commercial", query: { category: "COMMERCIAL", q: "Factory" } },
        { label: "Plaza", sub: "Commercial", query: { category: "COMMERCIAL", q: "Plaza" } },
      ],
      type: [
        { label: "Office", sub: "Commercial", query: { category: "COMMERCIAL", q: "Office" } },
        { label: "Shop", sub: "Commercial", query: { category: "COMMERCIAL", q: "Shop" } },
        { label: "Building", sub: "Commercial", query: { category: "COMMERCIAL", q: "Building" } },
        { label: "Warehouse", sub: "Commercial", query: { category: "COMMERCIAL", q: "Warehouse" } },
        { label: "Factory", sub: "Commercial", query: { category: "COMMERCIAL", q: "Factory" } },
        { label: "Land", sub: "Commercial", query: { category: "COMMERCIAL", q: "Land" } },
      ],
      areaSize: [
        { label: "Less than 100 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "0", maxArea: "100" } },
        { label: "100-200 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "100", maxArea: "200" } },
        { label: "200-300 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "200", maxArea: "300" } },
        { label: "300-400 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "300", maxArea: "400" } },
        { label: "400-500 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "400", maxArea: "500" } },
        { label: "More than 500 sq ft", sub: "Commercial", query: { category: "COMMERCIAL", minArea: "500", maxArea: "2000" } },
      ],
    },
  },
];

/* ─── Popular Locations — exact live data ─── */
const popularLocations = {
  plots: {
    Lahore: [
      ["DHA Defence",    11337], ["Raiwind Road",   3060], ["Bahria Orchard", 2029],
      ["Park View City", 1982],  ["Bahria Town",    1719], ["LDA Road",       1599],
      ["LDA Avenue",     945],   ["DHA 11 Rahbar",  869],
    ],
    Karachi: [
      ["Scheme 33",          3180], ["DHA Defence",         1895], ["Gadap Town",    1484],
      ["DHA City Karachi",   1263], ["Bahria Town Karachi", 1135], ["Naya Nazimabad", 842],
      ["Cantt",               316], ["Malir",                259],
    ],
    Islamabad: [
      ["DHA Defence",         6566], ["Gulberg",         3022], ["B-17",               2004],
      ["Bahria Town",         1813], ["Faisal Hills",    1531], ["Top City 1",         1293],
      ["Faisal Town - F-18",   840], ["D-12",             737],
    ],
  },
  flats: {
    Lahore: [
      ["Askari",              1037], ["Bahria Town",   730], ["Gulberg",           424],
      ["Raiwind Road",         390], ["DHA Defence",   289], ["Bahria Orchard",     95],
      ["Main Canal Bank Road",  89], ["Johar Town",     63],
    ],
    Karachi: [
      ["DHA Defence",         2599], ["Gulshan-e-Iqbal Town", 1373], ["Gulistan-e-Jauhar", 1172],
      ["Scheme 33",           1159], ["Cantt",                 944], ["Clifton",             669],
      ["North Nazimabad",      595], ["Bahria Town Karachi",   347],
    ],
    Islamabad: [
      ["DHA Defence", 770], ["B-17",        312], ["E-11",        296],
      ["Bahria Town", 269], ["Gulberg",     268], ["G-15",        251],
      ["G-11",        213], ["F-11",        187],
    ],
  },
  houses: {
    Lahore: [
      ["DHA Defence",   7331], ["Bahria Town",   1647], ["Raiwind Road",   1160],
      ["Park View City", 918], ["Johar Town",     672], ["Bahria Orchard",  602],
      ["GT Road",        565], ["DHA 11 Rahbar",  534],
    ],
    Karachi: [
      ["DHA Defence",         2672], ["Scheme 33",          1518], ["Bahria Town Karachi", 1271],
      ["Cantt",               1178], ["Gulshan-e-Iqbal Town", 967], ["Malir",               828],
      ["Gulistan-e-Jauhar",    805], ["Gadap Town",           691],
    ],
    Islamabad: [
      ["DHA Defence", 1442], ["B-17",       792], ["Bahria Town",  670],
      ["G-13",         627], ["Bani Gala",  482], ["D-12",         444],
      ["Top City 1",   381], ["FECHS",      315],
    ],
  },
};

/* ─── Popular Cities ─── */
const citiesBuyHouses = [
  ["Lahore",24244],["Karachi",12848],["Islamabad",10124],["Rawalpindi",4247],
  ["Multan",1796],["Gujranwala",1244],["Faisalabad",1030],["Peshawar",553],
  ["Sialkot",318],["Bahawalpur",133],["Sargodha",78],["Murree",55],
  ["Abbottabad",45],["Sahiwal",33],["Quetta",2],
];
const citiesBuyFlats = [
  ["Karachi",12776],["Islamabad",4178],["Lahore",3500],
  ["Rawalpindi",735],["Peshawar",307],["Hyderabad",106],["Faisalabad",13],
];
const citiesRentHouses = [
  ["Lahore",6998],["Islamabad",4335],["Karachi",2869],["Rawalpindi",1259],
  ["Multan",355],["Gujranwala",261],["Faisalabad",194],["Sialkot",192],
  ["Peshawar",70],["Bahawalpur",50],["Abbottabad",5],["Attock",0],["Quetta",0],
];
const citiesRentFlats = [
  ["Islamabad",3809],["Karachi",3800],["Lahore",2825],["Rawalpindi",995],["Peshawar",41],
];

/* ─── Rent popular locations ─── */
const rentLocations = {
  flats: {
    Lahore: [
      ["Askari",784],["Bahria Town",607],["DHA Defence",393],["Gulberg",277],
      ["Johar Town",83],["Raiwind Road",80],["Pak Arab Housing Society",55],["Main Canal Bank Road",37],
    ],
    Karachi: [
      ["DHA Defence",1246],["Clifton",458],["Gulshan-e-Iqbal Town",276],["Gulistan-e-Jauhar",207],
      ["Scheme 33",180],["Bahria Town Karachi",146],["North Nazimabad",136],["University Road",126],
    ],
    Islamabad: [
      ["E-11",557],["Gulberg",364],["DHA Defence",342],["F-10",283],
      ["G-15",259],["F-11",234],["Bahria Town",217],["Top City 1",175],
    ],
  },
  houses: {
    Lahore: [
      ["DHA Defence",2669],["Bahria Town",690],["Gulberg",380],["Askari",295],
      ["DHA 11 Rahbar",219],["Raiwind Road",218],["Johar Town",189],["Park View City",144],
    ],
    Karachi: [
      ["DHA Defence",1049],["Bahria Town Karachi",404],["Malir",205],["Jamshed Town",204],
      ["Cantt",120],["Scheme 33",119],["Gulshan-e-Iqbal Town",112],["Clifton",105],
    ],
    Islamabad: [
      ["DHA Defence",460],["F-7",441],["F-8",364],["D-12",320],
      ["F-6",291],["F-10",272],["Bahria Town",247],["G-13",203],
    ],
  },
};

/* ─── Helpers ─── */
type LocTab = "plots" | "flats" | "houses";
type SaleRentTab = "sale" | "rent";
type RentLocTab = "flats" | "houses";

function SectionHead({ title, viewAll }: { title: string; viewAll?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{title}</span>
      {viewAll && (
        <Link href={viewAll} style={{ marginLeft: 10, fontSize: 12, color: "#33a137", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
          View all
        </Link>
      )}
    </div>
  );
}

function PropCard({ p }: { p: PropertyCardData }) {
  const img = p.images?.[0]?.url ?? "https://images.unsplash.com/photo-1600596542815?w=600";
  const loc = [p.area?.name, p.city?.name].filter(Boolean).join(", ");
  const price = (() => {
    const n = Number(p.price);
    if (n >= 10000000) return `PKR ${(n/10000000).toFixed(2)} Cr`;
    if (n >= 100000)   return `PKR ${(n/100000).toFixed(2)} Lac`;
    return `PKR ${n.toLocaleString()}`;
  })();

  return (
    <Link href={`/property/${p.slug}`} className="z-prop-card" style={{ display: "block", textDecoration: "none" }}>
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <Image src={img} alt={p.title} fill style={{ objectFit: "cover" }} sizes="280px" unoptimized />
        {p.verification === "VERIFIED" && <span className="z-verified-badge">VERIFIED</span>}
        <span style={{
          position: "absolute", bottom: 6, right: 6,
          background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 2,
        }}>
          {p.purpose === "RENT" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div className="z-prop-price">{price}</div>
        <div className="z-prop-title">{p.title}</div>
        {loc && <div className="z-prop-location">{loc}</div>}
        <div className="z-prop-meta">
          {p.bedrooms  != null && <span>{p.bedrooms} Beds</span>}
          {p.bathrooms != null && <span>{p.bathrooms} Baths</span>}
          {p.areaSize  != null && <span>{p.areaSize} {p.areaUnit ?? "Marla"}</span>}
        </div>
      </div>
    </Link>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`z-loc-tab${active ? " active" : ""}`}
      style={{ background: "none", border: "none", cursor: "pointer" }}>
      {children}
    </button>
  );
}

/* ─── Main ─── */
export function ZameenHome() {
  const router = useRouter();
  const [locTab,   setLocTab]         = useState<LocTab>("plots");
  const [saleRent, setSaleRent]       = useState<SaleRentTab>("sale");
  const [rentLoc,  setRentLoc]        = useState<RentLocTab>("flats");
  const agenciesRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const [browseTabs, setBrowseTabs] = useState<Record<string, BrowseTab>>(() =>
    Object.fromEntries(browseSections.map((section) => [section.key, section.defaultTab])) as Record<string, BrowseTab>
  );

  const agencies = [
    { name: "Aamiran Properties", city: "Lahore", logo: "https://placehold.co/96x96/2f7d4f/ffffff?text=AP" },
    { name: "Empire Estate", city: "Lahore", logo: "https://placehold.co/96x96/111111/f5e6a5?text=EE" },
    { name: "Hotline Associates", city: "Lahore", logo: "https://placehold.co/96x96/2443a8/ffffff?text=HA" },
    { name: "Badshah Group", city: "Lahore", logo: "https://placehold.co/96x96/000000/f2f2f2?text=BG" },
    { name: "Guardian Properties", city: "Lahore", logo: "https://placehold.co/96x96/f7f7f7/2f7d4f?text=GP" },
    { name: "Chawla Estate", city: "Lahore", logo: "https://placehold.co/96x96/f7f7f7/2563eb?text=CE" },
    { name: "Abn Marketing & Real Estate", city: "Lahore", logo: "https://placehold.co/96x96/111111/f7c948?text=ABN" },
    { name: "Capital Properties", city: "Lahore", logo: "https://placehold.co/96x96/f7f7f7/333333?text=CP" },
  ];

  const scrollAgencies = (direction: "left" | "right") => {
    const el = agenciesRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -420 : 420, behavior: "smooth" });
  };

  const scrollProjects = (direction: "left" | "right") => {
    const el = projectsRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -420 : 420, behavior: "smooth" });
  };

  const openBrowseResult = (query: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    params.set("purpose", "SALE");
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  };

  const projects = [
    {
      title: "Zameen Arx, Lahore",
      city: "Lahore, CBD Punjab (PCBDDA)",
      price: "PKR 2.88 Crore to 32.1 Crore",
      types: "Flats, Penthouse, Offices, Commercial",
      size: "270 sqft to 4376 sqft",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
    },
    {
      title: "Zameen Vault, Lahore",
      city: "Lahore, NSIT City",
      price: "PKR 2.3 Crore to 68.5 Crore",
      types: "Shops, Commercial, Offices, Buildings, Flats",
      size: "459 sqft to 15394 sqft",
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900",
    },
    {
      title: "Swiss Mall Gulberg, Lahore",
      city: "Lahore, MM Alam Road",
      price: "PKR 1.21 Crore to 31.78 Crore",
      types: "Flats, Shops",
      size: "125 sqft to 1633 sqft",
      img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900",
    },
    {
      title: "Zameen Jade, Lahore",
      city: "Lahore, Main Boulevard",
      price: "PKR 1.57 Crore to 12.4 Crore",
      types: "Flats, Penthouse, Offices",
      size: "411 sqft to 1400 sqft",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900",
    },
  ];

  /* current location data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locData: Record<string, [string, number][]> = (saleRent === "sale"
    ? popularLocations[locTab]
    : rentLocations[rentLoc as keyof typeof rentLocations]) as any;

  return (
    <div style={{ background: "#f5f5f5" }}>

      {/* ── Browse properties ── */}
      <div className="z-section">
        <div className="z-container">
          <div className="z-browse-head">Browse Properties</div>
          <div className="z-browse-grid">
            {browseSections.map((section) => {
              const activeTab = browseTabs[section.key] ?? section.defaultTab;
              const items = section.panels[activeTab];
              const Icon = section.icon;

              return (
                <div key={section.key} className="z-browse-card">
                  <div className="z-browse-card-top">
                    <div className="z-browse-title-row">
                      <span className="z-browse-icon" style={{ color: section.accent }}>
                        <Icon size={28} strokeWidth={2.3} />
                      </span>
                      <span className="z-browse-card-title">{section.label}</span>
                    </div>

                    <div className="z-browse-tabs">
                      {section.tabs.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          className={"z-browse-tab" + (activeTab === tab ? " active" : "")}
                          onClick={() => setBrowseTabs((prev) => ({ ...prev, [section.key]: tab }))}
                        >
                          {tab === "popular" ? "Popular" : tab === "type" ? "Type" : "Area Size"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="z-browse-body">
                    <div key={`${section.key}-${activeTab}`} className="z-browse-panel">
                      <div className="z-browse-grid-items">
                        {items.map((item) => (
                          <button
                            key={item.label + item.sub}
                            type="button"
                            className="z-browse-item"
                            onClick={() => openBrowseResult(item.query)}
                          >
                            <span className="z-browse-item-label">{item.label}</span>
                            <span className="z-browse-item-sub">{item.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Explore more ── */}
      <div className="z-section">
        <div className="z-container">
          <div className="z-section-head">Explore more on Propvault</div>
          <div className="z-explore-grid">
            {exploreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="z-explore-card"
                style={{ textDecoration: "none", ["--explore-color" as string]: item.iconColor } as any}
              >
                <div
                  className="z-explore-icon"
                  style={{ background: item.iconBg, color: item.iconColor, borderColor: item.iconColor }}
                >
                  <item.icon size={28} strokeWidth={2.1} />
                </div>
                <div>
                  <div className="z-explore-title">{item.title}</div>
                  <div className="z-explore-desc">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Titanium Agencies ── */}
      <div className="z-section">
        <div className="z-container">
          <SectionHead title="Titanium Agencies" />
          <div className="z-agency-shell">
            <button type="button" className="z-carousel-arrow z-carousel-arrow-left" onClick={() => scrollAgencies("left")} aria-label="Scroll agencies left">
              ‹
            </button>
            <div className="z-agency-strip" ref={agenciesRef}>
              {agencies.map((a) => (
                <Link key={a.name} href="/agencies" className="z-agency-card" style={{ textDecoration: "none" }}>
                  <div className="z-agency-logo-wrap">
                    <Image src={a.logo} alt={a.name} width={96} height={96} unoptimized className="z-agency-logo" />
                  </div>
                  <div className="z-agency-copy">
                    <div className="z-agency-name">{a.name}</div>
                    <div className="z-agency-city">{a.city}</div>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" className="z-carousel-arrow z-carousel-arrow-right" onClick={() => scrollAgencies("right")} aria-label="Scroll agencies right">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Zameen Projects ── */}
      <div className="z-section z-projects-section">
        <div className="z-container">
          <div className="z-project-head">
            <div className="z-project-head-left">
              <span className="z-project-title">Zameen Projects</span>
              <span className="z-project-chip">Trending</span>
            </div>
            <Link href="/projects" className="z-project-viewall">View All <span>›</span></Link>
          </div>
          <div className="z-project-shell">
            <button type="button" className="z-carousel-arrow z-carousel-arrow-left" onClick={() => scrollProjects("left")} aria-label="Scroll projects left">
              ‹
            </button>
            <div className="z-project-strip" ref={projectsRef}>
              {projects.map((proj) => (
                <Link key={proj.title} href="/projects" className="z-project-card" style={{ textDecoration: "none" }}>
                  <div className="z-project-image-wrap">
                    <Image src={proj.img} alt={proj.title} fill className="z-project-image" sizes="(max-width: 1200px) 100vw, 320px" unoptimized />
                    <span className="z-project-hot">HOT</span>
                  </div>
                  <div className="z-project-copy">
                    <div className="z-project-price">{proj.price}</div>
                    <div className="z-project-name">{proj.title}</div>
                    <div className="z-project-city">{proj.city}</div>
                    <div className="z-project-types">{proj.types}</div>
                    <div className="z-project-size">{proj.size}</div>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" className="z-carousel-arrow z-carousel-arrow-right" onClick={() => scrollProjects("right")} aria-label="Scroll projects right">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Popular Locations ── */}
      <div className="z-section">
        <div className="z-container">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Popular Locations</div>

          {/* Sale / Rent tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {([["sale","For Sale"],["rent","To Rent"]] as const).map(([v, label]) => (
              <button key={v} type="button" onClick={() => setSaleRent(v)}
                style={{
                  padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: "1px solid " + (saleRent === v ? "#33a137" : "#ccc"),
                  background: saleRent === v ? "#33a137" : "#fff",
                  color: saleRent === v ? "#fff" : "#555", borderRadius: 2,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Property type sub-tabs */}
          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e0e0e0", marginBottom: 20 }}>
            {saleRent === "sale" ? (
              (["plots","flats","houses"] as LocTab[]).map((t) => (
                <TabBtn key={t} active={locTab === t} onClick={() => setLocTab(t)}>
                  Most Popular Locations for {t.charAt(0).toUpperCase() + t.slice(1)}
                </TabBtn>
              ))
            ) : (
              (["flats","houses"] as RentLocTab[]).map((t) => (
                <TabBtn key={t} active={rentLoc === t} onClick={() => setRentLoc(t)}>
                  Most Popular Locations for {t.charAt(0).toUpperCase() + t.slice(1)}
                </TabBtn>
              ))
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {Object.entries(locData).map(([city, areas]) => (
              <div key={city}>
                <div className="z-loc-city-title">{city}</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {(areas as [string, number][]).map(([name, count]) => (
                    <li key={name}>
                      <Link href={`/search?q=${encodeURIComponent(name)}&city=${city.toLowerCase()}`} className="z-loc-link">
                        {saleRent === "rent"
                          ? `${rentLoc.charAt(0).toUpperCase() + rentLoc.slice(1)} to rent in ${name}`
                          : `${locTab.charAt(0).toUpperCase() + locTab.slice(1)} for sale in ${name}`}
                        {count > 0 && <span className="z-loc-count">({count.toLocaleString()})</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Popular Cities ── */}
      <div className="z-section">
        <div className="z-container">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
            Popular Cities to {saleRent === "rent" ? "Rent" : "Buy"} Properties
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Houses */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>Houses</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {(saleRent === "sale" ? citiesBuyHouses : citiesRentHouses).map(([city, count]) => (
                  <li key={city as string}>
                    <Link href={`/search?city=${(city as string).toLowerCase()}&purpose=${saleRent === "rent" ? "RENT" : "SALE"}`} className="z-loc-link">
                      Houses {saleRent === "rent" ? "to rent" : "for sale"} in {city}
                      {(count as number) > 0 && <span className="z-loc-count">({(count as number).toLocaleString()})</span>}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/search?purpose=${saleRent === "rent" ? "RENT" : "SALE"}`}
                    style={{ color: "#33a137", fontSize: 13, fontWeight: 700 }}>View all Cities</Link>
                </li>
              </ul>
            </div>

            {/* Flats */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>Flats and Apartments</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {(saleRent === "sale" ? citiesBuyFlats : citiesRentFlats).map(([city, count]) => (
                  <li key={city as string}>
                    <Link href={`/search?city=${(city as string).toLowerCase()}&purpose=${saleRent === "rent" ? "RENT" : "SALE"}&category=RESIDENTIAL`} className="z-loc-link">
                      Flats {saleRent === "rent" ? "to rent" : "for sale"} in {city}
                      {(count as number) > 0 && <span className="z-loc-count">({(count as number).toLocaleString()})</span>}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/search?purpose=${saleRent === "rent" ? "RENT" : "SALE"}&category=RESIDENTIAL`}
                    style={{ color: "#33a137", fontSize: 13, fontWeight: 700 }}>View all Cities</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
