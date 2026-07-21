import { EditableViaticsColumnField, EditableViaticsTableLabels } from './types';

export const baseContainerClasses =
  'w-full rounded-lg bg-white-100 px-6 py-5 shadow-sm ring-1 ring-gray-20';

export const tableClasses = 'w-full min-w-[920px] border-collapse';

export const labelHeaderClasses =
  'text-[12px] leading-4 font-medium text-green-100 uppercase';

export const labelHeaderClassesLeft =
  'text-left text-[12px] leading-4 font-medium text-green-100 uppercase';

export const bodyTextClasses = 'text-[14px] leading-5 font-normal text-gray-70';

export const mutedBodyTextClasses =
  'text-[14px] leading-5 font-normal text-gray-40';

export const inputClasses =
  'w-full border border-transparent bg-transparent px-1 py-0.5 text-[14px] leading-5 text-gray-70 outline-none transition-colors focus:border-blue-60 focus:bg-white';

export const columnWidths: Record<EditableViaticsColumnField, string> = {
  concept: 'w-[24%]',
  nationalQuoted: 'w-[10%]',
  foreignQuoted: 'w-[10%]',
  people: 'w-[10%]',
  days: 'w-[10%]',
  subtotal: 'w-[12%]',
  observations: 'w-[24%]',
};

export const defaultLabels: EditableViaticsTableLabels = {
  concept: 'Concepto',
  perDiem: 'Viáticos',
  nationalQuoted: 'Nacional cotizado',
  foreignQuoted: 'Extranjero cotizado',
  people: 'N. Personas',
  days: 'N. Días',
  subtotal: 'Subtotal',
  observations: 'Observaciones',
  total: 'Total',
  subtotalSummary: 'Subtotal',
  includesTax: 'Este monto ya incluye IVA',
  addConcept: 'Agregar otro concepto',
  newConceptPlaceholder: 'Nuevo concepto',
  note:
    'Nota: Los montos solicitados deberán apegarse a lo establecido en el Anexo 1- Asignación de Viáticos Nacionales y Extranjeros del Procedimiento de Administración de viáticos. Cualquier monto que exceda lo definido en dicho anexo deberá contar con autorización expresa.',
};
