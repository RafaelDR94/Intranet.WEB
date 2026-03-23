'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { classes } from './styles';
import { ShowImageProps } from './types';

import { Button } from '@/app/components/Button/Button';
import CloseIcon from '@/assets/icons/acciones/cancel.svg';
import NavArrowLeft from '@/assets/icons/navegacion/nav-arrow-left.svg';
import NavArrowRight from '@/assets/icons/navegacion/nav-arrow-right.svg';

const ShowImage: React.FC<ShowImageProps> = ({
    open,
    src,
    alt = 'Imagen',
    items,
    initialIndex = 0,
    onClose,
    showAction = false,
    actionLabel = 'Acción',
    onAction,
    disableOutsideClose = false,
    ariaLabel = 'Visor de imagen',
    blur = true,
    backdropOpacity = 80,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const carouselItems = useMemo(() => {
        if (items && items.length > 0) return items;
        if (src) return [{ image: src, alt }];
        return [];
    }, [items, src, alt]);

    const hasCarousel = carouselItems.length > 1;

    const goPrev = useCallback(() => {
        if (!hasCarousel) return;
        setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    }, [hasCarousel, carouselItems.length]);

    const goNext = useCallback(() => {
        if (!hasCarousel) return;
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, [hasCarousel, carouselItems.length]);

    useEffect(() => {
        if (!open) return;
        const nextIndex = Math.min(
            Math.max(initialIndex ?? 0, 0),
            Math.max(carouselItems.length - 1, 0)
        );
        setActiveIndex(nextIndex);
    }, [open, initialIndex, carouselItems.length]);

    useEffect(() => {
        if (disableOutsideClose) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.();
            if (hasCarousel && e.key === 'ArrowLeft') goPrev();
            if (hasCarousel && e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, disableOutsideClose, hasCarousel, goPrev, goNext]);

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disableOutsideClose) return;
        // cierra sólo si el click fue en el backdrop (no en el modal)
        if (e.target === e.currentTarget) onClose?.();
    };

    if (!open) return null;

    // Cerrar con ESC
    const current = carouselItems[activeIndex];
    const currentSrc = current?.image ?? src;
    const currentAlt = current?.alt ?? alt;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={classes.overlay({ blur, backdropOpacity })}
            onClick={handleBackdrop}
        >
            <div ref={dialogRef} className={classes.card()}>
                {/* Botón cerrar */}
                <button
                    aria-label="Cerrar visor"
                    className={classes.closeBtn()}
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>

                {/* Imagen */}
                <div className={classes.imageWrap()}>
                    <div className={classes.imageStage()}>
                        {hasCarousel && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Anterior"
                                    className={classes.navLeft()}
                                    onClick={goPrev}
                                >
                                    <NavArrowLeft />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Siguiente"
                                    className={classes.navRight()}
                                    onClick={goNext}
                                >
                                    <NavArrowRight />
                                </button>
                            </>
                        )}

                        {currentSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={currentSrc} alt={currentAlt} className={classes.image()} />
                        ) : (
                            <div className="h-[45vh] w-[80vw] max-w-[520px] rounded-md bg-gray-10 shadow-500" />
                        )}

                        {(current?.title || current?.description) && (
                            <div className={classes.captionBar()}>
                                <span className="truncate">{current?.title}</span>
                                <span className="ml-4 shrink-0">{current?.description}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Acción opcional */}
                {showAction && (
                    <div className={classes.actions()}>
                        <Button
                            size="medium"
                            hideIcon
                            onClick={onAction}
                        >
                            {actionLabel}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowImage;
