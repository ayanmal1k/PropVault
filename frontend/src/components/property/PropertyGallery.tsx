"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: { url: string; isPrimary?: boolean }[];
  videos?: { url: string; title?: string }[];
  virtualTourUrl?: string | null;
  videoUrl?: string | null;   /* legacy single video */
}

type MediaItem =
  | { kind: "image"; url: string }
  | { kind: "video"; url: string; isYoutube: boolean; embedUrl: string };

function toEmbed(url: string): string {
  /* YouTube */
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  /* Vimeo */
  const vim = url.match(/vimeo\.com\/(\d+)/);
  if (vim) return `https://player.vimeo.com/video/${vim[1]}?autoplay=1`;
  return url; /* direct mp4 / other */
}

function isYoutubeOrVimeo(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

export function PropertyGallery({ images, videos = [], virtualTourUrl, videoUrl }: Props) {
  /* Build unified media list: images first, then videos */
  const allVideos = [...videos];
  if (videoUrl && !allVideos.find((v) => v.url === videoUrl)) allVideos.push({ url: videoUrl });

  const mediaList: MediaItem[] = [
    ...images.map((img): MediaItem => ({ kind: "image", url: img.url })),
    ...allVideos.map((v): MediaItem => ({
      kind: "video",
      url: v.url,
      isYoutube: isYoutubeOrVimeo(v.url),
      embedUrl: toEmbed(v.url),
    })),
  ];

  if (mediaList.length === 0)
    mediaList.push({ kind: "image", url: "https://images.unsplash.com/photo-1600596542815?w=1200" });

  const [index, setIndex] = useState(0);
  const current = mediaList[index];

  function prev() { setIndex((i) => (i - 1 + mediaList.length) % mediaList.length); }
  function next() { setIndex((i) => (i + 1) % mediaList.length); }

  return (
    <div>
      {/* Main viewer */}
      <div style={{ position: "relative", background: "#000", borderRadius: 3, overflow: "hidden" }}>
        {/* Aspect box 16:9 */}
        <div style={{ paddingTop: "56.25%", position: "relative" }}>
          {current.kind === "image" ? (
            <Image
              src={current.url}
              alt="Property"
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="100vw"
              unoptimized
            />
          ) : current.isYoutube ? (
            <iframe
              key={current.embedUrl}
              src={current.embedUrl}
              title="Property Video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <video
              key={current.url}
              src={current.url}
              controls
              autoPlay
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
            />
          )}

          {/* Arrows */}
          {mediaList.length > 1 && (
            <>
              <button type="button" onClick={prev}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.45)", border: "none", color: "#fff",
                  borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
              </button>
              <button type="button" onClick={next}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.45)", border: "none", color: "#fff",
                  borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </button>
            </>
          )}

          {/* Counter + badges */}
          <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 6 }}>
            <span style={{
              background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11,
              padding: "3px 8px", borderRadius: 3,
            }}>
              {index + 1} / {mediaList.length}
            </span>
            {current.kind === "video" && (
              <span style={{
                background: "#33a137", color: "#fff", fontSize: 11,
                padding: "3px 8px", borderRadius: 3, fontWeight: 700,
              }}>▶ VIDEO</span>
            )}
          </div>

          {/* 360 tour badge */}
          {virtualTourUrl && (
            <a
              href={virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute", bottom: 10, right: 12,
                background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11,
                padding: "3px 10px", borderRadius: 3, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              ⬡ 360° Tour
            </a>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {mediaList.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto", paddingBottom: 4 }}>
          {mediaList.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              style={{
                position: "relative", width: 90, height: 60, flexShrink: 0,
                border: `2px solid ${i === index ? "#33a137" : "transparent"}`,
                borderRadius: 3, overflow: "hidden", cursor: "pointer", padding: 0,
                background: "#000",
              }}
            >
              {item.kind === "image" ? (
                <Image src={item.url} alt="" fill style={{ objectFit: "cover" }} sizes="90px" unoptimized />
              ) : (
                <div style={{
                  position: "absolute", inset: 0, background: "#111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 22, color: "#fff" }}>▶</span>
                </div>
              )}
              {item.kind === "video" && (
                <span style={{
                  position: "absolute", bottom: 3, right: 3,
                  background: "#33a137", color: "#fff", fontSize: 9,
                  padding: "1px 5px", borderRadius: 2, fontWeight: 700,
                }}>VIDEO</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
