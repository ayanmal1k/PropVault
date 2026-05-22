"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Building2, Moon, Sun, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/commercial", label: "Commercial" },
  { href: "/plots", label: "Plots" },
  { href: "/projects", label: "New Projects" },
  { href: "/agencies", label: "Agencies" },
  { href: "/area-guides", label: "Area Guides" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700 dark:text-brand-400">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Building2 className="h-5 w-5" />
          </span>
          PropVault
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
          </button>
          <Link href="/dashboard/favorites" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Heart className="h-5 w-5" />
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/dashboard" className="btn-secondary text-xs">
                <User className="h-4 w-4" />
                {user.firstName}
              </Link>
              <button type="button" onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary hidden text-xs sm:inline-flex">
              Sign In
            </Link>
          )}
          <Link href="/list-property" className="btn-primary text-xs">
            List Property
          </Link>
          <button type="button" className="rounded-xl p-2 lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t lg:hidden", open ? "block" : "hidden")}>
        <nav className="flex flex-col gap-1 p-4">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
