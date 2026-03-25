import { Authorization } from "../authorizations/authorizations.types"
export type BillingDocumentRequisition = {
  billingdocument_id: string
  billingimages_id: string | null
  category: string | null
  description: string | null
  numpersons: number
  numnights: number
  iva: number
  total: number
  subtotal: number
  otherinvoices: number
  xml: string | null
  image: string | null
  pdf: string | null
  status: string | null
  comments: string | null
  rfc_emisor: string | null
  rfc_receptor: string | null
  conceptos: string | null
  uuid: string | null
  importe: string | null
  xmlinformation: string | null
  certification_date: string | null
  date_created: string
  sat_validation: boolean
  SAP_Pending: boolean
  complete_SAP: boolean
  billingAcuse: string | null
  forbidden_code: boolean
  user_comments: string
  validatedbyoperations: boolean
  employeename: string
  authorization: Authorization | null
}

export type Requisition = {
  billingrequisition_id: string
  requisitionkey: string
  id_Employee: string
  employeename: string
  idProject: string
  projectname: string
  assignmentdate: string
  endDate: string
  motive: string
  state: string
  status: string
  amountdeposited: string
  provenamount: string
  amountdifference: string
  date_created: string
  gts_type: string
  email: string
  phone_number: string
  image_url: string
  period: string
  current_days: number
  billingDocumentRquisition: BillingDocumentRequisition[]
}

export type RequitionPost = {
  requisitionkey: string
  employeename: string
  projectname: string
  assignmentdate: string
  endDate: string
  motive: string
  state: string
  amountdeposited: number
  provenamount: number
}

export type RequitionPut = {
  billingrequisition_id: string
  requisitionkey: string
  employeename: string
  projectname: string
  assignmentdate: string
  endDate: string
  motive: string
  state: string
  amountdeposited: number
  provenamount: number
  amountdifference: number
  gts_type: string
}

export type Benefit ={
  id_employee: string,
  fullname: string,
  email: string,
  phone_number: string,
  image_url: string,
}
