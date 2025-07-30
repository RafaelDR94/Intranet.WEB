import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PaginationDots from './PaginationDots';
import { Props } from './types';

const meta: Meta<typeof PaginationDots> = {
  title: 'Components/PaginationDots',
  component: PaginationDots,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationDots>;

// --- 🎨 Decorators de Tema ---

const withLightTheme = (Story: any) => (
  <div
    data-theme="light"
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

const withDarkTheme = (Story: any) => (
  <div
    data-theme="dark"
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

// --- 🧪 Historias Light Mode ---

export const DefaultLight: Story = {
  args: {
    totalPages: 5,
    currentPage: 2,
    onPageChange: (page: number) => console.log('Página cambiada:', page),
  },
  decorators: [withLightTheme],
};

export const SevenDotsLight: Story = {
  args: {
    totalPages: 7,
    currentPage: 3,
    onPageChange: (page: number) => console.log('Página cambiada:', page),
  },
  decorators: [withLightTheme],
};

export const WithHiddenDotsLight: Story = {
  args: {
    totalPages: 10,
    currentPage: 1,
    onPageChange: (page: number) => console.log('Página cambiada:', page),
  },
  decorators: [withLightTheme],
};

export const ActiveLastDotLight: Story = {
  args: {
    totalPages: 6,
    currentPage: 5,
    onPageChange: (page: number) => console.log('Página cambiada:', page),
  },
  decorators: [withLightTheme],
};

// --- 🌙 Historias Dark Mode ---

export const DefaultDark: Story = {
  ...DefaultLight,
  decorators: [withDarkTheme],
};

export const SevenDotsDark: Story = {
  ...SevenDotsLight,
  decorators: [withDarkTheme],
};

export const WithHiddenDotsDark: Story = {
  ...WithHiddenDotsLight,
  decorators: [withDarkTheme],
};

export const ActiveLastDotDark: Story = {
  ...ActiveLastDotLight,
  decorators: [withDarkTheme],
};
