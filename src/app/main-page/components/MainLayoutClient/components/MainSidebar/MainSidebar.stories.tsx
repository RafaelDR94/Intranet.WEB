import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import MainSidebar from './MainSidebar';
import { SidebarRoute } from './types';
import HomeIcon from '@/assets/icons/navegacion/home.svg';

const routes: SidebarRoute[] = [
  { label: 'Inicio', path: '/main-page/home', icon: HomeIcon },
];

const meta: Meta<typeof MainSidebar> = {
  title: 'Components/MainSidebar',
  component: MainSidebar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MainSidebar>;

export const LightMode: Story = {
  args: {
    offlineMode: false,
    onToggleOffline: () => {},
    theme: 'light',
    toggleTheme: () => {},
    userFullName: 'John Doe',
    logout: () => Promise.resolve(),
    validPermissionsbyroute: () => true,
    routes,
  },
  decorators: [Story => <div data-theme="light"><Story /></div>],
};

export const DarkMode: Story = {
  args: {
    offlineMode: false,
    onToggleOffline: () => {},
    theme: 'dark',
    toggleTheme: () => {},
    userFullName: 'John Doe',
    logout: () => Promise.resolve(),
    validPermissionsbyroute: () => true,
    routes,
  },
  decorators: [Story => <div data-theme="dark"><Story /></div>],
};
