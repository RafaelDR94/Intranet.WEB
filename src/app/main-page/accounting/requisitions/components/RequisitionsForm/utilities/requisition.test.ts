import { describe, it, expect } from 'vitest';
import {
  computeLoadingFormInfo,
  getOptionLabel,
  buildRequisitionPayload,
  createInitialFields,
} from './requisition';
import type { FieldModel } from '@/app/components/DynamicForm/types';

describe('requisition utilities', () => {
  it('computeLoadingFormInfo detects missing options', () => {
    const fields: FieldModel[] = [
      { name: 'employees', type: 'select', options: [] } as any,
      { name: 'project', type: 'select', options: [] } as any,
    ];
    expect(computeLoadingFormInfo(fields)).toBe(true);
    fields[0].options = [{ label: 'A', value: 1 }];
    fields[1].options = [{ label: 'B', value: 2 }];
    expect(computeLoadingFormInfo(fields)).toBe(false);
  });

  it('getOptionLabel returns label for value', () => {
    const fields: FieldModel[] = [
      { name: 'employees', type: 'select', options: [{ label: 'John', value: 1 }] } as any,
    ];
    expect(getOptionLabel(fields, 'employees', 1)).toBe('John');
  });

  it('buildRequisitionPayload maps ids to names', () => {
    const employees = [{ employee_id: 1, fullname: 'John' } as any];
    const proyects = [{ id: 10, proyectKey: 'P1' } as any];
    const fields: FieldModel[] = [];
    const payload = buildRequisitionPayload({
      values: { employees: 1, project: 10, requisitionkey: 'R1' },
      employees,
      proyects,
      fields,
      getOptionLabel: () => undefined,
    });
    expect(payload).toEqual({
      requisitionkey: 'R1',
      employeename: 'John',
      projectname: 'P1',
      endDate: '',
      assignmentdate: '',
      motive: '',
      state: '',
      amountdeposited: 0,
      provenamount: 0,
    });
  });

  it('createInitialFields returns expected structure', () => {
    const fields = createInitialFields();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toHaveLength(8);
  });
});
