'use client';

import React from 'react';
import { Spinner } from '../Spinner/Spinner';
import Avatar from '../Avatar/Avatar';
import usePersonalAvatar from './hooks/usePersonalAvatar';
import { PersonalAvatarProps } from './types';
import { containerClass } from './styles';

/**
 * Muestra el avatar del usuario autenticado obteniendo las iniciales y la foto
 * de perfil desde `usePersonalAvatar`.
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

