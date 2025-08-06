import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CollapsibleSection } from './CollapsibleSection';
vi.mock('@/assets/icons/navegacion/nav-arrow-down.svg', () => ({
  default: () => <svg data-testid="arrow-down" />,
}));
vi.mock('@/assets/icons/navegacion/nav-arrow-up.svg', () => ({
  default: () => <svg data-testid="arrow-up" />,
}));

describe('CollapsibleSection', () => {
  it('muestra título y contenido por defecto', () => {
    render(
      <CollapsibleSection title="Título de prueba">
        <div>Contenido visible</div>
      </CollapsibleSection>
    );

    expect(screen.getByText('Título de prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido visible')).toBeInTheDocument();
  });

  it('oculta contenido si defaultOpen es false', () => {
    render(
      <CollapsibleSection title="Colapsado" defaultOpen={false}>
        <div>Contenido oculto</div>
      </CollapsibleSection>
    );

    expect(screen.queryByText('Contenido oculto')).not.toBeInTheDocument();
  });

  it('al hacer clic, alterna visibilidad del contenido', () => {
    render(
      <CollapsibleSection title="Toggleable" defaultOpen={false}>
        <div>Contenido dinámico</div>
      </CollapsibleSection>
    );

    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Contenido dinámico')).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByText('Contenido dinámico')).not.toBeInTheDocument();
  });
});
