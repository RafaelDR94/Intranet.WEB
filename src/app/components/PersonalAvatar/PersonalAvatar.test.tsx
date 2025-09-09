import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import usePersonalAvatar from './hooks/usePersonalAvatar';
import PersonalAvatar from './PersonalAvatar';

vi.mock('./hooks/usePersonalAvatar', () => ({
  __esModule: true,
  default: vi.fn(() => ({ avatarInit: { initials: 'JD', src: '' } })),
}));

const mockedHook = vi.mocked(usePersonalAvatar);

describe('PersonalAvatar', () => {
  it('renders Avatar when initials are available', () => {
    render(<PersonalAvatar size="md" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders spinner when initials are not available', () => {
    mockedHook.mockReturnValueOnce({ avatarInit: { initials: '', src: '' } } as any);
    const { container } = render(<PersonalAvatar size="md" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});

