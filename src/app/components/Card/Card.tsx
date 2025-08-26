import React from 'react';
import Image from 'next/image';
import { CardProps } from './types';
import { cardStyles } from './styles';

// Helper mínimo para componer clases
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

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
