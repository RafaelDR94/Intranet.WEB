'use client';

import Avatar from './Avatar';

const sizes = ['xl', 'lg', 'md', 'sm', 'xs', 'xxs'] as const;

export const AvatarCatalog = () => (
  <div className="flex gap-4 flex-wrap">
    {sizes.map((s) => (
      <Avatar key={s} initials="AA" size={s} />
    ))}
  </div>
);
