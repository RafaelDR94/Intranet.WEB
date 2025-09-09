import Image from 'next/image';
import React from 'react';

import { cardStyles } from './styles';
import { CardProps } from './types';

/**
 * Concatena clases condicionales de forma segura.
 *
 * @param classes Lista de clases (strings) u operaciones falsy.
 * @returns Cadena de clases sin valores falsy.
 *
 * @example
 * const className = cx('p-4', isActive && 'bg-blue-50')
 */
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

/**
 * Componente de tarjeta con imagen, etiqueta, título, descripción y acciones.
 *
 * @remarks
 * - Soporta orientación `vertical` u `horizontal`.
 * - El botón **Aceptar** siempre se muestra. El botón **Cancelar** es opcional.
 * - La imagen utiliza `next/image` con `fill` para cubrir el contenedor.
 *
 * @accessibility
 * - Asegura que `title` describa el contenido principal (se renderiza como `<h4>`).
 * - Proporciona `alt` descriptivo en la imagen (por defecto: "card image").
 * - Los botones son elementos nativos interactivos con `type="button"`.
 *
 * @example
 * ```tsx
 * <Card
 *   orientation="vertical"
 *   imageSrc="/images/example.jpg"
 *   label="Novedad"
 *   title="Título de la tarjeta"
 *   description="Descripción corta del contenido presentado en la tarjeta."
 *   onAccept={() => console.log('Aceptar')}
 *   onCancel={() => console.log('Cancelar')}
 *   showCancelButton
 * />
 * ```
 */
export const Card: React.FC<CardProps> = ({
  orientation = 'vertical',
  imageSrc,
  label,
  title,
  description,
  onAccept,
  onCancel,
  showCancelButton = false,
}) => {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cx(
        cardStyles.Container,
        isVertical ? cardStyles.ContainerVertical : cardStyles.ContainerHorizontal
      )}
    >
      <div
        className={cx(
          cardStyles.ImageWrapperBase,
          isVertical ? cardStyles.ImageWrapperVertical : cardStyles.ImageWrapperHorizontal
        )}
      >
        <Image
          src={imageSrc}
          alt="card image"
          layout="fill"
          objectFit="cover"
          className={cardStyles.Image}
        />
      </div>

      <div className={cardStyles.Body}>
        <span className={cardStyles.Label}>{label}</span>
        <h4 className={cardStyles.Title}>{title}</h4>
        <p className={cardStyles.Description}>{description}</p>

        <div
          className={cx(
            cardStyles.Actions,
            isVertical ? cardStyles.ActionsVertical : cardStyles.ActionsHorizontal
          )}
        >
          {showCancelButton && (
            <button
              type="button"
              onClick={onCancel}
              className={cardStyles.CancelBtn}
            >
              Cancelar
            </button>
          )}

          <button
            type="button"
            onClick={onAccept}
            className={cx(
              cardStyles.AcceptBtn,
              !showCancelButton && cardStyles.AcceptBtnFull
            )}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
