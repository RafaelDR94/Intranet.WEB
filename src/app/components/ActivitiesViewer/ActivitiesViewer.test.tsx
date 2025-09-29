import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

type ActivitiesViewerComponent = (typeof import('./ActivitiesViewer'))['default'];
let ActivitiesViewer: ActivitiesViewerComponent;

const actionMenuCellMock = vi.fn();

vi.mock('../ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: (props: any) => {
    actionMenuCellMock(props);
    return <div data-testid="action-menu-cell" />;
  },
}));

const setGlobalClientWidth = (width: number) => {
  const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return width;
    },
  });
  return () => {
    if (desc) Object.defineProperty(HTMLElement.prototype, 'clientWidth', desc);
  };
};

beforeAll(async () => {
  (globalThis as any).ResizeObserver = class {
    private cb: () => void;
    constructor(cb: () => void) {
      this.cb = cb;
    }
    observe() {
      this.cb();
    }
    disconnect() {}
  } as any;

  const mod = await import('./ActivitiesViewer');
  ActivitiesViewer = mod.default;
});

beforeEach(() => {
  actionMenuCellMock.mockClear();
});

const makeItems = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({
    title: `Actividad ${i + 1}`,
    description: `Desc ${i + 1}`,
    image: '',
  }));

const renderViewer = (props: React.ComponentProps<ActivitiesViewerComponent>) => {
  if (!ActivitiesViewer) throw new Error('ActivitiesViewer not loaded');
  const Viewer = ActivitiesViewer;
  return render(<Viewer {...props} />);
};

describe('ActivitiesViewer', () => {
  it('renderiza 3x2 tarjetas cuando el contenedor permite 3 columnas y muestra paginación', () => {
    const restore = setGlobalClientWidth(920);
    renderViewer({ items: makeItems(10), dataTestId: 'av', columns: 3 });

    const grid = screen.getByTestId('av-grid');
    const cols = Number((grid as HTMLElement).style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] ?? '0');
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBe(cols * 2);

    const dots = screen.getAllByRole('button');
    expect(dots.length).toBe(2);
    restore();
  });

  it('renderiza 2x2 cuando el contenedor permite 2 columnas', () => {
    const restore = setGlobalClientWidth(600);
    renderViewer({ items: makeItems(10), dataTestId: 'av2', columns: 2 });
    const grid = screen.getByTestId('av2-grid');
    const cols = Number((grid as HTMLElement).style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] ?? '0');
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBe(cols * 2);
    const dots = screen.getAllByRole('button');
    expect(dots.length).toBe(3);
    restore();
  });

  it('navega de página al hacer click en el segundo punto', async () => {
    const restore = setGlobalClientWidth(920);
    renderViewer({ items: makeItems(10), dataTestId: 'av3' });
    const dots = screen.getAllByRole('button');
    fireEvent.click(dots[1]);
    expect(await screen.findByText('Actividad 10')).toBeInTheDocument();
    restore();
  });

  it('muestra ActionMenuCell cuando se proporcionan props', () => {
    const restore = setGlobalClientWidth(600);
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const items = [
      {
        title: 'Actividad 1',
        description: 'Desc 1',
        image: '',
        actionMenuProps: {
          row: { id: 1 },
          onEdit,
          onDelete,
        },
      },
    ];

    renderViewer({ items, dataTestId: 'av-menu', columns: 1 });

    expect(screen.getByTestId('action-menu-cell')).toBeInTheDocument();
    expect(actionMenuCellMock).toHaveBeenCalledWith(
      expect.objectContaining({ row: { id: 1 }, onEdit, onDelete })
    );
    restore();
  });
});
