'use client';
import React, { useEffect, useRef } from 'react';

import { classes } from './styles';
import { ShowImageProps } from './types';

import { Button } from '@/app/components/Button/Button';
import CloseIcon from '@/assets/icons/acciones/cancel.svg';

const ShowImage: React.FC<ShowImageProps> = ({
    open,
    src,
    alt = 'Imagen',
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
    useEffect(() => {
        if (disableOutsideClose) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, disableOutsideClose]);

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disableOutsideClose) return;
        // cierra sólo si el click fue en el backdrop (no en el modal)
        if (e.target === e.currentTarget) onClose?.();
    };

    if (!open) return null;

    // Cerrar con ESC

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className={classes.image()} />
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
