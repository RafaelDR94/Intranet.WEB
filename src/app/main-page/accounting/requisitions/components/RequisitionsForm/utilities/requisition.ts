import type { FieldModel } from '@/app/components/DynamicForm/types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';
import type { Proyect } from '@/app/mappings/proyects/proyects.types';
import type { RequitionPost } from '@/app/mappings/requisitions/requisitions.types';

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
  const requisitionkey = values.requisitionkey as string;

  const employeeName =
    employees.find(e => e.employee_id === employeeId)?.fullname
    ?? getOptionLabel('employees', employeeId)
    ?? String(employeeId ?? '');

  const projectName =
    proyects.find(p => p.id === projectId)?.proyectKey
    ?? getOptionLabel('project', projectId)
    ?? String(projectId ?? '');

  return { requisitionkey, employeename: employeeName, projectname: projectName };
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
    label: 'Seleccionar Proyecto',
    placeholder: 'Proyecto',
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
]);

