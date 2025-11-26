import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import CreateEmployee from './CreateEmployee';
import useCreateEemployee from './hooks/useCreatEmployee';

vi.mock('./hooks/useCreatEmployee', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const formsLayoutSpy = vi.fn();
vi.mock('@/app/components/FormsLayout/FormsLayout', () => ({
  __esModule: true,
  default: (props: any) => {
    formsLayoutSpy(props);
    return (
      <div data-testid="forms-layout">
        <button
          type="button"
          disabled={props.primaryDisabled}
          onClick={() => props.onPrimaryClick?.()}
        >
          {props.primaryLabel}
        </button>
        {props.children}
      </div>
    );
  },
}));

const dynamicFormSpy = vi.fn();
vi.mock('@/app/components/DynamicForm/DynamicForm', () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return (
      <form
        data-testid="dynamic-form"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit?.({});
        }}
      >
        <button type="submit">submit</button>
      </form>
    );
  },
}));

describe('CreateEmployee page', () => {
  const mockHook = useCreateEemployee as unknown as Mock;

  beforeEach(() => {
    formsLayoutSpy.mockClear();
    dynamicFormSpy.mockClear();
    mockHook.mockReset();
  });

  it('no renderiza el formulario hasta que canStart sea true', () => {
    mockHook.mockReturnValue({
      loadingForm: false,
      fields: undefined,
      submitRef: { current: vi.fn() },
      canStart: false,
      handleSubmit: vi.fn(),
      handleValidChange: vi.fn(),
      formCompleted: false,
      isReadOnly: false,
    });

    const { queryByTestId } = render(<CreateEmployee />);
    expect(queryByTestId('forms-layout')).not.toBeInTheDocument();
    expect(dynamicFormSpy).not.toHaveBeenCalled();
  });

  it('conecta FormsLayout con DynamicForm cuando canStart es true', () => {
    const submitMock = vi.fn();
    const handleSubmit = vi.fn();
    const handleValidChange = vi.fn();

    mockHook.mockReturnValue({
      loadingForm: true,
      fields: [{ name: 'firstname', type: 'input' }],
      submitRef: { current: submitMock },
      canStart: true,
      handleSubmit,
      handleValidChange,
      formCompleted: true,
      isReadOnly: false,
    });

    render(<CreateEmployee />);

    expect(formsLayoutSpy).toHaveBeenCalledTimes(1);
    expect(dynamicFormSpy).toHaveBeenCalledTimes(1);

    const dynamicProps = dynamicFormSpy.mock.calls[0][0];
    expect(dynamicProps.loadingFormInfo).toBe(true);
    expect(dynamicProps.onSubmit).toBe(handleSubmit);
    expect(dynamicProps.onValidChange).toBe(handleValidChange);

    fireEvent.click(screen.getByRole('button', { name: 'Registrar empleado' }));
    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  it('pasa loggedUser al hook y deshabilita el botón cuando es solo lectura', () => {
    const mockUser = { idEmployee: '123' } as any;
    mockHook.mockReturnValue({
      loadingForm: true,
      fields: [{ name: 'firstname', type: 'input' }],
      submitRef: { current: vi.fn() },
      canStart: true,
      handleSubmit: vi.fn(),
      handleValidChange: vi.fn(),
      formCompleted: true,
      isReadOnly: true,
    });

    render(<CreateEmployee loggedUser={mockUser} />);

    expect(mockHook).toHaveBeenCalledWith({ loggedUser: mockUser });
    expect(
      screen.getByRole('button', { name: 'Registrar empleado' })
    ).toBeDisabled();
  });
});
