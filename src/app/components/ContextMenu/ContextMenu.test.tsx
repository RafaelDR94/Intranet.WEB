import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({ default: (props: any) => <svg data-testid="arrow-icon" {...props} /> }));

// Mocks de controles para evitar dependencias reales
vi.mock('../ToogleButton.tsx/ToogleButton', () => ({ ToggleButton: (p: any) => <button data-testid="toggle" {...p} /> }));
vi.mock('../CheckBox/CheckBox', () => ({ Checkbox: (p: any) => <input type="checkbox" data-testid="checkbox" {...p} /> }));
vi.mock('../CustomRadio/CustomRadio', () => ({ default: (p: any) => <input type="radio" data-testid="radio" {...p} /> }));
vi.mock('../Button/Button', () => ({ Button: (p: any) => <button data-testid="btn" {...p} /> }));
vi.mock('../Control/Control', () => ({ Control: (p: any) => <div data-testid="control" {...p} /> }));

// Mock ResizeObserver para JSDOM
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

// importa después de mocks
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  it('opens menu on trigger click', () => {
    render(<ContextMenu trigger={<button>Open</button>} items={[{ label: 'Item' }]} />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls onClick when clicking an enabled item', () => {
    const onClick = vi.fn();
    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ label: 'Item 1', onClick }]}
      />
    );
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Item 1'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for disabled item', () => {
    const onClick = vi.fn();
    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ label: 'Disabled', onClick, disabled: true }]}
      />
    );
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Disabled'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows right arrow icon when no control is present', () => {
    render(<ContextMenu trigger={<button>Open</button>} items={[{ label: 'Item' }]} />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
  });

  it('applies right alignment when alignRight is true', () => {
    const { container } = render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ label: 'Item' }]}
        alignRight
      />
    );
    fireEvent.click(screen.getByText('Open'));
    const menu = screen.getByRole('menu');
    // clase RightAligned viene de ContextMenu.styles.ts
    expect(menu.className).toMatch(/right-0/);
  });

  it('autoFlip opens upwards when there is little space below', () => {
    // mock de dimensiones del trigger para forzar poco espacio abajo
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 0, width: 100, height: 40, top: 760, right: 100, bottom: 800, left: 0,
      toJSON: () => {}
    })) as any;

    const originalInnerHeight = window.innerHeight;
    // altura de ventana 800 => spaceBelow = 0
    window.innerHeight = 800;

    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ label: 'Item' }]}
        autoFlip
        estimatedMenuHeight={200}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    const menu = screen.getByRole('menu');

    // clase OpenUp viene de ContextMenu.styles.ts
    expect(menu.className).toMatch(/bottom-full/);

    // restore
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    window.innerHeight = originalInnerHeight;
  });

  it('renders a left-side control when specified', () => {
    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[
          {
            label: 'With Toggle',
            controlType: 'toggle',
            controlSide: 'left',
            controlProps: { 'aria-label': 'toggle-aria' },
          },
        ]}
      />
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });
});
