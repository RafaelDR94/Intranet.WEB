import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import DetailsPanelLayout from './DetailsPanelLayout';

vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  default: (props: any) => <svg data-testid="icon-close" aria-hidden="true" {...props} />,
}));
vi.mock('@/assets/icons/navegacion/sidebar-expand.svg', () => ({
  default: (props: any) => <svg data-testid="icon-expand" aria-hidden="true" {...props} />,
}));
vi.mock('@/assets/icons/navegacion/sidebar-collapse.svg', () => ({
  default: (props: any) => <svg data-testid="icon-collapse" aria-hidden="true" {...props} />,
}));


describe('DetailsPanel', () => {
  it('muestra labels y ejecuta handlers', () => {
    const onClose = vi.fn();
    const onExpandedChange = vi.fn();

    render(
      <DetailsPanelLayout
        open
        onClose={onClose}
        onExpandedChange={onExpandedChange}
        leftLabel='Usuario: Test'
        rightLabel='Proyecto: Demo'
        
      >
        <div>Contenido</div>
      </DetailsPanelLayout>
    );

    expect(screen.getByText('Usuario: Test')).toBeInTheDocument();
    expect(screen.getByText('Proyecto: Demo')).toBeInTheDocument();

    // Toggle expand (usa botón de expand/collapse)
    fireEvent.click(screen.getByRole('button', { name: /expandir|colapsar/i }));
    expect(onExpandedChange).toHaveBeenCalled();

    // Close
    fireEvent.click(screen.getByRole('button', { name: /cerrar panel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});