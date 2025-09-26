import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

const withLightTheme = (StoryComp: any) => (
  <div
    data-theme="light"
    style={{ color: 'var(--color-foreground)', minHeight: '50vh', padding: '2rem' }}
  >
    <StoryComp />
  </div>
);

const withDarkTheme = (StoryComp: any) => (
  <div
    data-theme="dark"
    style={{ color: 'var(--color-foreground)', minHeight: '50vh', padding: '2rem' }}
  >
    <StoryComp />
  </div>
);

export const StaticLight: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item id="home" label="Inicio" renderContent={<div>Bienvenido</div>} />
      <Breadcrumbs.Item id="reports" label="Reportes" renderContent={<div>Listado de reportes</div>} />
      <Breadcrumbs.Item id="current" label="Detalle" active renderContent={<div>Detalle actual</div>} />
    </Breadcrumbs>
  ),
  decorators: [withLightTheme],
};

export const StaticDark: Story = {
  ...StaticLight,
  decorators: [withDarkTheme],
};

export const InteractiveLight: Story = {
  render: () => {
    const [active, setActive] = useState<'home' | 'reports' | 'catalog'>('home');
    return (
      <Breadcrumbs activeId={active} onActiveChange={(active:any)=>setActive(active)}>
        <Breadcrumbs.Item id="home" label="Inicio" renderContent={<div>Home content</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Inicio</span>}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item id="reports" label="Reportes" renderContent={<div>Reports content</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Reportes</span>}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item id="catalog" label="Catálogo" renderContent={<div>Catalog content</div>}>
          {({ active }) => <span>{active ? '• ' : ''}Catálogo</span>}
        </Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
  decorators: [withLightTheme],
};

export const InteractiveDark: Story = {
  ...InteractiveLight,
  decorators: [withDarkTheme],
};
