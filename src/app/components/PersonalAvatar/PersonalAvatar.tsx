'use client';

import React from 'react';

import Avatar from '../Avatar/Avatar';
import { Spinner } from '../Spinner/Spinner';

import usePersonalAvatar from './hooks/usePersonalAvatar';
import { containerClass } from './styles';
import { PersonalAvatarProps } from './types';

/**
 * Muestra el avatar del usuario autenticado.
 *
 * Obtiene **iniciales** y **foto de perfil** a través de `usePersonalAvatar` y
 * renderiza el componente `Avatar`. Si los datos aún no están listos, muestra
 * un `Spinner` de carga.
 *
 * @remarks
 * - El tamaño visual se controla con la prop `size`, que se pasa directo a `Avatar`.
 * - Cuando no hay datos (aún cargando), se renderiza un `Spinner` con tamaño fijo.
 *
 * @accessibility
 * - Si tu `Avatar` soporta `alt`/`aria-label`, considera propagar un nombre del
 *   usuario desde `usePersonalAvatar` para mejorar el contexto del lector de pantalla.
 * - Puedes envolver el contenedor con `aria-busy="true"` mientras no haya iniciales.
 *
 * @example
 * ```tsx
 * <PersonalAvatar size="md" />
 * ```
 */
const PersonalAvatar: React.FC<PersonalAvatarProps> = ({ size }) => {
  const { avatarInit } = usePersonalAvatar();
  return (
    <div className={containerClass}>
      {avatarInit.initials ? (
        <Avatar initials={avatarInit.initials} size={size} src={avatarInit.src} online />
      ) : (
        <Spinner size="medium" />
      )}
    </div>
  );
};

export default PersonalAvatar;

