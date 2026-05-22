"use client";

import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { accessToken, user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Link href="/auth/login" className="btn-secondary">
        <Heart className="h-4 w-4" /> Save
      </Link>
    );
  }

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        await api(`/favorites/${propertyId}`, { method: "DELETE", token: accessToken! });
        setSaved(false);
      } else {
        await api(`/favorites/${propertyId}`, { method: "POST", token: accessToken! });
        setSaved(true);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  return (
    <button type="button" onClick={toggle} disabled={loading} className="btn-secondary">
      <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
