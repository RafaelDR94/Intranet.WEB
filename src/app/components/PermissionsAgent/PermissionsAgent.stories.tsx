import type { Meta, StoryObj } from '@storybook/react';
import { PermissionAgent } from './PermissionsAgent';

const meta: Meta<typeof PermissionAgent> = {
  title: 'Components/PermissionAgent',
  component: PermissionAgent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PermissionAgent>;

export const LightMode: Story = {
  args: { children: <div>Contenido protegido</div> },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: { children: <div>Contenido protegido</div> },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
