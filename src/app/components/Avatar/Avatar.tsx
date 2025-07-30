'use client';

import React from 'react';
import clsx from 'clsx';
import { AvatarProps } from './types';
import { baseClasses, imageClass, sizes, onlineClasses } from './styles';
import useAvatar from './hooks/useAvatar';

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
