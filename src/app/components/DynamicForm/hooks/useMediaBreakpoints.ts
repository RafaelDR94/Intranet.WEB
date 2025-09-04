import { Breakpoints } from "../types";
import { useState,useEffect } from "react";
/**
 * Hook responsivo para resolver el breakpoint actual en función de `window.innerWidth`.
 *
 * @param bps Breakpoints en px. Por defecto `{ sm: 640, md: 1024 }`.
 * - `sm`: Máximo (inclusive) para rango pequeño.
 * - `md`: Máximo (inclusive) para rango mediano; valores mayores se consideran `lg`.
 *
 * @returns Objeto con:
 * - `width`: ancho actual de la ventana.
 * - `current`: `"sm" | "md" | "lg"`, según el rango resuelto.
 *
 * @remarks
 * - Usa `matchMedia` para escuchar cambios de rango y minimizar renders.
 * - En SSR devuelve como ancho inicial `md+1` para caer en `lg` por defecto.
 *
 * @example
 * ```ts
 * const { current } = useMediaBreakpoints({ sm: 640, md: 1024 })
 * if (current === 'sm') { /* layout compacto  }
 * ```
 */
export function useMediaBreakpoints(bps: Breakpoints = { sm: 640, md: 1024 }) {
  const { sm, md } = bps;
  const [width, setWidth] = useState<number>(() =>
    typeof window === "undefined" ? md + 1 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setWidth(window.innerWidth);

    // matchMedia para reducir re-render si cambia el rango
    const mqSm = window.matchMedia(`(max-width: ${sm}px)`);
    const mqMd = window.matchMedia(
      `(min-width: ${sm + 1}px) and (max-width: ${md}px)`
    );
    const mqLg = window.matchMedia(`(min-width: ${md + 1}px)`);

    const listener = () => onResize();

    mqSm.addEventListener?.("change", listener);
    mqMd.addEventListener?.("change", listener);
    mqLg.addEventListener?.("change", listener);
    window.addEventListener("resize", onResize);

    // init
    onResize();

    return () => {
      mqSm.removeEventListener?.("change", listener);
      mqMd.removeEventListener?.("change", listener);
      mqLg.removeEventListener?.("change", listener);
      window.removeEventListener("resize", onResize);
    };
  }, [sm, md]);

  const current: "sm" | "md" | "lg" = width <= sm ? "sm" : width <= md ? "md" : "lg";
  return { width, current };
}