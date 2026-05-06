import { ReportsModels } from "./constants";
export const normalizeModelKey = (name?: string | null) => {
  if (!name) return '';
  const trimmed = name.trim();
  const normalized = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return normalized;
};

export const resolveModel = (reportName?: string | null) => {
  if (!reportName) return ReportsModels.Avance;
  const normalizedName = normalizeModelKey(reportName);

  const matchEntry = Object.entries(ReportsModels).find(([key]) => {
    const normalizedKey = normalizeModelKey(key);
    return normalizedKey === normalizedName;
  });

  return matchEntry?.[1] ?? ReportsModels.Avance;
};
