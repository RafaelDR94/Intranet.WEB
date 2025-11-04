import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import CreateUser from './CreateUser';
import useCreateUser from './hooks/useCreateUser';

vi.mock('./hooks/useCreateUser', () => ({
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

describe('CreateUser', () => {
  const mockHook = useCreateUser as unknown as Mock;

  beforeEach(() => {
    mockHook.mockReset();
    dynamicFormSpy.mockClear();
  });

  it('muestra mensaje cuando no hay empleado seleccionado', () => {
    mockHook.mockReturnValue({
      hasEmployee: false,
    });

    render(<CreateUser />);

    expect(
      screen.getByText(/Selecciona un empleado para generar su usuario de acceso/i),
    ).toBeInTheDocument();
    expect(dynamicFormSpy).not.toHaveBeenCalled();
  });

  it('renderiza DynamicForm cuando existe un empleado', () => {
    const handleSubmit = vi.fn();
    const handleValidChange = vi.fn();

    mockHook.mockReturnValue({
      hasEmployee: true,
      fields: [{ name: 'username', type: 'input' }],
      formVersion: 1,
      loadingForm: false,
      loadingSubmit: false,
      handleSubmit,
      handleValidChange,
      formValid: true,
      canSubmit: true,
    });

    render(<CreateUser />);

    expect(dynamicFormSpy).toHaveBeenCalledTimes(1);
    const props = dynamicFormSpy.mock.calls[0][0];
    expect(props.onSubmit).toBe(handleSubmit);
    expect(props.onValidChange).toBe(handleValidChange);
    expect(props.showSubmitIf()).toBe(true);
  });
});
