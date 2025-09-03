import type { Meta, StoryObj } from '@storybook/react';
import { vi } from 'vitest';
import React from 'react';
import PictureTable from './PicturesTable';

vi.mock('./usePictureTable', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    opePicture: () => {},
    isMobile: false,
    billingImages: [],
    setOpenRejectPicture: () => {},
    openRejectPicture: { state: false, row: null },
    handleSubmitReject: () => {},
    hideImage: () => {},
    currentPagePermissions: { canLinkImage: true, canAddDocuments: true, canSeeTicketsList: true },
  }),
}));

const meta: Meta<typeof PictureTable> = {
  title: 'MainPage/Accounting/Invoices/PicturesTable',
  component: PictureTable,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PictureTable>;

export const LightMode: Story = {
  args: { setSelectedPictures: () => {} },
  decorators: [(Story) => <div data-theme='light'><Story /></div>],
};

export const DarkMode: Story = {
  args: { setSelectedPictures: () => {} },
  decorators: [(Story) => <div data-theme='dark'><Story /></div>],
};

