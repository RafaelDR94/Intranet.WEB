import { FieldModel } from '@/app/components/DynamicForm/types';
import { User } from '@/app/context/AuthContext/types';
import { EmployeeType } from '@/app/mappings/employees/employee.types';
import { Proyect } from '@/app/mappings/proyects/proyects.types';
import { PettyCashFundData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/** Shape of the petty cash context. */
export interface PettyCashContextType {
  /** Available employees. */
  employees: EmployeeType[];
  /** Available projects. */
  proyects: Proyect[];
  /** Available petty cash funds. */
  pettyCashFunds: PettyCashFundData[];
  /** Fields for pink voucher form. */
  pinkFields: FieldModel[];
  /** Fields for blue voucher form. */
  blueFields: FieldModel[];
  /** Identifier for pink voucher form. */
  formIdPink: string;
  /** Identifier for blue voucher form. */
  formIdBlue: string;
  /** Setter to replace fields. */
  setFields: (formId: string, newFields: FieldModel[]) => void;
  /** Update a single field. */
  updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void;
  /** Reset fields by form id. */
  resetFields: (formId: string) => void;
  /** Authenticated user. */
  user: User | null;
}
