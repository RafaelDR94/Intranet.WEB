import { statesList } from './statesList';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';
import type { Proyect } from '@/app/mappings/proyects/proyects.types';
import type { RequitionPost } from '@/app/mappings/requisitions/requisitions.types';
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper';
import { useAuth } from '@/app/context/AuthContext/AuthContext';
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
  getOptionLabel,
}: {
  values: Record<string, unknown>;
  employees: EmployeeType[];
  proyects: Proyect[];
  fields: FieldModel[];
  getOptionLabel: (fieldName: string, value: unknown) => string | undefined;
}): RequitionPost => {
  const employeeId = values.employees;
  const projectId = values.project;
  const requisitionkey = values?.requisitionkey as string || ""
  const assignmentdate = values?.asignamentdate as string || ""
  const endDate = values?.cxpdate as string || ""
  const motive = values?.motive as string || ""
  const state = values?.state as string || ""
  const amountdeposited = values?.depositamount as number || 0
  const provenamount= 0
  const employeename =
    employees.find(e => e.employee_id === employeeId)?.fullname
    ?? getOptionLabel('employees', employeeId)
    ?? String(employeeId ?? '');

  const projectname =
    proyects.find(p => p.id === projectId)?.proyectKey
    ?? getOptionLabel('project', projectId)
    ?? String(projectId ?? '');

  return { requisitionkey, employeename, projectname, endDate, assignmentdate,motive, state,amountdeposited,provenamount};
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
    label: 'Nombre del Deudor',
    placeholder: 'Seleccione el Deudor',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
    showIf: (_v, all) => {
      const f = all.find(x => x.name === 'employees');
      return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
    },
  },
  {
    type: 'select',
    name: 'project',
    label: 'Proyecto',
    placeholder: 'Selecciona el proyecto ',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
    showIf: (_v, all) => {
      const f = all.find(x => x.name === 'project');
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
    type: 'date',
    name: 'asignamentdate',
    label: 'Fecha de asignación',
    placeholder: '00/00/00',
    value: currentDate(),
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'date',
    name: 'cxpdate',
    label: 'Fecha de termino',
    placeholder: '00/00/00',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'number',
    name: 'depositamount',
    label: 'Cantidad a depositar',
    placeholder: 'Escribe la cantidad a depositar',
    value: '',
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'select',
    name: 'state',
    label: 'Estado',
    placeholder: 'Selecciona el estado',
    value: '',
    options: statesList,
    className: 'max-w-[400px]',
    validations: [{ type: 'required' }],
  },
  {
    type: 'textarea',
    name: 'motive',
    label: 'Motivo',
    placeholder: 'Escribe el motivo de la requisicion',
    value: '',
    className: 'max-w-[400px]',
    rows: 1,
    validations: [{ type: 'required' }],
  }
]);