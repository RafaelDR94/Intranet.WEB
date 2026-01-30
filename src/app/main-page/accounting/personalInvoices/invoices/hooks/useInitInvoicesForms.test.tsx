import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { FieldModel } from '@/app/components/DynamicForm/types';

const setFields = vi.fn();
const updateField = vi.fn();
const resetFields = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/main-page/accounting/personalInvoices/invoices',
  useSearchParams: () => ({
    get: () => null,
  }),
}));

vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({
  useRequisitionsStore: () => ({
    currentRequisition: null,
  }),
}));

vi.mock('../context/InvoicesContext', () => ({
  useInvoices: () => ({
    user: { fullName: 'User' },
    requisitions: [],
    billingDocumentDescription: [],
    billingCategories: [],
    setFields,
    updateField,
    resetFields,
    field1: [],
    field2: [],
    formId1: 'form1',
    formId2: 'form2',
  }),
}));

import useInitInvoicesForms from './useInitInvoicesForms';

const buildField = (name: string, options?: FieldModel['options']): FieldModel => ({
  type: 'input',
  name,
  label: name,
  value: '',
  options,
});

describe('useInitInvoicesForms', () => {
  it('calls setFields on ResetForm', () => {
    const initialFields: FieldModel[] = [buildField('debtorName')];
    const field: FieldModel[] = [];
    const { result } = renderHook(() =>
      useInitInvoicesForms({ initialformFields: initialFields, field, formId: 'form1' })
    );
    act(() => {
      result.current.ResetForm();
    });
    expect(setFields).toHaveBeenCalledWith('form1', initialFields);
  });

  it('marks form info as ready when only category options are present', () => {
    const initialFields: FieldModel[] = [
      buildField('category', [
        {
          label: 'Hospedaje',
          value: 'cat-1',
        },
      ]),
      buildField('ticket'),
    ];
    const { result } = renderHook(() =>
      useInitInvoicesForms({ initialformFields: initialFields, field: initialFields, formId: 'form1' })
    );

    expect(result.current.loadingFormInfo).toBe(false);
  });
});
