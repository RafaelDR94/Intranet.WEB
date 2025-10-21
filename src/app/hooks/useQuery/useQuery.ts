'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';

type QueryValue = string | string[];
type QueryDict = Record<string, QueryValue>;

function urlSearchParamsToDict(sp: URLSearchParams): QueryDict {
  const out: QueryDict = {};
  // Acumula claves repetidas como arrays (p. ej. ?tag=a&tag=b)
  for (const [k, v] of sp.entries()) {
    if (k in out) {
      const prev = out[k];
      out[k] = Array.isArray(prev) ? [...prev, v] : [prev, v];
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Hook para leer y actualizar parámetros de la URL.
 * - `query`: parámetros del query string (?a=1&b=2)
 * - `route`: parámetros de ruta dinámica ([id], [...slug], etc.)
 * - `all`: mezcla de ambos (route + query). Si hay colisión de nombres, **gana `query`**.
 * - `json`, `jsonRoute`, `jsonAll`: versiones stringificadas (útiles para logs/depuración).
 * - `segments`: segmentos del pathname (útil si te interesa el orden, p. ej. /main-page/42/items)
 * - `updateQuery`: actualiza el query string preservando los existentes (borra con `null` | `''`)
 */
const useQuery = () => {
  const searchParams = useSearchParams();
  const params = useParams(); // dinámicos de la ruta
  const pathname = usePathname();
  const router = useRouter();

  // Objeto plano con TODO el query string (soporta claves repetidas -> array)
  const query = useMemo<QueryDict>(() => {
    const base = searchParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();
    return urlSearchParamsToDict(base);
  }, [searchParams]);

  // Parámetros dinámicos de la ruta (Next los expone como strings; catch-all puede ser string[])
  const route = useMemo<QueryDict>(() => {
    const out: QueryDict = {};
    Object.entries(params ?? {}).forEach(([k, v]) => {
      // `useParams` puede traer string | string[]
      out[k] = Array.isArray(v) ? [...v] : String(v ?? '');
    });
    return out;
  }, [params]);

  // Mezcla de route + query. Si colisionan, query sobreescribe.
  const all = useMemo<QueryDict>(() => ({ ...route, ...query }), [route, query]);

  // Segmentos crudos del pathname (p. ej. "/main-page/42/items" -> ["main-page","42","items"])
  const segments = useMemo<string[]>(
    () => (pathname || '').split('/').filter(Boolean),
    [pathname]
  );

  const updateQuery = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const base = searchParams
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === '') base.delete(k);
        else base.set(k, String(v));
      }

      const queryString = base.toString();
      const target = queryString.length ? `${pathname}?${queryString}` : pathname;
      router.replace(target, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return {
    // lectura
    pathname,
    segments,
    query,
    route,
    all,
    // stringificados por comodidad
    json: JSON.stringify(query),
    jsonRoute: JSON.stringify(route),
    jsonAll: JSON.stringify(all),
    // escritura
    updateQuery,
  };
};

export default useQuery;
