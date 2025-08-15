import { Proyect } from "../proyects/proyects.types"
export type HistoryRow = {
  id: string,
  billing_image_id: string
  billingdocument_id: string
  project: Proyect // Vista de Proyecto (objeto)
  requisitionkey: string
  status: 'valido' | 'invalido' | 'prohibido' | 'actualizado' | 'pendiente'
  xml: string
  pdf: string
  image: string
  comments: string
  dateCreate: string
  certificationDate: string,
  uuid: string,
}