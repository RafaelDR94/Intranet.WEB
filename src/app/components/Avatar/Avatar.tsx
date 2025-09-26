'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import useAvatar from './hooks/useAvatar';
import { baseClasses, imageClass, sizes, onlineClasses } from './styles';
import { AvatarProps } from './types';
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
        <Image src={src} alt={alt} className={imageClass} fill priority unoptimized />
      ) : (
        <span>{fallback}</span>
      )}
      {online && <span className={onlineClasses(size)} />}
    </div>
  );
};

export default Avatar;
