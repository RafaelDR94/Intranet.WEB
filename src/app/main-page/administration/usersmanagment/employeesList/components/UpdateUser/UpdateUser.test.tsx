import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import UpdateUser from './UpdateUser';
import useUpdateUser from './hooks/useUpdateUser';

vi.mock('./hooks/useUpdateUser', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const dynamicFormSpy = vi.fn();
vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return <form data-testid="dynamic-form">{props.children}</form>;
  },
}));

describe('UpdateUser', () => {
  const mockHook = useUpdateUser as unknown as Mock;

  beforeEach(() => {
    mockHook.mockReset();
    dynamicFormSpy.mockClear();
  });

  it('muestra guía cuando no hay usuario', () => {
    mockHook.mockReturnValue({
      hasUser: false,
    });

    render(<UpdateUser />);

    expect(
      screen.getByText(/Para actualizar un usuario selecciona un empleado/i),
    ).toBeInTheDocument();
    expect(dynamicFormSpy).not.toHaveBeenCalled();
  });

  it('renderiza DynamicForm cuando existe usuario', () => {
    const handleSubmit = vi.fn();
    const handleValidChange = vi.fn();

    mockHook.mockReturnValue({
      hasUser: true,
      fields: [{ name: 'username', type: 'input' }],
      formVersion: 2,
      loadingForm: false,
      loadingSubmit: true,
      handleSubmit,
      handleValidChange,
      formValid: true,
      canSubmit: true,
    });

    render(<UpdateUser />);

    expect(dynamicFormSpy).toHaveBeenCalledTimes(1);
    const props = dynamicFormSpy.mock.calls[0][0];
    expect(props.onSubmit).toBe(handleSubmit);
    expect(props.disabled).toBe(true);
    expect(props.loading).toBe(true);
  });
});
