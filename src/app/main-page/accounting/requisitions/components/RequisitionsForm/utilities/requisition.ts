import { statesList } from './statesList';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';
import type { Proyect } from '@/app/mappings/proyects/proyects.types';
import type { RequitionPost, RequitionPut } from '@/app/mappings/requisitions/requisitions.types';
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper';
// Ya existentes en tu archivo (mantén tus implementaciones)
/**
 * Determina si el formulario aún está cargando información
 * (empleados o proyectos).
 *
 * @param fields campos actuales del formulario.
 * @returns `true` si faltan opciones, `false` si todo está listo.
 */
export const computeLoadingFormInfo = (fields: FieldModel[]) => {
  const emp = fields.find(f => f.name === 'employees');
  const prj = fields.find(f => f.name === 'project');
  const employeesReady = Array.isArray(emp?.options) && (emp?.options?.length ?? 0) > 0;
  const projectsReady = Array.isArray(prj?.options) && (prj?.options?.length ?? 0) > 0;
  return !(employeesReady && projectsReady);
};

/**
 * Obtiene la etiqueta asociada a un valor dentro de un campo select.
 *
 * @param fields lista de campos del formulario.
 * @param fieldName nombre del campo a consultar.
 * @param value valor cuyo label se busca.
 * @returns etiqueta encontrada o `undefined`.
 */
export const getOptionLabel = (
  fields: FieldModel[],
  fieldName: string,
  value: unknown
): string | undefined => {
  const f = fields.find(x => x.name === fieldName);
  const opt = (f?.options as Array<{ label: string; value: unknown }> | undefined)
    ?.find(o => o.value === value);
  return opt?.label;
};

/**
 * Construye el payload que se enviará al backend
 * a partir de los valores del formulario y catálogos.
 */
export const buildRequisitionPayload = ({
  values,
  employees,
  proyects,
  initialValues,
  includePutFields = false,
  getOptionLabel,
}: {
  values: Record<string, unknown>;
  employees: EmployeeType[];
  proyects: Proyect[];
  initialValues?: Partial<{
    requisitionkey: string;
    employeename: string;
    projectname: string;
    assignmentdate: string;
    endDate: string;
    motive: string;
    state: string;
    amountdeposited: string | number;
    provenamount: string | number;
    amountdifference: string | number;
    gts_type: string;
    id_Employee: string;
    idProject: string;
  }>;
  includePutFields?: boolean;
  fields: FieldModel[];
  getOptionLabel: (fieldName: string, value: unknown) => string | undefined;
}): RequitionPost & Partial<Pick<RequitionPut, 'amountdifference' | 'gts_type'>> => {
  const employeeId = (values.employees ?? initialValues?.id_Employee ?? '') as string;
  const projectId = (values.project ?? initialValues?.idProject ?? '') as string;

  const requisitionkey =
    (values?.requisitionkey as string | undefined)?.trim()
    || initialValues?.requisitionkey
    || '';
  const assignmentdate =
    (values?.asignamentdate as string | undefined)?.trim()
    || initialValues?.assignmentdate
    || '';
  const endDate =
    (values?.cxpdate as string | undefined)?.trim()
    || initialValues?.endDate
    || '';
  const motive =
    (values?.motive as string | undefined)?.trim()
    || initialValues?.motive
    || '';
  const state =
    (values?.state as string | undefined)?.trim()
    || initialValues?.state
    || '';

  const parsedDeposit = Number(values?.depositamount);
  const amountdeposited = Number.isFinite(parsedDeposit)
    ? parsedDeposit
    : Number(initialValues?.amountdeposited ?? 0);

  const parsedProven = Number(initialValues?.provenamount);
  const provenamount = Number.isFinite(parsedProven) ? parsedProven : 0;
  const parsedDifference = Number(initialValues?.amountdifference);
  const amountdifference = Number.isFinite(parsedDifference) ? parsedDifference : 0;
  const gts_type = initialValues?.gts_type ?? '';

  const employeename =
    employees.find((e) => e.employee_id === employeeId)?.fullname
    ?? getOptionLabel('employees', employeeId)
    ?? initialValues?.employeename
    ?? String(employeeId ?? '');

  const projectname =
    proyects.find((p) => p.id === projectId)?.proyectKey
    ?? getOptionLabel('project', projectId)
    ?? initialValues?.projectname
    ?? String(projectId ?? '');

  const basePayload = {
    requisitionkey,
    employeename,
    projectname,
    endDate,
    assignmentdate,
    motive,
    state,
    amountdeposited,
    provenamount,
  };
  if (!includePutFields) {
    return basePayload;
  }
  return {
    ...basePayload,
    amountdifference,
    gts_type,
  };
};

// --- NUEVO: helpers puros y alerts pequeñas

/**
 * Crea la definición de campos iniciales para el formulario.
 * @returns arreglo con modelos de campo.
 */
export const createInitialFields = (): FieldModel[] => ([
  {
    type: 'select',
    name: 'employees',
    label: 'Nombre del Colaborador',
    placeholder: 'Escribe el Nombre del Colaborador',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
    showIf: (_v, all) => {
      const f = all.find(x => x.name === 'employees');
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  {
    type: 'input',
    name: 'requisitionkey',
    label: 'Código de Requisición',
    placeholder: 'Escribe el Código de Requisición',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'select',
    name: 'project',
    label: 'Código del Proyecto',
    placeholder: 'Escribe el Código del Proyecto ',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
    showIf: (_v, all) => {
      const f = all.find(x => x.name === 'project');
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  {
    type: 'date',
    name: 'asignamentdate',
    label: 'Fecha Asignación',
    placeholder: '00/00/00',
    value: currentDate(),
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'date',
    name: 'cxpdate',
    label: 'Fecha Termino',
    placeholder: '00/00/00',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'number',
    name: 'depositamount',
    label: 'Cantidad Deposito',
    placeholder: 'Escribe la Cantidad a Depositar',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'select',
    name: 'state',
    label: 'Estado',
    placeholder: 'Selecciona el Estado',
    value: '',
    options: statesList,
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'motive',
    label: 'Motivo',
    placeholder: 'Escribe el Motivo de la Requisicion',
    value: '',
    className: 'max-w-[400px]',
    rows: 1,
    validations: [{ type: 'required' }],
  }
]);
