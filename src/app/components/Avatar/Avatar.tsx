'use client';

import React from 'react';
import clsx from 'clsx';
import { AvatarProps } from './types';
import { baseClasses, imageClass, sizes, onlineClasses } from './styles';
import useAvatar from './hooks/useAvatar';
/**
 * Componente `Avatar`.
 *
 * Renderiza un avatar de usuario que puede mostrar:
 * - Una imagen de perfil (`src`).
 * - Un texto alternativo (`alt`).
 * - Iniciales como fallback (`initials`).
 * - Un indicador de estado en línea (`online`).
 *
 * El tamaño del avatar es configurable y puede variar entre
 * `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'tiny'`.
 *
 * @component
 * @example
 * ```tsx
 * <Avatar
 *   src="https://example.com/user.png"
 *   alt="Usuario"
 *   initials="UM"
 *   size="lg"
 *   online={true}
 *   className="rounded-full shadow-md"
 * />
 * ```
 *
 * @param {AvatarProps} props - Propiedades del componente.
 * @returns {JSX.Element} El componente renderizado.
 */
const Avatar = ({
  src,
  alt = 'avatar',
  initials,
  size = 'md',
  online = true,
  className = '',
}: AvatarProps) => {
  const fallback = useAvatar(initials, alt);

  return (
    <div className={clsx(baseClasses, sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt} className={imageClass} />
      ) : (
        <span>{fallback}</span>
      )}
      {online && <span className={onlineClasses(size)} />}
    </div>
  );
};

export default Avatar;
