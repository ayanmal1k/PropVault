export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, suffix?: string): string {
  const s = slugify(base);
  return suffix ? `${s}-${suffix}` : s;
}
