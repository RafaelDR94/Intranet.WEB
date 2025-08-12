// src/app/mappings/requisitions/requisitions.mapper.ts
import {
  Requisition,
  RequitionPost,
  RequitionPut,
} from './requisitions.types'

/**
 * RequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado Requisition.
 */
export const RequisitionMap = (raw: any): Requisition => ({
  id_billingrequisition: raw?.id_billingrequisition ?? '',
  requisitionkey:        raw?.requisitionkey        ?? '',
  id_Employee:           raw?.id_Employee           ?? '',
  employeename:          raw?.employeename          ?? '',
  idProject:             raw?.idProject             ?? '',
  projectname:           raw?.projectname           ?? '',
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
  employeename:   String(src?.employeename   ?? ''),
  projectname:    String(src?.projectname    ?? ''),
})

/**
 * RequitionPutMap
 * Construye el payload para actualizar una requisición (PUT).
 */
export const RequitionPutMap = (src: Partial<Requisition> | any): RequitionPut => ({
  id_billingrequisition: String(src?.id_billingrequisition ?? ''),
  requisitionkey:        String(src?.requisitionkey        ?? ''),
  employeename:          String(src?.employeename          ?? ''),
  projectname:           String(src?.projectname           ?? ''),
})
