"use client";

export function PropertyMap({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <section>
      <h2 className="text-xl font-semibold">Location</h2>
      <p className="mt-2 text-sm text-slate-500">{address}</p>
      <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <iframe
          title="Property location"
          src={embedUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
