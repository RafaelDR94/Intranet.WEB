// src/app/components/PopUp/PopUp.tsx
import React from 'react';
import { Button } from "../Button/Button";
import { popUpStyles } from "./styles";
import { InputProps } from "./types";
import clsx from 'clsx';
/**
 * Componente de ventana emergente reutilizable.
 *
 * Muestra un título, contenido y botones configurables. Puede usarse como modal
 * para confirmaciones, mensajes de advertencia o formularios embebidos.
 *
 * @param title Título del pop-up
 * @param content Mensaje o descripción a mostrar
 * @param showPrimaryButton Muestra el botón de acción principal si es `true`
 * @param showSecondaryButton Muestra el botón secundario si es `true`
 * @param primaryButtonText Texto para el botón principal (por defecto: "Aceptar")
 * @param secondaryButtonText Texto para el botón secundario (por defecto: "Cancelar")
 * @param onPrimaryButtonClick Función a ejecutar al hacer clic en el botón principal
 * @param onSecondaryButtonClick Función a ejecutar al hacer clic en el botón secundario
 * @param children Contenido adicional para renderizar dentro del pop-up
 * @param open Si el pop-up debe estar visible
 * @param onClose Función para cerrar el pop-up
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
          {showPrimaryButton && (
            <Button variant="solid" size="medium" onClick={handlePrimary}>
              {primaryButtonText || "Aceptar"}
            </Button>
          )}
          {showSecondaryButton && (
            <Button variant="outline" size="medium" onClick={handleSecondary}>
              {secondaryButtonText || "Cancelar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
