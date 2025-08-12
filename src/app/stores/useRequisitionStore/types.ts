import { Requisition,RequitionPost, RequitionPut} from "@/app/mappings/requisitions/requisitions.types"


// src/app/stores/useRequisitionStore/types.ts
export type RequisitionsState = {
  requisitions: Requisition[]
  loading: boolean
  creating: boolean
  updating: boolean
  removing: boolean
  updatingExcel: boolean

  successGet: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  successUpdateExcel: boolean

  error?: string
  warning?:string

  fetchRequisitions: (force?: boolean) => Promise<void> | void
  createRequisition: (payload: any) => Promise<RequitionPost | null>
  updateRequisition: (payload: any) => Promise<RequitionPut | null>
  deleteRequisition: (id: string) => Promise<boolean>
  updateExcelRequisition: (excel: File) => Promise<Requisition | null>

  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<RequisitionsState> |
  ((s: RequisitionsState) => Partial<RequisitionsState>)
) => void
export type Get = () => RequisitionsState