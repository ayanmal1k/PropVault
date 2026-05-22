"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { MessageCircle } from "lucide-react";

export function InquiryForm({ propertyId, agentId }: { propertyId: string; agentId?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      await api("/leads/inquiry", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          agentId,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          body: form.get("message"),
          whatsapp: form.get("whatsapp") === "on",
        }),
      });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-premium p-6 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-brand-600" /> Send Inquiry
      </h3>
      <input name="name" required placeholder="Your name" className="input-field" />
      <input name="email" type="email" required placeholder="Email" className="input-field" />
      <input name="phone" placeholder="Phone" className="input-field" />
      <textarea name="message" required rows={4} placeholder="I'm interested in this property..." className="input-field" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="whatsapp" className="rounded" />
        Contact via WhatsApp
      </label>
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && <p className="text-sm text-emerald-600">Message sent successfully!</p>}
      {status === "error" && <p className="text-sm text-red-600">Failed to send. Is the API running?</p>}
    </form>
  );
}
