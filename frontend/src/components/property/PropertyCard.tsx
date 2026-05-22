import Image from "next/image";
import Link from "next/link";
import { Flame, ShieldCheck, Star, Heart, Share2, MapPin, Mail, Phone } from "lucide-react";

export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  price: number | string;
  purpose: string;
  category?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSize?: number | string | null;
  areaUnit?: string | null;
  verification?: string;
  city?: { name: string } | null;
  area?: { name: string } | null;
  images?: { url: string; isPrimary?: boolean }[];
  
  // Custom premium fields
  description?: string;
  createdAt?: string;
  agency?: { name: string; logo?: string };
  isHot?: boolean;
  isTitanium?: boolean;
}

function formatPrice(n: number | string) {
  const v = Number(n);
  if (isNaN(v)) return String(n);
  
  // Convert standard Lakh / Crore formatting
  if (v >= 10000000) {
    const cr = v / 10000000;
    return `PKR ${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Crore`;
  }
  if (v >= 100000) {
    const lakh = v / 100000;
    return `PKR ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  return `PKR ${v.toLocaleString()}`;
}

export function PropertyCardSkeleton() {
  return (
    <div className="z-prop-card-horizontal skeleton">
      <div className="z-prop-card-horizontal-img-wrap">
        <div className="z-skeleton z-skeleton-img" />
      </div>
      <div className="z-prop-card-horizontal-info">
        <div className="z-prop-horizontal-badges-row">
          <div className="z-prop-horizontal-badges-left">
            <div className="z-skeleton" style={{ width: 22, height: 22, borderRadius: "50%" }} />
            <div className="z-skeleton" style={{ width: 22, height: 22, borderRadius: "50%" }} />
          </div>
          <div className="z-skeleton" style={{ width: 85, height: 18 }} />
        </div>
        <div>
          <div className="z-skeleton z-skeleton-price" />
          <div className="z-skeleton z-skeleton-loc" />
          <div className="z-skeleton z-skeleton-title" />
          <div className="z-skeleton z-skeleton-desc" />
          <div className="z-skeleton z-skeleton-desc-short" />
        </div>
        <div className="z-prop-horizontal-footer">
          <div className="z-prop-horizontal-btns">
            <div className="z-skeleton z-skeleton-btn" style={{ width: 38 }} />
            <div className="z-skeleton z-skeleton-btn" style={{ width: 104 }} />
            <div className="z-skeleton z-skeleton-btn" style={{ width: 84 }} />
          </div>
          <div className="z-skeleton z-skeleton-logo" />
        </div>
      </div>
    </div>
  );
}

export function PropertyCard({
  property,
  className,
  variant = "default",
}: {
  property: PropertyCardData;
  className?: string;
  variant?: "default" | "zameen";
}) {
  const img =
    property.images?.find((i) => i.isPrimary)?.url ??
    property.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1600596542815-fdef06020168?w=600";

  const loc = [property.area?.name, property.city?.name].filter(Boolean).join(", ");
  const price = formatPrice(property.price);

  if (variant === "zameen") {
    const photosCount = property.images?.length && property.images.length > 0 ? property.images.length : 13;
    const isHot = property.isHot !== false; // defaults to true for visual flair
    const isTitanium = property.isTitanium !== false;
    
    const descSnippet = property.description
      ? property.description.slice(0, 130) + (property.description.length > 130 ? "..." : "")
      : `Looking to buy this property? Well, check out this excellent option. Located ideally in ${loc || "Pakistan"}, it offers a premium standard of living.`;

    const whatsappText = `Hi, I am interested in your property "${property.title}" listed for ${price} on PropVault. Please provide more details.`;
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(whatsappText)}`;
    const callUrl = `tel:+923001234567`;
    const emailUrl = `mailto:info@darwaishassociates.com?subject=Inquiry: ${encodeURIComponent(property.title)}`;

    return (
      <div className={`z-prop-card-horizontal ${className || ""}`}>
        {/* Left Side: Image panel */}
        <div className="z-prop-card-horizontal-img-wrap">
          <Link href={`/property/${property.slug}`} style={{ display: "block", width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={img}
              alt={property.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 320px"
              unoptimized
            />
          </Link>
          {isHot && <span className="z-badge-super-hot">SUPER HOT</span>}
          <span className="z-badge-photos">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            {photosCount}
          </span>
          <div className="z-badge-actions">
            <span className="z-badge-action-icon" title="View Location">
              <MapPin size={13} />
            </span>
            <span className="z-badge-action-icon" title="Share Property">
              <Share2 size={13} />
            </span>
            <span className="z-badge-action-icon" title="Save Favorite">
              <Heart size={13} />
            </span>
          </div>
        </div>

        {/* Right Side: Information panel */}
        <div className="z-prop-card-horizontal-info">
          {/* Row 1: Badges */}
          <div className="z-prop-horizontal-badges-row">
            <div className="z-prop-horizontal-badges-left">
              <span style={{ color: "#ef4444", display: "inline-flex", alignItems: "center", marginRight: 6 }} title="Hot Property">
                <Flame size={20} fill="#ef4444" />
              </span>
              <span style={{ color: "#16a34a", display: "inline-flex", alignItems: "center" }} title="Verified Listing">
                <ShieldCheck size={20} fill="#dcfce7" />
              </span>
            </div>
            {isTitanium && (
              <div className="z-prop-horizontal-badges-right">
                <span className="z-badge-titanium">
                  <Star size={11} fill="#eab308" stroke="#eab308" /> TITANIUM
                </span>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="z-prop-horizontal-price">{price}</div>
            <div className="z-prop-horizontal-location">
              {loc}
            </div>
            <div className="z-prop-horizontal-specs">
              <span className="z-spec-item" title="Area size">
                ↕ {property.areaSize ?? "5"} {property.areaUnit ?? "Marla"}
              </span>
              {property.bedrooms != null && (
                <span className="z-spec-item" title="Bedrooms">
                  🛏 {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms != null && (
                <span className="z-spec-item" title="Bathrooms">
                  🛁 {property.bathrooms} Baths
                </span>
              )}
            </div>

            <Link href={`/property/${property.slug}`} style={{ textDecoration: "none" }}>
              <h3 className="z-prop-horizontal-title">{property.title}</h3>
            </Link>
            <p className="z-prop-horizontal-desc">
              {descSnippet}
              <Link href={`/property/${property.slug}`} className="z-more-link">more</Link>
            </p>
          </div>

          {/* Row 8: Footer Buttons & Agency Logo */}
          <div className="z-prop-horizontal-footer">
            <div className="z-prop-horizontal-btns">
              <a href={emailUrl} className="z-btn z-btn-email" title="Email Agent">
                <Mail size={15} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="z-btn z-btn-whatsapp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4, display: "inline-block" }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a href={callUrl} className="z-btn z-btn-call">
                <Phone size={14} style={{ marginRight: 4 }} />
                CALL
              </a>
            </div>
            {/* Agency logo display */}
            <div className="z-prop-horizontal-agency" title={property.agency?.name ?? "Darwaish Associates"}>
              {property.agency?.logo ? (
                <Image
                  src={property.agency.logo}
                  alt={property.agency.name}
                  width={60}
                  height={45}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="z-agency-name-small">{property.agency?.name ? property.agency.name.split(" ")[0] : "Darwaish"}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to original vertical card (used on the Homepage)
  return (
    <Link
      href={`/property/${property.slug}`}
      className={`z-prop-card${className ? ` ${className}` : ""}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div style={{ position: "relative", height: 165, overflow: "hidden" }}>
        <Image
          src={img}
          alt={property.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 100vw, 280px"
          unoptimized
        />
        {property.verification === "VERIFIED" && (
          <span className="z-verified-badge">VERIFIED</span>
        )}
        <span style={{
          position: "absolute", bottom: 6, right: 6,
          background: "rgba(0,0,0,0.55)", color: "#fff",
          fontSize: 10, padding: "2px 6px", borderRadius: 2,
        }}>
          {property.purpose === "RENT" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div className="z-prop-price">{price}</div>
        <div className="z-prop-title">{property.title}</div>
        {loc && <div className="z-prop-location">{loc}</div>}
        <div className="z-prop-meta">
          {property.bedrooms != null && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms != null && <span>{property.bathrooms} Baths</span>}
          {property.areaSize != null && (
            <span>{property.areaSize} {property.areaUnit ?? "Marla"}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
