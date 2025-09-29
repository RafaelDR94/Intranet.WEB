
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function createSvgMock(testId: string) {
  return {
    default: (props: any) => <svg data-testid={testId} {...props} />,
  };
}

vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => createSvgMock('arrow-down'));
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => createSvgMock('arrow-up'));
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => createSvgMock('arrow-right'));
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => createSvgMock('arrow-up'));
vi.mock('@/assets/icons/acciones/cancel.svg', () => createSvgMock('cancel'));

const useIsMobileMock = vi.fn(() => false);
vi.mock('../DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => useIsMobileMock(),
}));

import FormsLayout from './FormsLayout';

describe('FormsLayout', () => {
  beforeEach(() => {
    useIsMobileMock.mockReturnValue(false);
  });

  it('envuelve cada children en un contenedor separado', () => {
    const { container } = render(
      <FormsLayout title="Formulario" primaryLabel="Guardar">
        <div>Step 1</div>
        <div>Step 2</div>
      </FormsLayout>
    );

    const cards = container.querySelectorAll('.bg-white-100.p-6');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Step 1');
    expect(cards[1]).toHaveTextContent('Step 2');
  });

  it('dispara las acciones primarias y secundarias cuando se presionan los botones', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();

    render(
      <FormsLayout
        title="Formulario"
        primaryLabel="Guardar"
        onPrimaryClick={onPrimary}
        showSecondaryButton
        secondaryLabel="Cancelar"
        onSecondaryClick={onSecondary}
      >
        <div>Contenido</div>
      </FormsLayout>
    );

    fireEvent.click(screen.getByText('Cancelar'));
    expect(onSecondary).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Guardar'));
    expect(onPrimary).toHaveBeenCalled();
  });

  it('usa layout m�vil cuando useIsMobile retorna true', () => {
    useIsMobileMock.mockReturnValue(true);

    render(
      <FormsLayout title="Formulario" primaryLabel="Guardar">
        <div>Contenido</div>
      </FormsLayout>
    );

    const actionsWrapper = screen.getByText('Guardar').closest('button')?.parentElement;
    expect(actionsWrapper?.className).toContain('flex-col');
  });
});
