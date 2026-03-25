﻿import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { cardStyles } from './styles';
import type { CardProps } from './types';
import { Button } from '../Button/Button';
import ActionMenuCell from '../ActionMenuCell/ActionMenuCell';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { UseShowImage } from '@/app/context/PrincipalContext/hooks/useShowImage/useShowImage';
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
 * Componente de tarjeta con imagen, etiqueta, t+itulo, descripción y acciones.
 *
 * @remarks
 * - Soporta n `vertical` u `horizontal`.
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
 *   title="Tó­tulo de la tarjeta"
 *   description="Descripción corta del contenido presentado en la tarjeta."
 *   onAccept={() => console.log('Aceptar')}
 *   onCancel={() => console.log('Cancelar')}
 *   showCancelButton
 * />
 * ```
 */
const useOptionalPrincipalImage = (): UseShowImage | undefined => {
  try {
    return usePrincipal().usePrincipalImage;
  } catch {
    return undefined;
  }
};

export function Card<TRow extends Record<string, unknown> = Record<string, unknown>>({
  orientation = 'vertical',
  imageSrc,
  fallbackSrc,
  label,
  title,
  description,
  onAccept,
  onCancel,
  showPrimaryButton = true,
  showSecondaryButton = false,
  primaryLabel = 'Aceptar',
  secondaryLabel = 'Cancelar',
  actionMenuProps,
}: CardProps<TRow>) {
  const isVertical = orientation === 'vertical';
  // Compute initial image: if empty, use fallback immediately
  const initialSrc = useMemo(() => {
    const main = (imageSrc ?? '').trim();
    return main.length > 0 ? main : (fallbackSrc ?? '')
  }, [imageSrc, fallbackSrc])
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc)

  const principalImage = useOptionalPrincipalImage();

  const viewerSrc = useMemo(() => {
    const normalized = (currentSrc ?? '').trim()
    if (normalized.length > 0) return normalized
    const fallback = (fallbackSrc ?? '').trim()
    return fallback
  }, [currentSrc, fallbackSrc])

  const viewerAlt = title ?? 'card image'

  const handleImageClick = () => {
    if (!viewerSrc) return
    principalImage?.showImage({
      src: viewerSrc,
      alt: viewerAlt,
    })
  }

  const handleImageKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!viewerSrc) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      principalImage?.showImage({
        src: viewerSrc,
        alt: viewerAlt,
      })
    }
  }

  useEffect(() => {
    setCurrentSrc(initialSrc)
  }, [initialSrc])

  const enlargeImageLabel = title ? `Ampliar imagen de ${title}` : 'Ampliar imagen'

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
          isVertical ? cardStyles.ImageWrapperVertical : cardStyles.ImageWrapperHorizontal,
          viewerSrc && 'cursor-zoom-in'
        )}
        role={viewerSrc ? 'button' : undefined}
        tabIndex={viewerSrc ? 0 : -1}
        aria-label={viewerSrc ? enlargeImageLabel : undefined}
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
      >
        <Image
          src={currentSrc}
          alt="card image"
          layout="fill"
          objectFit="cover"
          className={cardStyles.Image}
          onError={() => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc)
            }
          }}
        />
      </div>

      <div className={cardStyles.Body}>
        <div className='flex justify-between'>
          <div>
            <span className={cardStyles.Label}>{label}</span>
            <h4 className={cardStyles.Title}>{title}</h4>
            <p className={cardStyles.Description}>{description}</p>
          </div>
          {actionMenuProps ? (
            <ActionMenuCell {...actionMenuProps} />
          ) : null}

        </div>


        <div
          className={cx(
            cardStyles.Actions,
            isVertical ? cardStyles.ActionsVertical : cardStyles.ActionsHorizontal
          )}
        >
          {showSecondaryButton && (
            <Button
              size='small'
              variant='outline'
              onClick={onCancel}
              hideIcon
              className={cardStyles.CancelBtn}

            >
              {secondaryLabel}
            </Button>
          )}

          {showPrimaryButton && (
            <Button
              size='small'
              variant='solid'
              onClick={onAccept}
              hideIcon
              className={cx(
                cardStyles.AcceptBtn,
                !showSecondaryButton && cardStyles.AcceptBtnFull
              )}
            >
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

