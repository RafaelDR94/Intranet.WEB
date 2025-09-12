import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { ButtonsNavigation } from './ButtonsNavigation';

const meta: Meta<typeof ButtonsNavigation> = {
  title: 'Components/ButtonsNavigation',
  component: ButtonsNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ButtonsNavigation>;

const withLightTheme = (StoryComp: any) => (
  <div data-theme="light" style={{ color: 'var(--color-foreground)', minHeight: '50vh', padding: '2rem' }}>
    <StoryComp />
  </div>
);

const withDarkTheme = (StoryComp: any) => (
  <div data-theme="dark" style={{ color: 'var(--color-foreground)', minHeight: '50vh', padding: '2rem' }}>
    <StoryComp />
  </div>
);

export const DefaultLight: Story = {
  render: () => (
    <ButtonsNavigation>
      <ButtonsNavigation.Item id="info" label="Información" renderContent={<div>Información</div>} />
      <ButtonsNavigation.Item id="acts" label="Actividades" renderContent={<div>Actividades</div>} />
      <ButtonsNavigation.Item id="equip" label="Equipos" renderContent={<div>Equipos</div>} />
      <ButtonsNavigation.Item id="refs" label="Refacciones" renderContent={<div>Refacciones</div>} />
      <ButtonsNavigation.Item id="sign" label="Firma" renderContent={<div>Firma</div>} />
    </ButtonsNavigation>
  ),
  decorators: [withLightTheme],
};

export const DefaultDark: Story = {
  ...DefaultLight,
  decorators: [withDarkTheme],
};

export const CustomVariants: Story = {
  render: () => (
    <ButtonsNavigation buttonSize="small" activeVariant="solid" inactiveVariant="outline">
      <ButtonsNavigation.Item id="info" label="Información" renderContent={<div>Información</div>} />
      <ButtonsNavigation.Item id="acts" label="Actividades" inactiveVariant="ghost" renderContent={<div>Actividades</div>} />
      <ButtonsNavigation.Item id="equip" label="Equipos" size="medium" renderContent={<div>Equipos</div>} />
      <ButtonsNavigation.Item id="refs" label="Refacciones" renderContent={<div>Refacciones</div>} />
      <ButtonsNavigation.Item id="sign" label="Firma" renderContent={<div>Firma</div>} />
    </ButtonsNavigation>
  ),
  decorators: [withLightTheme],
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState('info');
    return (
      <ButtonsNavigation activeId={active} onActiveChange={setActive}>
        <ButtonsNavigation.Item id="info" label="Información" renderContent={<div>Información</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Información</span>}
        </ButtonsNavigation.Item>
        <ButtonsNavigation.Item id="acts" label="Actividades" renderContent={<div>Actividades</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Actividades</span>}
        </ButtonsNavigation.Item>
        <ButtonsNavigation.Item id="equip" label="Equipos" renderContent={<div>Equipos</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Equipos</span>}
        </ButtonsNavigation.Item>
      </ButtonsNavigation>
    );
  },
  decorators: [withLightTheme],
};

