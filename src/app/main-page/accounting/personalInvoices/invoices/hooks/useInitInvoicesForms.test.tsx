import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const setFields = vi.fn();
const updateField = vi.fn();
const resetFields = vi.fn();

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

describe('useInitInvoicesForms', () => {
  it('calls setFields on ResetForm', () => {
    const initialFields: any[] = [{ name: 'debtorName' }];
    const field: any[] = [];
    const { result } = renderHook(() =>
      useInitInvoicesForms({ initialformFields: initialFields, field, formId: 'form1' })
    );
    act(() => {
      result.current.ResetForm();
    });
    expect(setFields).toHaveBeenCalledWith('form1', initialFields);
  });
});
