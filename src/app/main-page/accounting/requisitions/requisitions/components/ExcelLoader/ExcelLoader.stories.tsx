import type { Meta, StoryObj } from '@storybook/react';
import ExcelLoader from './ExcelLoader';
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext';
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore';
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';

useRequisitionsStore.setState({
  updateExcelRequisition: async (excel: File) => null,
  resetFlags: () => {},
  updatingExcel: false,
  successUpdateExcel: false,
  error: undefined,
  warning: undefined,
});

useIntranetGatewayStore.setState({ isReady: true });

const meta: Meta<typeof ExcelLoader> = {
  title: 'MainPage/Accounting/Requisitions/ExcelLoader',
  component: ExcelLoader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <PrincipalProvider>
        <Story />
      </PrincipalProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ExcelLoader>;

export const LightMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ backgroundColor: 'var(--color-gray-10)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ backgroundColor: 'var(--color-gray-10)', minHeight: '20vh', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
