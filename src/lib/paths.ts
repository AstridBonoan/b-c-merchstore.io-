/** Helpers for GitHub Pages basePath-aware URLs. */

export function getBasePath(): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base || base === "/") return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/** Prefix an app path with the configured basePath when needed. */
export function withBasePath(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === base || normalized.startsWith(`${base}/`)) return normalized;
  return `${base}${normalized}`;
}
