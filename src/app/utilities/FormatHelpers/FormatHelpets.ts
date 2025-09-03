export const parseMoney = (v?: string) => {
    if (!v) return 0;
    const clean = v.replace(/[^\d.-]/g, "");
    const n = Number(clean);
    return Number.isFinite(n) ? n : 0;
};
export const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    }).format(n);

export const computeBreakdown = (totalStr?: string, ivaRate = 0.16) => {
    const total = parseMoney(totalStr);
    if (!total) return { subtotal: 0, iva: 0, total: 0 };
    const subtotal = +(total / (1 + ivaRate)).toFixed(2);
    const iva = +(total - subtotal).toFixed(2);
    return { subtotal, iva, total };
};
export const toInputDateString=(date: string | Date): string =>{
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export const toInputDateTimeString = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
