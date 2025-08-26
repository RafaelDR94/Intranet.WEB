import type { Meta, StoryObj } from '@storybook/react';
import PersonalAvatar from './PersonalAvatar';
import { MockAuthProvider } from '@/__mocks__/mockAuthProvider';

const meta: Meta<typeof PersonalAvatar> = {
  title: 'Components/PersonalAvatar',
  component: PersonalAvatar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <Story />
      </MockAuthProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PersonalAvatar>;

export const LightMode: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
