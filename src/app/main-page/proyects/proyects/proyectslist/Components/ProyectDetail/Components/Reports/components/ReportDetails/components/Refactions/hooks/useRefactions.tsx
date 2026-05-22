import { useEffect, useMemo, useRef, useState } from "react";

import { Row } from "../types";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";

const FALLBACK_TEXT = "—";

const normalizeText = (value: unknown) => String(value ?? "").trim();

const buildCompactRefactionDescription = (refaction: {
  description?: unknown;
  brand?: unknown;
  model?: unknown;
  serialnumber?: unknown;
  partnumber?: unknown;
}) => {
  const description = normalizeText(refaction.description);
  const brand = normalizeText(refaction.brand);
  const model = normalizeText(refaction.model);
  const serialnumber = normalizeText(refaction.serialnumber);
  const partnumber = normalizeText(refaction.partnumber);

  const summary = [
    description,
    [brand, model].filter(Boolean).join(" "),
    serialnumber ? `Serie: ${serialnumber}` : "",
    partnumber ? `Parte: ${partnumber}` : "",
  ].filter(Boolean);

  return summary.join(" · ") || FALLBACK_TEXT;
};

const useRefactions = () => {
  const { currentReport } = useReportsStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const width = el.clientWidth;
      setCompact(width < 900);
    };

    compute();
    const resizeObserver = new ResizeObserver(compute);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  const rows: Row[] = useMemo(() => {
    const list = currentReport?.refactions ?? [];

    return list.map((refaction, idx) => ({
      id: String(idx + 1),
      index: idx + 1,
      description: normalizeText(refaction?.description) || FALLBACK_TEXT,
      compactDescription: buildCompactRefactionDescription(refaction),
      brand: normalizeText(refaction?.brand) || FALLBACK_TEXT,
      model: normalizeText(refaction?.model) || FALLBACK_TEXT,
      serialnumber: normalizeText(refaction?.serialnumber) || FALLBACK_TEXT,
      partnumber: normalizeText(refaction?.partnumber) || FALLBACK_TEXT,
    }));
  }, [currentReport]);

  return { rows, compact, containerRef };
};

export default useRefactions;
