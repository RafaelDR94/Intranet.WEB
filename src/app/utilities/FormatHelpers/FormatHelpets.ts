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
