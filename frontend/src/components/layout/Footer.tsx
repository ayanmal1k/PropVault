import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="h-6 w-6 text-brand-400" />
              <span className="font-display text-xl font-bold">PropVault</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Pakistan&apos;s premium real estate marketplace. Find homes, plots, and commercial properties with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/buy" className="hover:text-brand-400">Buy Properties</Link></li>
              <li><Link href="/rent" className="hover:text-brand-400">Rent Properties</Link></li>
              <li><Link href="/projects" className="hover:text-brand-400">New Projects</Link></li>
              <li><Link href="/area-guides" className="hover:text-brand-400">Area Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Tools</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/tools/mortgage" className="hover:text-brand-400">Mortgage Calculator</Link></li>
              <li><Link href="/tools/roi" className="hover:text-brand-400">ROI Calculator</Link></li>
              <li><Link href="/tools/area-converter" className="hover:text-brand-400">Area Converter</Link></li>
              <li><Link href="/compare" className="hover:text-brand-400">Compare Properties</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-brand-400">About</Link></li>
              <li><Link href="/blog" className="hover:text-brand-400">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400">Contact</Link></li>
              <li><Link href="/auth/login" className="hover:text-brand-400">Agent Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PropVault. All rights reserved. Original design — not affiliated with any third-party portal.
        </div>
      </div>
    </footer>
  );
}
