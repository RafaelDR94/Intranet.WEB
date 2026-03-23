export type ShowImageProps = {
    /** Control externo (si lo usas fuera del hook) */
    open: boolean;
    /** URL HTTP(s) o base64 (data:image/...) */
    src?: string;
    /** Texto alternativo accesible */
    alt?: string;

    /**
     * Lista de imágenes (modo carrusel).
     * Si se provee, tiene prioridad sobre `src`.
     */
    items?: ShowImageCarouselItem[];
    /** Índice inicial cuando se abre (solo modo carrusel) */
    initialIndex?: number;
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

export type ShowImageCarouselItem = {
    /** URL de la imagen */
    image: string;
    /** Texto alternativo accesible (fallback a `alt`) */
    alt?: string;
    /** Título a mostrar (ej. nombre de conductor) */
    title?: string;
    /** Descripción a mostrar (ej. fecha) */
    description?: string;
};
