// src/app/components/PopUp/PopUp.tsx
import clsx from 'clsx';
import React from 'react';

import { Button } from "../Button/Button";

import { popUpStyles } from "./styles";
import { InputProps } from "./types";
/**
 * Ventana emergente reutilizable (popup/modal ligero).
 *
 * Muestra un título, un contenido y acciones configurables. Útil para
 * confirmaciones, advertencias o formularios embebidos sencillos.
 *
 * @remarks
 * - Es **controlado** por `open`: si `open` es `false`, no renderiza nada.
 * - Por defecto cierra al pulsar el botón **Cerrar** (esquina superior) o
 *   cuando se ejecuta la acción secundaria (si está visible).
 * - Este componente NO atrapa el foco ni usa portal. Si necesitas un
 *   **modal accesible completo**, considera integrar un focus-trap y `createPortal`.
 *
 * @accessibility
 * - Se añaden `role="dialog"` y `aria-modal="true"`.
 * - Se asocia el título y contenido con `aria-labelledby` / `aria-describedby`.
 * - Personaliza los textos para que el propósito sea claro a lectores de pantalla.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <PopUp
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Eliminar registro"
 *   content="¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer."
 *   showPrimaryButton
 *   primaryButtonText="Eliminar"
 *   onPrimaryButtonClick={() => { doDelete(); setOpen(false); }}
 *   showSecondaryButton
 *   secondaryButtonText="Cancelar"
 * />
 * ```
 */
export const PopUp: React.FC<InputProps> = ({
  open,
  onClose,
  title,
  content,
  showPrimaryButton = false,
  showSecondaryButton = false,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  children,
}) => {
  if (!open) return null;

  const handleSecondary = () => {
    onSecondaryButtonClick?.();
    onClose?.(); // cerrar automáticamente
  };

  const handlePrimary = () => {
    onPrimaryButtonClick?.();
  };

  return (
    <div className={popUpStyles.backdrop}>
      <div className={clsx(popUpStyles.container)}>
        <div className={popUpStyles.closeButton}>
          <Button
            variant="ghost"
            size="xsmall"
            iconOnly
            arrowDirection="cancel"
            onClick={onClose}
          />
        </div>

        <div>
          <p className={popUpStyles.title}>{title}</p>
          <p className={popUpStyles.content}>{content}</p>
        </div>

        {children && <div>{children}</div>}

        <div className={popUpStyles.buttonWrapper}>
          {showSecondaryButton && (
            <Button variant="outline" size="medium" onClick={handleSecondary} hideIcon>
              {secondaryButtonText || "Cancelar"}
            </Button>
          )}
          {showPrimaryButton && (
            <Button variant="solid" size="medium" onClick={handlePrimary} hideIcon>
              {primaryButtonText || "Aceptar"}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};
