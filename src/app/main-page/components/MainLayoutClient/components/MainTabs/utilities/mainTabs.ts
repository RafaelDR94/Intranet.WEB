export const basePath = (s: string) =>
  s.split("#")[0].split("?")[0].replace(/\/+$/, ""); // sin query ni hash, sin slash final

export const getQS = (s: string) => new URLSearchParams(s.split("?")[1] || "");