import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { ButtonsNavigation } from './ButtonsNavigation';

describe('ButtonsNavigation component', () => {
  it('renders container with default and custom data-testid', () => {
    const { rerender } = render(
      <ButtonsNavigation>
        <ButtonsNavigation.Item id="info" label="Información" />
      </ButtonsNavigation>
    );
    expect(screen.getByTestId('buttons-navigation')).toBeInTheDocument();

    rerender(
      <ButtonsNavigation dataTestId="nav1">
        <ButtonsNavigation.Item id="info" label="Información" />
      </ButtonsNavigation>
    );
    expect(screen.getByTestId('nav1')).toBeInTheDocument();
  });

  it('renders items with labels and data-testid pattern', () => {
    render(
      <ButtonsNavigation>
        <ButtonsNavigation.Item id="info" label="Información" />
        <ButtonsNavigation.Item id="acts" label="Actividades" />
        <ButtonsNavigation.Item id="equip" label="Equipos" />
      </ButtonsNavigation>
    );
    expect(screen.getByText('Información')).toBeInTheDocument();
    expect(screen.getByText('Actividades')).toBeInTheDocument();
    expect(screen.getByText('Equipos')).toBeInTheDocument();

    expect(screen.getByTestId('buttonnav-info')).toBeInTheDocument();
    expect(screen.getByTestId('buttonnav-acts')).toBeInTheDocument();
    expect(screen.getByTestId('buttonnav-equip')).toBeInTheDocument();
  });

  it('supports custom content via children render function', () => {
    render(
      <ButtonsNavigation>
        <ButtonsNavigation.Item id="one" label="Uno">
          {({ active }) => <span data-testid="custom">{active ? '• ' : ''}Uno</span>}
        </ButtonsNavigation.Item>
        <ButtonsNavigation.Item id="two" label="Dos">
          {() => <span data-testid="custom2">Dos</span>}
        </ButtonsNavigation.Item>
      </ButtonsNavigation>
    );
    expect(screen.getByTestId('custom')).toHaveTextContent('• Uno');
    expect(screen.getByTestId('custom2')).toHaveTextContent('Dos');
  });

  it('calls onClick for interactive items and respects disabled', () => {
    const onOne = vi.fn();
    const onTwo = vi.fn();
    render(
      <ButtonsNavigation>
        <ButtonsNavigation.Item id="one" label="Uno" onClick={onOne} />
        <ButtonsNavigation.Item id="two" label="Dos" onClick={onTwo} disabled />
      </ButtonsNavigation>
    );
    fireEvent.click(screen.getByTestId('buttonnav-one'));
    expect(onOne).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('buttonnav-two'));
    expect(onTwo).not.toHaveBeenCalled();
  });

  it('sets aria-current="page" when active', () => {
    render(
      <ButtonsNavigation>
        <ButtonsNavigation.Item id="one" label="Uno" />
        <ButtonsNavigation.Item id="two" label="Dos" />
      </ButtonsNavigation>
    );
    expect(screen.getByTestId('buttonnav-one')).toHaveAttribute('aria-current', 'page');
  });

  it('renders content from active item via renderContent and switches on click', async () => {
    const First = () => <div data-testid="content-1">Contenido 1</div>;
    const Second = () => <div data-testid="content-2">Contenido 2</div>;
    render(
      <ButtonsNavigation dataTestId="bn">
        <ButtonsNavigation.Item id="one" label="Uno" renderContent={<First />} />
        <ButtonsNavigation.Item id="two" label="Dos" renderContent={() => <Second />} />
      </ButtonsNavigation>
    );

    expect(screen.getByTestId('bn-content')).toBeInTheDocument();
    expect(screen.getByTestId('content-1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('buttonnav-two'));
    expect(await screen.findByTestId('content-2')).toBeInTheDocument();
  });
});

