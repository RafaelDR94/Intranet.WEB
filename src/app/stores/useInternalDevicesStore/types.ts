import type {
  DevicesAssignedFilters,
  InternalDevice,
  InternalDeviceAssignment,
  InternalDeviceAssignmentPost,
  InternalDeviceAssignmentPut,
  InternalDeviceBrand,
  InternalDeviceBrandPost,
  InternalDeviceBrandPut,
  InternalDevicePost,
  InternalDevicePut,
  InternalDeviceReview,
  InternalDeviceReviewPost,
  InternalDeviceReviewPut,
  InternalDeviceStatus,
  InternalDeviceStatusPost,
  InternalDeviceStatusPut,
  InternalDeviceType,
  InternalDeviceTypePost,
  InternalDeviceTypePut,
} from '@/app/mappings/internaldevices/internaldevices.types'

export type InternalDevicesState = {
  devices: InternalDevice[]
  device?: InternalDevice
  devicesAssigned: InternalDevice[]
  devicesByProyect: InternalDevice[]
  assignedFilters: DevicesAssignedFilters | null
  lastProyectId: string | null

  deviceTypes: InternalDeviceType[]
  deviceType?: InternalDeviceType

  deviceBrands: InternalDeviceBrand[]
  deviceBrand?: InternalDeviceBrand

  deviceStatuses: InternalDeviceStatus[]
  deviceStatus?: InternalDeviceStatus

  deviceReviews: InternalDeviceReview[]
  deviceReviewsByDevice: InternalDeviceReview[]
  lastReviewDeviceId: string | null

  deviceAssignments: InternalDeviceAssignment[]
  deviceAssignment?: InternalDeviceAssignment

  loadingDevices: boolean
  loadingDevice: boolean
  loadingAssignedDevices: boolean
  loadingDevicesByProyect: boolean
  creatingDevice: boolean
  updatingDevice: boolean
  deletingDevice: boolean
  activatingDevice: boolean
  reviewingDevice: boolean

  successGetDevices: boolean
  successGetDevice: boolean
  successGetAssignedDevices: boolean
  successGetDevicesByProyect: boolean
  successCreateDevice: boolean
  successUpdateDevice: boolean
  successDeleteDevice: boolean
  successActivateDevice: boolean
  successReviewDevice: boolean

  loadingDeviceTypes: boolean
  loadingDeviceType: boolean
  creatingDeviceType: boolean
  updatingDeviceType: boolean
  deletingDeviceType: boolean
  activatingDeviceType: boolean

  successGetDeviceTypes: boolean
  successGetDeviceType: boolean
  successCreateDeviceType: boolean
  successUpdateDeviceType: boolean
  successDeleteDeviceType: boolean
  successActivateDeviceType: boolean

  loadingDeviceBrands: boolean
  loadingDeviceBrand: boolean
  creatingDeviceBrand: boolean
  updatingDeviceBrand: boolean
  deletingDeviceBrand: boolean
  activatingDeviceBrand: boolean

  successGetDeviceBrands: boolean
  successGetDeviceBrand: boolean
  successCreateDeviceBrand: boolean
  successUpdateDeviceBrand: boolean
  successDeleteDeviceBrand: boolean
  successActivateDeviceBrand: boolean

  loadingDeviceStatuses: boolean
  loadingDeviceStatus: boolean
  creatingDeviceStatus: boolean
  updatingDeviceStatus: boolean
  deletingDeviceStatus: boolean
  activatingDeviceStatus: boolean

  successGetDeviceStatuses: boolean
  successGetDeviceStatus: boolean
  successCreateDeviceStatus: boolean
  successUpdateDeviceStatus: boolean
  successDeleteDeviceStatus: boolean
  successActivateDeviceStatus: boolean

  loadingDeviceReviews: boolean
  loadingDeviceReviewsByDevice: boolean
  creatingDeviceReview: boolean
  updatingDeviceReview: boolean
  deletingDeviceReview: boolean

  successGetDeviceReviews: boolean
  successGetDeviceReviewsByDevice: boolean
  successCreateDeviceReview: boolean
  successUpdateDeviceReview: boolean
  successDeleteDeviceReview: boolean

  loadingDeviceAssignments: boolean
  loadingDeviceAssignment: boolean
  creatingDeviceAssignment: boolean
  updatingDeviceAssignment: boolean
  deletingDeviceAssignment: boolean

  successGetDeviceAssignments: boolean
  successGetDeviceAssignment: boolean
  successCreateDeviceAssignment: boolean
  successUpdateDeviceAssignment: boolean
  successDeleteDeviceAssignment: boolean

  error?: string
  warning?: string

  fetchDevices: (force?: boolean) => Promise<InternalDevice[] | null>
  fetchDeviceById: (id: string, force?: boolean) => Promise<InternalDevice | null>
  fetchDevicesAssigned: (
    filters?: DevicesAssignedFilters,
    force?: boolean,
  ) => Promise<InternalDevice[] | null>
  fetchDevicesByProyect: (
    proyectId: string,
    force?: boolean,
  ) => Promise<InternalDevice[] | null>
  createDevice: (payload: InternalDevicePost) => Promise<InternalDevice | null>
  updateDevice: (payload: InternalDevicePut) => Promise<InternalDevice | null>
  deleteDevice: (
    id: string,
    lowMotive?: string,
    idUser?: string,
  ) => Promise<boolean>
  activateDevice: (id: string) => Promise<boolean>
  reviewDevice: (idDevice: string, reviewed: boolean) => Promise<boolean>

  fetchDeviceTypes: (
    isActive?: boolean,
    force?: boolean,
  ) => Promise<InternalDeviceType[] | null>
  fetchDeviceTypeById: (
    id: string,
    force?: boolean,
  ) => Promise<InternalDeviceType | null>
  createDeviceType: (
    payload: InternalDeviceTypePost,
  ) => Promise<InternalDeviceType | null>
  updateDeviceType: (
    payload: InternalDeviceTypePut,
  ) => Promise<InternalDeviceType | null>
  deleteDeviceType: (id: string) => Promise<boolean>
  activateDeviceType: (id: string) => Promise<boolean>

  fetchDeviceBrands: (
    isActive?: boolean,
    force?: boolean,
  ) => Promise<InternalDeviceBrand[] | null>
  fetchDeviceBrandById: (
    id: string,
    force?: boolean,
  ) => Promise<InternalDeviceBrand | null>
  createDeviceBrand: (
    payload: InternalDeviceBrandPost,
  ) => Promise<InternalDeviceBrand | null>
  updateDeviceBrand: (
    payload: InternalDeviceBrandPut,
  ) => Promise<InternalDeviceBrand | null>
  deleteDeviceBrand: (id: string) => Promise<boolean>
  activateDeviceBrand: (id: string) => Promise<boolean>

  fetchDeviceStatuses: (
    isActive?: boolean,
    force?: boolean,
  ) => Promise<InternalDeviceStatus[] | null>
  fetchDeviceStatusById: (
    id: string,
    force?: boolean,
  ) => Promise<InternalDeviceStatus | null>
  createDeviceStatus: (
    payload: InternalDeviceStatusPost,
  ) => Promise<InternalDeviceStatus | null>
  updateDeviceStatus: (
    payload: InternalDeviceStatusPut,
  ) => Promise<InternalDeviceStatus | null>
  deleteDeviceStatus: (id: string) => Promise<boolean>
  activateDeviceStatus: (id: string) => Promise<boolean>

  fetchDeviceReviews: (force?: boolean) => Promise<InternalDeviceReview[] | null>
  fetchDeviceReviewsByDeviceId: (
    deviceId: string,
    force?: boolean,
  ) => Promise<InternalDeviceReview[] | null>
  createDeviceReview: (
    payload: InternalDeviceReviewPost,
  ) => Promise<InternalDeviceReview | null>
  updateDeviceReview: (
    payload: InternalDeviceReviewPut,
  ) => Promise<InternalDeviceReview | null>
  deleteDeviceReview: (id: string) => Promise<boolean>

  fetchDeviceAssignments: (
    force?: boolean,
  ) => Promise<InternalDeviceAssignment[] | null>
  fetchDeviceAssignmentById: (
    id: string,
    force?: boolean,
  ) => Promise<InternalDeviceAssignment | null>
  createDeviceAssignment: (
    payload: InternalDeviceAssignmentPost,
  ) => Promise<InternalDeviceAssignment | null>
  updateDeviceAssignment: (
    payload: InternalDeviceAssignmentPut,
  ) => Promise<InternalDeviceAssignment | null>
  deleteDeviceAssignment: (
    id: string,
    lowMotive?: string,
    idUser?: string,
  ) => Promise<boolean>

  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<InternalDevicesState>
    | ((state: InternalDevicesState) => Partial<InternalDevicesState>),
) => void

export type Get = () => InternalDevicesState
