export type ShowImageProps = {
    /** Control externo (si lo usas fuera del hook) */
    open: boolean;
    /** URL HTTP(s) o base64 (data:image/...) */
    src?: string;
    /** Texto alternativo accesible */
    alt?: string;
    /** Cierra el visor (si no lo pasas, el botón de cerrar sólo es visual) */
    onClose?: () => void;

    /** Mostrar botón de acción */
    showAction?: boolean;
    /** Etiqueta del botón de acción */
    actionLabel?: string;
    /** Callback del botón de acción */
    onAction?: () => void;

    /** Deshabilita cerrar con backdrop (click fuera) y tecla Esc */
    disableOutsideClose?: boolean;
    /** Aria label del overlay/dialog */
    ariaLabel?: string;
    blur?: boolean;
    backdropOpacity?: number;
};
