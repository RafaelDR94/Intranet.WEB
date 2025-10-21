import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs component', () => {
  it('renders breadcrumbs container only when there are 2 or more items', () => {
    // 🔹 Caso 1: solo 1 item → no se muestra el contenedor con data-testid
    const { rerender } = render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="home" label="Inicio" />
      </Breadcrumbs>
    );

    // No debería existir el contenedor principal
    expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument();

    // 🔹 Caso 2: 2 items → ya debe renderizar el contenedor principal
    rerender(
      <Breadcrumbs>
        <Breadcrumbs.Item id="home" label="Inicio" />
        <Breadcrumbs.Item id="dashboard" label="Dashboard" />
      </Breadcrumbs>
    );

    // Ahora sí debe mostrarse el contenedor por defecto
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();

    // 🔹 Caso 3: usando un dataTestId personalizado
    rerender(
      <Breadcrumbs dataTestId="my-bc">
        <Breadcrumbs.Item id="home" label="Inicio" />
        <Breadcrumbs.Item id="dashboard" label="Dashboard" />
      </Breadcrumbs>
    );

    expect(screen.getByTestId('my-bc')).toBeInTheDocument();
  });


  it('renders items with proper labels and data-testid pattern', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="home" label="Inicio" />
        <Breadcrumbs.Item id="rep" label="Reportes" />
        <Breadcrumbs.Item id="cat" label="Catálogo" />
      </Breadcrumbs>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();

    expect(screen.getByTestId('breadcrum-home')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrum-rep')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrum-cat')).toBeInTheDocument();
  });

  it('supports custom content via children or render function', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="one" label="Uno">
          <span data-testid="custom-node">Contenido Uno</span>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item id="two" label="Dos" active>
          {({ active }) => (
            <span data-testid="render-fn">{active ? 'Activo' : 'Inactivo'}</span>
          )}
        </Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(screen.getByTestId('custom-node')).toHaveTextContent('Contenido Uno');
    expect(screen.getByTestId('render-fn')).toHaveTextContent('Activo');
  });

  it('inserts separators between items (not after last)', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="one" label="Uno" />
        <Breadcrumbs.Item id="two" label="Dos" />
        <Breadcrumbs.Item id="three" label="Tres" />
      </Breadcrumbs>
    );
    const seps = screen.getAllByTestId('breadcrumb-separator');
    expect(seps.length).toBe(2);
  });

  it('calls onClick for interactive items and respects disabled', () => {
    const onOne = vi.fn();
    const onTwo = vi.fn();
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="one" label="Uno" onClick={onOne} />
        <Breadcrumbs.Item id="two" label="Dos" onClick={onTwo} disabled />
      </Breadcrumbs>
    );
    fireEvent.click(screen.getByTestId('breadcrum-one'));
    expect(onOne).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('breadcrum-two'));
    expect(onTwo).not.toHaveBeenCalled();
  });

  it('sets aria-current="page" when active', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item id="one" label="Uno" />
        <Breadcrumbs.Item id="two" label="Dos" active />
      </Breadcrumbs>
    );
    expect(screen.getByTestId('breadcrum-two')).toHaveAttribute('aria-current', 'page');
  });

  it('renders content from active item via renderContent and switches on click', async () => {
    const First = () => <div data-testid="content-1">Contenido 1</div>;
    const Second = () => <div data-testid="content-2">Contenido 2</div>;
    render(
      <Breadcrumbs dataTestId="bc">
        <Breadcrumbs.Item id="one" label="Uno" renderContent={<First />} />
        <Breadcrumbs.Item id="two" label="Dos" renderContent={() => <Second />} />
      </Breadcrumbs>
    );

    // por defecto, primer item activo
    expect(screen.getByTestId('bc-content')).toBeInTheDocument();
    expect(screen.getByTestId('content-1')).toBeInTheDocument();

    // cambiar al segundo
    fireEvent.click(screen.getByTestId('breadcrum-two'));
    expect(await screen.findByTestId('content-2')).toBeInTheDocument();
  });
});

