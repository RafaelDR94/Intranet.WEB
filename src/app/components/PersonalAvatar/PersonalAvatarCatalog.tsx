'use client';

import PersonalAvatar from './PersonalAvatar';

export const PersonalAvatarCatalog = () => (
  <div className="flex gap-4">
    <PersonalAvatar size="lg" />
    <PersonalAvatar size="md" />
  </div>
);
