import type { Enterprise } from '../enterprises/enterprises.types'

export type InternalDeviceType = {
  device_type_id: string
  name: string
  description: string
  is_active: boolean
}

export type InternalDeviceBrand = {
  device_brand_id: string
  name: string
  description: string
  is_active: boolean
}

export type InternalDeviceStatus = {
  device_status_id: string
  name: string
  description: string
  is_active: boolean
}

export type InternalDeviceProyect = {
  id: string
  name: string
  proyectkey: string
  client: string
}

export type InternalDevice = {
  device_id: string
  name: string
  model: string
  serial_number: string
  ip_address: string
  mac_address: string
  mac_wifi_address: string
  operating_system: string
  charge_sn: string
  description: string
  low_motive: string
  assigned: boolean
  assigned_to?: string | null
  device_type: InternalDeviceType | null
  device_brand: InternalDeviceBrand | null
  device_status: InternalDeviceStatus | null
  device_proyect: InternalDeviceProyect | null
  is_active: boolean
  reviewed: boolean
  lowdate: string | null
  lowuser: string | null
  assurance: string
  enterprise: Enterprise | null
}

export type InternalDevicePost = {
  name: string
  model: string
  serial_number: string
  ip_address: string
  mac_address: string
  mac_wifi_address: string
  operating_system: string
  charge_sn: string
  description: string
  low_motive: string
  assigned: boolean
  reviewed: boolean
  device_type_id: string
  device_brand_id: string
  assurance: string
  id_enterprise: string
  proyect_id: string | null
}

export type InternalDevicePut = {
  device_id: string
  name: string
  model: string
  serial_number: string
  ip_address: string
  mac_address: string
  mac_wifi_address: string
  operating_system: string
  charge_sn: string
  description: string
  low_motive: string
  assigned: boolean
  reviewed: boolean
  device_type_id: string
  device_brand_id: string
  device_status_id: string
  is_active: boolean
  assurance: string
  id_enterprise: string
  proyect_id: string | null
}

export type InternalDeviceTypePost = {
  name: string
  description: string
}

export type InternalDeviceTypePut = {
  device_type_id: string
  name: string
  description: string
}

export type InternalDeviceBrandPost = {
  name: string
  description: string
}

export type InternalDeviceBrandPut = {
  device_brand_id: string
  name: string
  description: string
}

export type InternalDeviceStatusPost = {
  name: string
  description: string
}

export type InternalDeviceStatusPut = {
  device_status_id: string
  name: string
  description: string
}

export type InternalDeviceReview = {
  device_review_id: string
  description: string
  device_id: string
  user_id: string
  status_id: string
  date?: string
  created_at?: string
  responsible?: string
  user_name?: string
}

export type InternalDeviceReviewPost = {
  description: string
  device_id: string
  user_id: string
  status_id: string
}

export type InternalDeviceReviewPut = {
  device_review_id: string
  description: string
  device_id: string
  user_id: string
  status_id: string
}

export type InternalDeviceAssignment = {
  device_assigment_id: string
  observations: string
  delivery_condition: string
  device_id: string
  employee_id: string
  id_user?: string
  date?: string
  created_at?: string
}

export type InternalDeviceAssignmentHistory = {
  device_assigment_id: string
  devicename?: string
  model?: string
  typedevice?: string
  devicebrand?: string
  description?: string
  observations: string
  delivery_condition: string
  device_id: string
  employee_id: string
  employeename?: string
  assigned_to?: string
  datecreated?: string
  createdBy?: string
  assigned?: boolean
  date?: string
  created_at?: string
}

export type InternalDeviceAssignmentPost = {
  observations: string
  delivery_condition: string
  device_id: string
  employee_id: string
  id_user: string
}

export type InternalDeviceAssignmentPut = {
  device_assigment_id: string
  observations: string
  delivery_condition: string
  device_id: string
  employee_id: string
}

export type DevicesAssignedFilters = {
  isActive?: boolean
  isAssigned?: boolean
  isReviewed?: boolean
}
