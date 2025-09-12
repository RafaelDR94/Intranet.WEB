import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { PettyCashProvider, usePettyCash } from './PettyCashContext';

vi.mock('@/app/context/AuthContext/AuthContext', () => ({ useAuth: () => ({ user: null, currentPagePermissions: {} }) }));
vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({ usePrincipal: () => ({ usePrincipalAlert: { showAlert: vi.fn(), hideAlert: vi.fn() } }) }));
vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (sel: any) => sel({ employees: [], employeesError: null, fetchEmployees: vi.fn(), reset: vi.fn() }),
}));
vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  useProyectsStore: (sel: any) => sel({ proyects: [], proyectsError: null, fetchProyects: vi.fn(), reset: vi.fn() }),
}));
vi.mock('@/app/stores/useBillingPettyCash/useBillingPettyCash', () => ({
  useBillingPettyCash: (sel: any) => sel({ pettyCashFunds: [], error: null, warning: null, fetchPettyCashFunds: vi.fn(), resetFlags: vi.fn() }),
}));
vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => {
  const state = { setFields: vi.fn(), updateField: vi.fn(), resetFields: vi.fn(), fieldsByFormId: {} };
  const hook: any = (selector: any) => selector(state);
  hook.getState = () => state;
  return { useFormFieldsStore: hook };
});

const TestComponent = () => {
  const ctx = usePettyCash();
  return <div>{ctx.formIdPink}</div>;
};

describe('PettyCashContext', () => {
  it('provides default formIdPink', () => {
    render(
      <PettyCashProvider>
        <TestComponent />
      </PettyCashProvider>,
    );
    expect(screen.getByText('petty-cash-voucher-form-create')).toBeInTheDocument();
  });
});
