const normalizeStatus = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Indicates whether Treasury evidence can be updated for the current status. */
export const isEvidenceEditable = (status?: string) =>
  normalizeStatus(status) !== "aprobada";
