import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonalAvatar from './PersonalAvatar';
import usePersonalAvatar from './hooks/usePersonalAvatar';

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

