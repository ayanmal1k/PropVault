"use client";

import Link from "next/link";

export function ZameenFooter() {
  function scrollTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <footer className="z-footer" style={{ paddingTop: 32, paddingBottom: 0 }}>
      {/* Our Home Partners */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 0" }}>
        <div className="z-container" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Our Home Partners</span>
          <div style={{
            border: "1px solid #ccc", borderRadius: 3, padding: "6px 16px",
            fontSize: 14, fontWeight: 700, color: "#33a137",
          }}>HBFC</div>
        </div>
      </div>

      {/* Main footer */}
      <div className="z-container" style={{ padding: "28px 16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>

          {/* Company */}
          <div>
            <div className="z-footer-title">Company</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, lineHeight: 2 }}>
              {[
                ["About us", "/about"],
                ["Contact us", "/contact"],
                ["Jobs", "/jobs"],
                ["Help & Support", "/help"],
                ["Advertise on PropVault", "/list-property"],
                ["Terms of Use", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="z-footer"
                    style={{ color: "#ccc", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="z-footer-title">Connect</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, lineHeight: 2 }}>
              {[
                ["Blog", "/blog"],
                ["News", "/blog"],
                ["Forum", "/blog"],
                ["Expo", "/"],
                ["Real Estate Agents", "/agencies"],
                ["Add Property", "/list-property"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href}
                    style={{ color: "#ccc", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <div className="z-footer-title">Head Office</div>
            <address style={{ fontStyle: "normal", fontSize: 13, color: "#ccc", lineHeight: 1.8 }}>
              Pearl One, 94-B/I, MM Alam Road,<br />
              Gulberg III, Lahore, Pakistan<br />
              <br />
              <a href="tel:0800726833" style={{ color: "#ccc", textDecoration: "none" }}>0800-PROPVAULT</a><br />
              Monday To Sunday 9AM To 6PM<br />
              <br />
              <a href="mailto:hello@propvault.pk" style={{ color: "#33a137", textDecoration: "none" }}>Email Us</a>
            </address>

            {/* Roshan Digital */}
            <div style={{
              marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid #555", borderRadius: 3, padding: "8px 14px",
            }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>roshan</span>
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ROSHAN <span style={{ color: "#33a137" }}>DIGITAL</span> ACCOUNT</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <Link href="https://www.facebook.com" target="_blank" rel="noopener"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#33a137", color: "#fff", fontSize: 12, padding: "6px 12px",
                  borderRadius: 3, textDecoration: "none",
                }}>
                Get Connected
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 28, paddingTop: 16, borderTop: "1px solid #444",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, color: "#888",
        }}>
          <span>© Copyright 2007 - 2026 PropVault.pk. All Rights Reserved</span>
          <button
            type="button"
            onClick={scrollTop}
            style={{
              background: "#33a137", color: "#fff", border: "none",
              fontSize: 11, fontWeight: 700, padding: "6px 14px",
              borderRadius: 3, cursor: "pointer", letterSpacing: 1,
            }}
          >
            TOP
          </button>
        </div>
      </div>
    </footer>
  );
}
