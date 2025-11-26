import type { CompleteTransport } from '@/app/mappings/transport/transport.types'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { ExternalPersonModel } from '@/app/mappings/externalperson/externalperson.types'
import type { Tools } from '@/app/mappings/accesrequest/accesrequest.types'

export type AccessRequestStoreState = {
  vehicles: CompleteTransport[]
  internalpersons: EmployeeType[]
  externalpersons: ExternalPersonModel[]
  tools: Tools[]

  /** Setters / bulk */
  setVehicles: (vehicles: CompleteTransport[]) => void
  setInternalPersons: (persons: EmployeeType[]) => void
  setExternalPersons: (persons: ExternalPersonModel[]) => void
  setTools: (tools: Tools[]) => void

  /** Single item operations */
  addVehicle: (vehicle: CompleteTransport) => void
  updateVehicle: (transport_id: string, data: Partial<CompleteTransport>) => void
  removeVehicle: (transport_id: string) => void

  addInternalPerson: (person: EmployeeType) => void
  updateInternalPerson: (id: string, data: Partial<EmployeeType>) => void
  removeInternalPerson: (id: string) => void

  addExternalPerson: (person: ExternalPersonModel) => void
  updateExternalPerson: (id: string, data: Partial<ExternalPersonModel>) => void
  removeExternalPerson: (id: string) => void

  addTool: (tool: Tools) => void
  updateTool: (index: number, data: Partial<Tools>) => void
  removeTool: (index: number) => void

  /** Reset helpers */
  resetVehicles: () => void
  resetInternalPersons: () => void
  resetExternalPersons: () => void
  resetTools: () => void
  reset: () => void

  /** Helpers to extract ids or serialized payloads */
  getVehicleIds: () => string[]
  getInternalPersonIds: () => string[]
  getExternalPersonIds: () => string[]
  getToolsAsString: () => string
}

export type SetState = (
  partial: Partial<AccessRequestStoreState> | ((state: AccessRequestStoreState) => Partial<AccessRequestStoreState>)
) => void

export type GetState = () => AccessRequestStoreState
