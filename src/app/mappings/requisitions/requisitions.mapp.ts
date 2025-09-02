// src/app/mappings/requisitions/requisitions.mapper.ts
import {
  Requisition,
  RequitionPost,
  RequitionPut,
} from './requisitions.types'
import { toInputDateString } from '@/app/utilities/FormatHelpers/FormatHelpets'
/**
 * RequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado Requisition.
 */
export const RequisitionMap = (raw: any): Requisition => ({
  billingrequisition_id: raw?.billingrequisition_id ?? '',
  requisitionkey: raw?.requisitionkey ?? '',
  id_Employee: raw?.employee_id ?? '',
  employeename: raw?.employeename ?? '',
  idProject: raw?.idproject ?? '',
  projectname: raw?.projectname ?? '',
  assignmentdate: toInputDateString(raw?.assignmentdate) ?? '',
  endDate:  toInputDateString(raw?.enddate) ?? '',
  motive: raw?.motive ?? '',
  state: raw?.state ?? '',
  amountdeposited: raw?.amountdeposited ?? '',
  provenamount: raw?.provenamount ?? '',
  amountdifference: raw?.amountdifference ?? '',
  date_created: raw?.date_created ?? '',
  status:raw?.status
  
})

/**
 * RequisitionsMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const RequisitionsMap = (list: any[]): Requisition[] =>
  Array.isArray(list) ? list.map(RequisitionMap) : []

/**
 * RequitionPostMap
 * Construye el payload para crear una requisición (POST).
 * Acepta un objeto parcial (por ejemplo, valores del formulario)
 * y garantiza el shape correcto del payload.
 */
export const RequitionPostMap = (src: Partial<Requisition> | any): RequitionPost => ({
  requisitionkey: String(src?.requisitionkey ?? ''),
  employeename: String(src?.employeename ?? ''),
  projectname: String(src?.projectname ?? ''),
  assignmentdate: String(src?.assignmentdate ?? ''),
  endDate: String(src?.endDate ?? ''),
  motive: String(src?.motive ?? ''),
  state: String(src?.state ?? ''),
  amountdeposited: Number(src?.amountdeposited ?? ''),
  provenamount: Number(src?.provenamount ?? ''),
})

/**
 * RequitionPutMap
 * Construye el payload para actualizar una requisición (PUT).
 */
export const RequitionPutMap = (src: Partial<Requisition> | any): RequitionPut => ({
  billingrequisition_id: String(src?.billingrequisition_id ?? ''),
  requisitionkey: String(src?.requisitionkey ?? ''),
  employeename: String(src?.employeename ?? ''),
  projectname: String(src?.projectname ?? ''),
  assignmentdate: String(src?.assignmentdate ?? ''),
  endDate: String(src?.endDate ?? ''),
  motive: String(src?.motive ?? ''),
  state: String(src?.state ?? ''),
  amountdeposited: Number(src?.amountdeposited ?? ''),
  provenamount: Number(src?.provenamount ?? ''),
})
