import type { Meta, StoryObj } from '@storybook/react';

import SignatureBox, { SignatureBoxProps } from './SignatureBox';

const SAMPLE_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23d1fae5"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="%2302554b">Firma</text></svg>';

const meta: Meta<typeof SignatureBox> = {
  title: 'Components/SignatureBox',
  component: SignatureBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Reusable signature box that renders an optional signature image and contextual information about the signer.',
      },
    },
  },
  args: {
    title: 'Juan Perez',
  },
  argTypes: {
    imageUrl: {
      control: 'text',
      description: 'URL or data URI for the signature image.',
    },
    captionTop: {
      control: 'text',
      description: 'Text shown above the signature (e.g. job title).',
    },
    captionBottom: {
      control: 'text',
      description: 'Text shown below the signature (e.g. date).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithSignature: Story = {
  args: {
    imageUrl: SAMPLE_SIGNATURE,
    captionTop: 'Project responsible',
    captionBottom: 'Signed on Apr 23, 2025',
  }
};

export const WithoutSignature: Story = {
  args: {
    captionTop: 'Project responsible',
    captionBottom: 'Pending signature',
  } 
};

export const WithCustomNotes: Story = {
  name: 'With additional notes',
  args: {
    imageUrl: SAMPLE_SIGNATURE,
    captionTop: 'Field supervisor',
    captionBottom: 'Last update: May 14, 2025',
  } 
};
