import { useRef,useState,useEffect,useMemo } from "react";

import { Row } from "../types";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
const useRefactions = () => {
   const { currentReport } = useReportsStore();
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [compact, setCompact] = useState<boolean>(false);
 
   // Medición del ancho del contenedor para decidir columnas (no del viewport)
   useEffect(() => {
     const el = containerRef.current;
     if (!el) return;
     const compute = () => {
       // umbral empírico: si el contenedor es estrecho (< 900px) mostramos 2 columnas
       const w = el.clientWidth;
       setCompact(w < 900);
     };
     compute();
     const ro = new ResizeObserver(compute);
     ro.observe(el);
     return () => ro.disconnect();
   }, []);
 
   const rows: Row[] = useMemo(() => {
     const list = currentReport?.refactions ?? [];
     return list.map((r, idx) => ({
       id: String(idx + 1),
       index: idx + 1,
       description: r?.description ?? '—',
       brand: r?.brand ?? '—',
       model: r?.model ?? '—',
       serialnumber: r?.serialnumber ?? '—',
       partnumber: r?.partnumber ?? '—',
     }));
   }, [currentReport]);

   return { rows, compact, containerRef };
 
};

export default useRefactions;
