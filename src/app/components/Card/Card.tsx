import React, { useMemo } from 'react';

import ActionMenuCell from '../ActionMenuCell/ActionMenuCell';
import { Button } from '../Button/Button';

import { useRecoverableImage } from './hooks/useRecoverableImage';
import { cardStyles } from './styles';
import type { CardProps } from './types';

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { UseShowImage } from '@/app/context/PrincipalContext/hooks/useShowImage/useShowImage';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

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
  secondaryVariant = 'outline',
  actionMenuProps,
  enableImagePreview = true,
  enableRemoteImageRecovery = true,
}: CardProps<TRow>) {
  const isVertical = orientation === 'vertical';
  const {
    currentSrc,
    hasPlaceholder,
    isLoading,
    handleImageError,
    handleImageLoaded,
  } = useRecoverableImage({
    imageSrc,
    fallbackSrc,
    enableRemoteImageRecovery,
  });

  const principalImage = useOptionalPrincipalImage();

  const viewerSrc = useMemo(() => {
    const normalized = (currentSrc ?? '').trim();
    if (normalized.length > 0) return normalized;
    const fallback = (fallbackSrc ?? '').trim();
    return fallback;
  }, [currentSrc, fallbackSrc]);

  const viewerAlt = title ?? 'card image';
  const canOpenImagePreview = enableImagePreview && Boolean(viewerSrc);

  const handleImageClick = () => {
    if (!canOpenImagePreview) return;
    principalImage?.showImage({
      src: viewerSrc,
      alt: viewerAlt,
    });
  };

  const handleImageKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!canOpenImagePreview) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      principalImage?.showImage({
        src: viewerSrc,
        alt: viewerAlt,
      });
    }
  };

  const enlargeImageLabel = title ? `Ampliar imagen de ${title}` : 'Ampliar imagen';

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
          canOpenImagePreview && 'cursor-zoom-in'
        )}
        role={canOpenImagePreview ? 'button' : undefined}
        tabIndex={canOpenImagePreview ? 0 : -1}
        aria-label={canOpenImagePreview ? enlargeImageLabel : undefined}
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
      >
        {hasPlaceholder ? (
          <div
            className={cx(
              cardStyles.Image,
              'flex h-full w-full items-center justify-center bg-neutral-900 text-xs text-neutral-400'
            )}
          >
            Imagen no disponible
          </div>
        ) : isLoading && !currentSrc ? (
          <div
            className={cx(
              cardStyles.Image,
              'flex h-full w-full animate-pulse items-center justify-center bg-neutral-900 text-xs text-neutral-500'
            )}
          >
            Cargando imagen...
          </div>
        ) : (
          <div className="relative h-full w-full">
            {isLoading && (
              <div
                className={cx(
                  cardStyles.Image,
                  'absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-neutral-900/90 text-xs text-neutral-500'
                )}
              >
                Cargando imagen...
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSrc}
              alt="card image"
              loading="lazy"
              decoding="async"
              className={cx(cardStyles.Image, 'h-full w-full object-cover', isLoading && 'opacity-0')}
              onLoad={handleImageLoaded}
              onError={() => {
                void handleImageError();
              }}
            />
          </div>
        )}
      </div>

      <div className={cardStyles.Body}>
        <div className='flex justify-between'>
          <div>
            <span className={cardStyles.Label}>{label}</span>
            <h4 className={cardStyles.Title}>{title}</h4>
            <p className={cardStyles.Description}>{description}</p>
          </div>
          {actionMenuProps ? <ActionMenuCell {...actionMenuProps} /> : null}
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
              variant={secondaryVariant}
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
