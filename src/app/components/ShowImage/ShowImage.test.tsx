import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ShowImage from './ShowImage';

(globalThis as any).React = React;

vi.mock('@/app/components/Button/Button', () => ({
  __esModule: true,
  Button: ({ children, onClick }: any) => (
    <button type="button" data-testid="action-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="close-icon">x</span>,
}));

describe('ShowImage', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  it('returns null when closed', () => {
    const { container } = render(<ShowImage open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('triggers onClose via button, backdrop and escape key', () => {
    const handleClose = vi.fn();
    render(
      <ShowImage
        open
        src="image.png"
        alt="Preview"
        onClose={handleClose}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Cerrar visor/i })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  it('does not close on backdrop or escape when disabled', () => {
    const handleClose = vi.fn();
    render(
      <ShowImage
        open
        disableOutsideClose
        src="image.png"
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByRole('dialog'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders optional action button', () => {
    const handleAction = vi.fn();
    render(
      <ShowImage
        open
        showAction
        actionLabel="Descargar"
        onAction={handleAction}
      />
    );

    fireEvent.click(screen.getByTestId('action-button'));
    expect(handleAction).toHaveBeenCalled();
  });
});
