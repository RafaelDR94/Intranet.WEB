import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ActivitiesViewer from './ActivitiesViewer';

const meta: Meta<typeof ActivitiesViewer> = {
  title: 'Components/ActivitiesViewer',
  component: ActivitiesViewer,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ActivitiesViewer>;

const ITEMS = Array.from({ length: 10 }).map((_, i) => ({
  title: `Actividad ${i + 1}`,
  description: 'Descripción breve de la actividad',
  image: 'https://via.placeholder.com/640x360.png?text=Actividad+' + (i + 1),
}));

export const Default: Story = {
  render: () => (
    <div data-theme="light" style={{ padding: '2rem' }}>
      <ActivitiesViewer items={ITEMS} />
    </div>
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <div data-theme="light" style={{ padding: '2rem' }}>
      <div style={{ width: 640 }}>
        <ActivitiesViewer items={ITEMS} />
      </div>
    </div>
  ),
};

export const DrawerLike: Story = {
  render: () => (
    <div data-theme="light" style={{ padding: '2rem' }}>
      <div style={{ width: 360 }}>
        <ActivitiesViewer items={ITEMS} />
      </div>
    </div>
  ),
};

