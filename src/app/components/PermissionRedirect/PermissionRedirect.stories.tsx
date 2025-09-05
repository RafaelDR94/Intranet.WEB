import type { Meta, StoryObj } from '@storybook/react';
import { PermissionRedirect } from './PermissionRedirect';

const meta: Meta<typeof PermissionRedirect> = {
  title: 'Components/PermissionRedirect',
  component: PermissionRedirect,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PermissionRedirect>;

const withLightTheme = (StoryFn: any) => (
  <div
    data-theme="light"
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <StoryFn />
  </div>
);

const withDarkTheme = (StoryFn: any) => (
  <div
    data-theme="dark"
    style={{
      backgroundColor: 'var(--color-gray-10)',
      color: 'var(--color-foreground)',
      minHeight: '50vh',
      padding: '2rem',
    }}
  >
    <StoryFn />
  </div>
);

export const NoAccessLight: Story = {
  args: {
    routes: ['/private'],
    permissionChecker: () => false,
    router: { replace: () => {}, push: () => {} },
  },
  decorators: [withLightTheme],
};

export const NoAccessDark: Story = {
  args: {
    routes: ['/private'],
    permissionChecker: () => false,
    router: { replace: () => {}, push: () => {} },
  },
  decorators: [withDarkTheme],
};
