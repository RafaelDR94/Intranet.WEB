'use client';
import React from 'react';
import { classes } from './styles';
import { Spinner } from '@/app/components/Spinner/Spinner';
import { LoadingOverlayProps } from './types';


/**
 * Limita un valor entre 0 y 100 (usado para opacidad del backdrop).
 *
 * @param v Valor numérico de 0 a 100.
 * @returns Número clamp entre 0 y 100.
 */
const clampOpacity = (v: number) => Math.min(Math.max(v, 0), 100);

/**
 * Capa de **carga/bloqueo** para indicar procesos en curso.
 *
 * Muestra un fondo semitransparente con (opcional) desenfoque y un spinner centrado.
 * Soporta dos alcances:
 * - `scope="viewport"` → pantalla completa (wrapper `fixed inset-0`).
 * - `scope="container"` → cubre solo el contenedor padre (tu contenedor debe tener `position: relative`).
 *
 * @remarks
 * - El componente es **controlado** por la prop `open`. Si `open` es `false`, no renderiza nada.
 * - Si pasas `backdropOpacity`, se aplica de forma **dinámica**; si no, se respeta el look por defecto (60%).
 * - La opacidad se espera de `0` a `100` (no en 0–1).
 *
 * @accessibility
 * - El overlay usa `role="status"`, `aria-live="polite"` y `aria-busy="true"`.
 * - Personaliza `ariaLabel` para describir mejor la acción (p. ej. “Guardando cambios”).
 * - Es un overlay **no modal**: no atrapa el foco. Si necesitas **modal blocking** real, combina con un diálogo accesible.
 *
 * @example Pantalla completa (por defecto)
 * ```tsx
 * <LoadingOverlay open ariaLabel="Cargando datos" />
 * ```
 *
 * @example Solo contenedor
 * ```tsx
 * <div style={{ position: 'relative' }}>
 *   <Contenido />
 *   <LoadingOverlay open scope="container" message="Procesando…" />
 * </div>
 * ```
 *
 * @example Opacidad personalizada y sin blur
 * ```tsx
 * <LoadingOverlay open blur={false} backdropOpacity={30} spinnerSize="large" />
 * ```
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Espera un momento, tu información se está enviando',
  spinnerSize = 'medium',
  blur = true,
  backdropOpacity, // <- solo se aplica si viene definido, para no cambiar el look actual
  ariaLabel = 'Cargando',
  scope = 'viewport', // <- por defecto pantalla completa (o ajusta a 'container' si prefieres)
}) => {
  if (!open) return null;

  // Solo aplicamos opacidad dinámica si la prop viene definida (para no alterar el estilo actual)
  const bgStyle =
    typeof backdropOpacity === 'number'
      ? { backgroundColor: `rgba(75, 75, 75, ${clampOpacity(backdropOpacity) / 100})` }
      : undefined;

  const node = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
      className={classes.overlay({ blur, backdropOpacity: backdropOpacity ?? 60 })}
      data-testid="loading-overlay"
      style={bgStyle}
    >
      <div className={classes.box}>
        <Spinner size={spinnerSize} />
        <p className={classes.text}>{message}</p>
      </div>
    </div>
  );

  // Si quieres solo el contenedor: devuelve el overlay directo (absolute + inset-0).
  // Si quieres pantalla completa: lo envolvemos en un wrapper fixed + inset-0.
  return scope === 'container' ? node : (
    <div className="fixed inset-0 z-[60]">
      {node}
    </div>
  );
};

export default LoadingOverlay;
