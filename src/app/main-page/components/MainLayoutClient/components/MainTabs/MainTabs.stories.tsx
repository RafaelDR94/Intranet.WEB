import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import MainTabs from './MainTabs';

const tabs = [
  { label: 'Tab1', path: '/a' },
  { label: 'Tab2', path: '/b' },
];

const meta: Meta<typeof MainTabs> = {
  title: 'Components/MainTabs',
  component: MainTabs,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MainTabs>;

export const LightMode: Story = {
  args: { tabs, pathname: '/a', validPermissionsbyroute: () => true },
  decorators: [Story => <div data-theme="light"><Story /></div>],
};

export const DarkMode: Story = {
  args: { tabs, pathname: '/a', validPermissionsbyroute: () => true },
  decorators: [Story => <div data-theme="dark"><Story /></div>],
};
