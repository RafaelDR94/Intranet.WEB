import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ActivitiesViewer from './ActivitiesViewer';

// Utilidades para forzar anchos en JSDOM y mockear ResizeObserver
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

beforeAll(() => {
  (globalThis as any).ResizeObserver = class {
    private cb: () => void;
    constructor(cb: () => void) {
      this.cb = cb;
    }
    observe() {
      // invoca al suscribirse
      this.cb();
    }
    disconnect() {}
  } as any;
});

const makeItems = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({
    title: `Actividad ${i + 1}`,
    description: `Desc ${i + 1}`,
    image: '',
  }));

describe('ActivitiesViewer', () => {
  it('renderiza 3x2 tarjetas cuando el contenedor permite 3 columnas y muestra paginación', () => {
    const restore = setGlobalClientWidth(920); // ~3 columnas (280*3 + gaps)
    render(<ActivitiesViewer items={makeItems(10)} dataTestId="av" columns={3} />);

    // tarjetas visibles = cols*3
    const grid = screen.getByTestId('av-grid');
    const cols = Number((grid as HTMLElement).style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] ?? '0');
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBe(cols * 2);

    // Paginación de 2 páginas (10/9 = 2)
    const dots = screen.getAllByRole('button');
    expect(dots.length).toBe(2);
    restore();
  });

  it('renderiza 2x2 cuando el contenedor permite 2 columnas', () => {
    const restore = setGlobalClientWidth(600); // ~2 columnas
    render(<ActivitiesViewer items={makeItems(10)} dataTestId="av2" columns={2} />);
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
    render(<ActivitiesViewer items={makeItems(10)} dataTestId="av3" />);
    // cambia a la segunda página
    const dots = screen.getAllByRole('button');
    fireEvent.click(dots[1]);
    // ahora debe verse la Actividad 10
    expect(await screen.findByText('Actividad 10')).toBeInTheDocument();
    restore();
  });
});
