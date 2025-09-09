import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Spinner } from './Spinner';
import type { SpinnerSize } from './types';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['giant', 'large', 'medium', 'small', 'tiny'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 p-4 items-center">
      {(['giant', 'large', 'medium', 'small', 'tiny'] as SpinnerSize[]).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Spinner size={size} />
          <span className="text-xs">{size}</span>
        </div>
      ))}
    </div>
  ),
};
