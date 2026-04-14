import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { DataTableProps } from '@/app/components/DataTable/types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';

import GeneralDirectoryPage from './page';

type DirectoryRow = {
  id: string;
  fullname: string;
  position: string;
  phone_number: string;
  email: string;
  employee_number: string;
  image_url: string;
  employee: EmployeeType;
};

const DataTable = vi.hoisted(() =>
  vi.fn((_props: DataTableProps<DirectoryRow>) => <div>DataTableMock</div>)
);

const useEmployeesStore = vi.hoisted(() => vi.fn());

vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable,
}));

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: (state: unknown) => unknown) =>
    selector(useEmployeesStore()),
}));

vi.mock(
  '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery',
  () => ({
    useIsMobile: () => false,
  })
);

describe('GeneralDirectoryPage', () => {
  beforeEach(() => {
    DataTable.mockClear();
    useEmployeesStore.mockReset();
  });

  it('fetches active employees on mount when empty', () => {
    const fetchActiveEmployees = vi.fn();

    useEmployeesStore.mockReturnValue({
      activeEmployees: [],
      loadingActive: false,
      error: undefined,
      fetchActiveEmployees,
    });

    render(<GeneralDirectoryPage />);

    expect(fetchActiveEmployees).toHaveBeenCalled();
  });

  it('passes active employees to the table', () => {
    const fetchActiveEmployees = vi.fn();
    const employee = {
      id: 'emp-1',
      employee_id: 'emp-1',
      employee_number: '30000',
      firstname: 'Rafael',
      secondname: '',
      lastname: 'Gomez',
      motherlast_name: '',
      gender: 'M',
      email: 'rafael.gomez@drsecurity.net',
      phone_number: '5555555555',
      extension: '',
      image_url: 'https://cdn.example.com/avatar.png',
      manager_id: '',
      department: {
        department_id: 'dep-1',
        name: 'Desarrollo',
        enterprise_id: 'ent-1',
        enterprice_name: 'ITEDESCA',
      },
      workposition: { workposition_id: 'pos-1', name: 'Lead Desarrollo' },
      user: null,
      is_active: true,
      fullname: 'Rafael Gomez',
      gtstype: undefined,
    } satisfies EmployeeType;

    useEmployeesStore.mockReturnValue({
      activeEmployees: [employee],
      loadingActive: false,
      error: undefined,
      fetchActiveEmployees,
    });

    render(<GeneralDirectoryPage />);

    expect(DataTable).toHaveBeenCalledTimes(1);
    const props = DataTable.mock.calls[0][0] as DataTableProps<DirectoryRow>;
    expect(props.tables[0].data).toHaveLength(1);
    expect(props.tables[0].data[0].fullname).toBe('Rafael Gomez');
  });
});
