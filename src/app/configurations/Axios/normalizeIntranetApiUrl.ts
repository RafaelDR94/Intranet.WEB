/**
 * Normalizes Intranet API URLs so controller routes always include the global
 * `/api` prefix while avoiding `/api/api` when callers already provide it.
 *
 * @param url URL path or absolute URL sent to the Intranet API.
 * @returns URL with `/api` before the controller path.
 */
export const normalizeIntranetApiUrl = (url: string): string => {
  if (!url) return url;

  if (/^https?:\/\//i.test(url)) {
    const parsed = new URL(url);
    parsed.pathname = normalizePathname(parsed.pathname);
    return parsed.toString();
  }

  const separatorIndex = url.search(/[?#]/);
  const pathname = separatorIndex === -1 ? url : url.slice(0, separatorIndex);
  const suffix = separatorIndex === -1 ? "" : url.slice(separatorIndex);
  return `${normalizePathname(pathname)}${suffix}`;
};

const normalizePathname = (pathname: string): string => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalized === "/api" || normalized.startsWith("/api/")) {
    return normalized;
  }
  return `/api${normalized}`;
};
