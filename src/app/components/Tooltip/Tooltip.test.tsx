import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';
import { tooltipStyles } from './styles';

describe('Tooltip component', () => {
  it('renderiza el contenido hijo correctamente', () => {
    render(
      <Tooltip text="Tooltip de prueba">
        <button>Botón</button>
      </Tooltip>
    );
    expect(screen.getByText('Botón')).toBeInTheDocument();
  });

  it('muestra el texto del tooltip', () => {
    render(
      <Tooltip text="Este es un tooltip">
        <span>Elemento</span>
      </Tooltip>
    );
    expect(screen.getByText('Este es un tooltip')).toBeInTheDocument();
  });

  it('aplica la clase correcta para la posición "top" por defecto', () => {
    render(
      <Tooltip text="Texto superior">
        <div>Hover aquí</div>
      </Tooltip>
    );
    const tooltip = screen.getByText('Texto superior');
    expect(tooltip.className).toContain(tooltipStyles.tooltipTop);
  });

  it('aplica la clase correcta para la posición "right"', () => {
    render(
      <Tooltip text="Tooltip derecho" position="right">
        <div>Hover aquí</div>
      </Tooltip>
    );
    const tooltip = screen.getByText('Tooltip derecho');
    expect(tooltip.className).toContain(tooltipStyles.tooltipRight);
  });

  it('aplica la clase correcta para la posición "bottom"', () => {
    render(
      <Tooltip text="Tooltip inferior" position="bottom">
        <div>Hover aquí</div>
      </Tooltip>
    );
    const tooltip = screen.getByText('Tooltip inferior');
    expect(tooltip.className).toContain(tooltipStyles.tooltipBottom);
  });

  it('aplica la clase correcta para la posición "left"', () => {
    render(
      <Tooltip text="Tooltip izquierdo" position="left">
        <div>Hover aquí</div>
      </Tooltip>
    );
    const tooltip = screen.getByText('Tooltip izquierdo');
    expect(tooltip.className).toContain(tooltipStyles.tooltipLeft);
  });
});
