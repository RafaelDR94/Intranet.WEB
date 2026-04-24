import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import AccountPage from './page';

Object.assign(globalThis, { React });

const CreateEmployee = vi.hoisted(() =>
  vi.fn(() => <div>CreateEmployee</div>),
);

const mockUser = { idUser: 'user-1', name: 'Tester' };

vi.mock('@/app/stores/useAuthStore/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: typeof mockUser }) => unknown) =>
    selector({ user: mockUser }),
}));

vi.mock('../../administration/usersmanagment/createemployee/CreateEmployee', () => ({
  __esModule: true,
  default: CreateEmployee,
}));

describe('AccountPage', () => {
  it('renders the locked create employee form for the logged user', () => {
    render(<AccountPage />);

    expect(screen.getByText('CreateEmployee')).toBeInTheDocument();
    expect(CreateEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        loggedUser: mockUser,
        onConfigurations: true,
      }),
      undefined,
    );
  });
});
