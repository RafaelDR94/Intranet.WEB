/** Tamaños permitidos para el avatar */
export type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'tiny';

/** Props del componente `Avatar`. */
export interface AvatarProps {
  /** URL de la imagen a mostrar */
  src?: string;
  /** Texto alternativo para la imagen */
  alt?: string;
  /** Iniciales para mostrar cuando no hay imagen */
  initials?: string;
  /** Tamaño del avatar */
  size?: AvatarSize;
  /** Indica si el usuario está en línea */
  online?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}
