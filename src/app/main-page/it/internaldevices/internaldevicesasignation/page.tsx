'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/app/components/Button/Button'
import ActionMenuCell from '@/app/components/ActionMenuCell/ActionMenuCell'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from '@/app/components/DynamicForm/types'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import SignatureBox from '@/app/components/SignatureBox/SignatureBox'
import SignatureComponent from '@/app/components/SignatureComponent/SignatureComponent'
import type { Authorized } from '@/app/components/SignaturePopUp/types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

import AssignmentDetail from './components/AssignmentDetail/AssignmentDetail'
import InternalDeviceEdit from '../internaldeviceslist/components/InternalDeviceEdit/InternalDeviceEdit'
import InternalDeviceReview from '../internaldeviceslist/components/InternalDeviceReview/InternalDeviceReview'
import useInternalDevicesAsignation from './hooks/useInternalDevicesAsignation'

type InternalDeviceAssignmentRow = {
  id: string
  display_id: string
  assignment_id: string
  device_id?: string | null
  device_status?: InternalDevice['device_status'] | null
  device_type?: InternalDevice['device_type'] | null
  device_brand?: InternalDevice['device_brand'] | null
  model?: string
  serial_number?: string
  name?: string
  assigned_to?: string | null
}

const statusToLabelType = (status?: string | null): LabelType => {
  const normalized = (status ?? '').toUpperCase()
  if (normalized.includes('OPTIMO') || normalized.includes('EXCELENTE')) return 'valido'
  if (normalized.includes('BUENO')) return 'validado'
  if (normalized.includes('REGULAR')) return 'pendiente'
  if (normalized.includes('MALO') || normalized.includes('DEFECTUOSO')) return 'invalido'
  return 'pendiente'
}

const normalizeStatus = (status?: string | null) =>
  (status ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const matchesStatusFilter = (status: string | null | undefined, filter: string) => {
  if (filter === 'all') return true
  const normalized = normalizeStatus(status)
  switch (filter) {
    case 'en_revision':
      return normalized.includes('REVISION')
    case 'excelente':
      return normalized.includes('EXCELENTE') || normalized.includes('OPTIMO')
    case 'bueno':
      return normalized.includes('BUENO')
    case 'regular':
      return normalized.includes('REGULAR')
    case 'malo':
      return normalized.includes('MALO') || normalized.includes('DEFECTUOSO')
    default:
      return true
  }
}

const steps = [
  { id: 'device', label: 'Dispositivo' },
  { id: 'signature', label: 'Firma de responsiva' },
] as const

type StepId = (typeof steps)[number]['id']

const stepLayouts: Record<StepId, ResponsiveLayoutMatrix> = {
  device: {
    sm: [[10], [10], [10], [10], [10]],
    md: [[5, 5], [5, 5], [10]],
    lg: [[3.3, 3.3, 3.3], [5, 5]],
  },
  signature: {
    sm: [[10]],
    md: [[10]],
    lg: [[10]],
  },
}

const InternalDevicesAsignationPage = () => {
  const { deviceAssignments, handleRefresh } = useInternalDevicesAsignation()
  const { all, updateQuery } = useQuery()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const normalizedView = useMemo(() => {
    const raw = all.view
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.view])

  const normalizedId = useMemo(() => {
    const raw = all.id
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.id])

  const isCreateView = normalizedView === 'new'
  const isEditView = normalizedView === 'edit'
  const isReviewView = normalizedView === 'review'
  const isDefaultView = !isCreateView && !isEditView && !isReviewView
  const normalizedAssignmentId = useMemo(() => {
    const raw = all.assignmentId
    if (Array.isArray(raw)) return raw[0] ?? null
    if (typeof raw === 'string' && raw.trim()) return raw
    return null
  }, [all.assignmentId])
  const openDetails = Boolean(
    normalizedId && !isCreateView && !isEditView && !isReviewView,
  )
  const [statusFilter, setStatusFilter] = useState('all')

  useTutorialAutoRun({
    moduleId: isDefaultView ? 'it-internaldevices-asignation-list' : '',
    tutorialId: isDefaultView ? 'it-internaldevices-asignation:list' : '',
  })
  useTutorialAutoRun({
    moduleId: isCreateView ? 'it-internaldevices-asignation-create' : '',
    tutorialId: isCreateView ? 'it-internaldevices-asignation:create' : '',
  })

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading

  const {
    devices,
    deviceStatuses,
    fetchDevices,
    fetchDeviceStatuses,
    fetchDeviceById,
    fetchDeviceAssignmentById,
    createDeviceAssignment,
    creatingDeviceAssignment,
    successCreateDeviceAssignment,
    loadingDevices,
    loadingDeviceStatuses,
    loadingDeviceAssignment,
    deviceAssignment,
    device,
    error,
    resetFlags,
  } = useInternalDevicesStore(
    (state) => ({
      devices: state.devices,
      deviceStatuses: state.deviceStatuses,
      fetchDevices: state.fetchDevices,
      fetchDeviceStatuses: state.fetchDeviceStatuses,
      fetchDeviceById: state.fetchDeviceById,
      fetchDeviceAssignmentById: state.fetchDeviceAssignmentById,
      createDeviceAssignment: state.createDeviceAssignment,
      creatingDeviceAssignment: state.creatingDeviceAssignment,
      successCreateDeviceAssignment: state.successCreateDeviceAssignment,
      loadingDevices: state.loadingDevices,
      loadingDeviceStatuses: state.loadingDeviceStatuses,
      loadingDeviceAssignment: state.loadingDeviceAssignment,
      deviceAssignment: state.deviceAssignment,
      device: state.device,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  const {
    activeEmployees,
    fetchActiveEmployees,
    fetchEmployeeById,
    loadingActive,
  } = useEmployeesStore(
    (state) => ({
      activeEmployees: state.activeEmployees,
      fetchActiveEmployees: state.fetchActiveEmployees,
      fetchEmployeeById: state.fetchEmployeeById,
      loadingActive: state.loadingActive,
    }),
    shallow,
  )

  const [currentStep, setCurrentStep] = useState<StepId>('device')
  const [formVersion, setFormVersion] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, any>>({
    device_id: '',
    device_brand_name: '',
    model: '',
    device_status_id: '',
    employee_id: '',
  })
  const [stepValidity, setStepValidity] = useState<Record<StepId, boolean>>({
    device: false,
    signature: true,
  })
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [userSignature, setUserSignature] = useState('')
  const [assignmentEmployeeName, setAssignmentEmployeeName] = useState('')
  const prevCreateView = useRef(false)
  const prevDeviceId = useRef<string | null>(null)

  useEffect(() => {
    if (!isCreateView) {
      void fetchDevices(true)
      void fetchActiveEmployees(true)
      return
    }
    void fetchDevices(true)
    void fetchDeviceStatuses(true)
    void fetchActiveEmployees(true)
  }, [fetchActiveEmployees, fetchDeviceStatuses, fetchDevices, isCreateView])

  useEffect(() => {
    if (isCreateView && !prevCreateView.current) {
      setCurrentStep('device')
      setFormValues({
        device_id: '',
        device_brand_name: '',
        model: '',
        device_status_id: '',
        employee_id: '',
      })
      setStepValidity({ device: false, signature: true })
      setUserSignature('')
      setFormVersion((prev) => prev + 1)
    }
    prevCreateView.current = isCreateView
  }, [isCreateView])

  useEffect(() => {
    if (!isCreateView) return

    if (loadingDevices || loadingDeviceStatuses || loadingActive || creatingDeviceAssignment) {
      showSpinner({ message: 'Cargando informacion...' })
      return
    }

    if (error) {
      showAlert({
        type: 'error',
        title: 'Ocurrio un error',
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
    }

    if (successCreateDeviceAssignment) {
      showAlert({
        type: 'info',
        title: 'Asignacion creada',
        description: 'El dispositivo fue asignado correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      handleRefresh()
      updateQuery({ view: null })
    }

    hideSpinner()

    if (error || successCreateDeviceAssignment) {
      resetFlags()
    }
  }, [
    creatingDeviceAssignment,
    error,
    handleRefresh,
    hideSpinner,
    isCreateView,
    loadingActive,
    loadingDeviceStatuses,
    loadingDevices,
    resetFlags,
    showAlert,
    showSpinner,
    successCreateDeviceAssignment,
    updateQuery,
  ])

  const availableDevices = useMemo(() => {
    const filtered = devices.filter((device) => device.is_active && !device.assigned)
    return filtered.length ? filtered : devices
  }, [devices])

  const deviceOptions = useMemo(
    () =>
      availableDevices.map((device) => ({
        label: `${device.device_type?.name ?? 'Dispositivo'} - ${device.name ?? device.model ?? ''}`.trim(),
        value: device.device_id,
      })),
    [availableDevices],
  )

  const statusOptions = useMemo(() => {
    const options = deviceStatuses.map((status) => ({
      label: status.name,
      value: status.device_status_id,
    }))

    const current = devices.find((item) => item.device_id === formValues.device_id)?.device_status
    if (current && !options.some((opt) => opt.value === current.device_status_id)) {
      options.unshift({ label: current.name, value: current.device_status_id })
    }

    return options
  }, [deviceStatuses, devices, formValues.device_id])

  const employeeOptions = useMemo(
    () =>
      activeEmployees.map((employee) => ({
        label: employee.fullname || employee.employee_number || employee.employee_id,
        value: employee.employee_id || employee.id,
      })),
    [activeEmployees],
  )

  const selectedDevice = useMemo(
    () => devices.find((item) => item.device_id === formValues.device_id) ?? null,
    [devices, formValues.device_id],
  )

  useEffect(() => {
    if (!selectedDevice) return
    if (prevDeviceId.current === selectedDevice.device_id) return
    prevDeviceId.current = selectedDevice.device_id

    setFormValues((prev) => ({
      ...prev,
      device_brand_name: selectedDevice.device_brand?.name ?? '',
      model: selectedDevice.model ?? '',
      device_status_id:
        selectedDevice.device_status?.device_status_id ?? prev.device_status_id ?? '',
    }))
    setFormVersion((prev) => prev + 1)
  }, [selectedDevice])

  useEffect(() => {
    if (!normalizedId) return
    if (devices.some((item) => item.device_id === normalizedId)) return
    void fetchDeviceById(normalizedId, true)
  }, [devices, fetchDeviceById, normalizedId])

  useEffect(() => {
    if (!normalizedAssignmentId) return
    void fetchDeviceAssignmentById(normalizedAssignmentId, true)
  }, [fetchDeviceAssignmentById, normalizedAssignmentId])

  const deviceFields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'select',
        name: 'device_id',
        label: 'Seleccionar dispositivo*',
        placeholder: 'Escriba el tipo de dispositivo',
        value: formValues.device_id ?? '',
        options: deviceOptions,
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'device_brand_name',
        label: 'Marca*',
        placeholder: 'Escriba la marca',
        value: formValues.device_brand_name ?? '',
        validations: [{ type: 'required' }],
        disabled: true,
      },
      {
        type: 'input',
        name: 'model',
        label: 'Modelo*',
        placeholder: 'Escriba el modelo',
        value: formValues.model ?? '',
        validations: [{ type: 'required' }],
        disabled: true,
      },
      {
        type: 'select',
        name: 'device_status_id',
        label: 'Estatus del dispositivo*',
        placeholder: 'Seleccione una opcion',
        value: formValues.device_status_id ?? '',
        options: statusOptions,
        validations: [{ type: 'required' }],
      },
      {
        type: 'select',
        name: 'employee_id',
        label: 'Asignar dispositivo',
        placeholder: 'Seleccione una opcion',
        value: formValues.employee_id ?? '',
        options: employeeOptions,
        validations: [{ type: 'required' }],
      },
    ],
    [deviceOptions, employeeOptions, formValues, statusOptions],
  )

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...values }))
  }, [])

  const handleValidChange = useCallback((step: StepId, isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, [step]: isValid }))
  }, [])

  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === steps.length - 1
  const canAdvance = stepValidity.device

  const handleNext = useCallback(() => {
    if (isLastStep) return
    setCurrentStep(steps[currentIndex + 1].id)
    setFormVersion((prev) => prev + 1)
  }, [currentIndex, isLastStep])

  const handlePrevious = useCallback(() => {
    if (isFirstStep) return
    setCurrentStep(steps[currentIndex - 1].id)
    setFormVersion((prev) => prev + 1)
  }, [currentIndex, isFirstStep])

  const handleStepChange = useCallback((stepId: StepId) => {
    setCurrentStep(stepId)
    setFormVersion((prev) => prev + 1)
  }, [])

  const handleAssign = useCallback(async () => {
    if (!formValues.device_id || !formValues.employee_id) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Selecciona un dispositivo y un colaborador para asignar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    if (!user?.idEmployee) {
      showAlert({
        type: 'warning',
        title: 'Usuario no disponible',
        description: 'No se encontro el identificador del usuario activo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    if (!userSignature) {
      showAlert({
        type: 'warning',
        title: 'Firma pendiente',
        description: 'Debes firmar la responsiva antes de asignar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    await createDeviceAssignment({
      device_id: formValues.device_id,
      employee_id: formValues.employee_id,
      observations: '',
      delivery_condition: '',
      id_user: user.idEmployee,
    })
  }, [
    createDeviceAssignment,
    formValues.device_id,
    formValues.employee_id,
    showAlert,
    userSignature,
    user?.idEmployee,
  ])

  const handleSignatureAuthorization = useCallback((authorized: Authorized) => {
    if (authorized?.signature) {
      setUserSignature(authorized.signature)
      setSignatureOpen(false)
    }
  }, [])

  const handleSignatureClick = useCallback(() => {
    setSignatureOpen(true)
  }, [])

  const handleOpenCreate = useCallback(() => {
    updateQuery({ view: 'new' })
  }, [updateQuery])

  const handleBackToList = useCallback(() => {
    updateQuery({ view: null })
  }, [updateQuery])

  const handleBackToDetails = useCallback(() => {
    if (!normalizedId) {
      updateQuery({ view: null })
      return
    }
    updateQuery({ view: null })
  }, [normalizedId, updateQuery])

  const deviceById = useMemo(() => {
    const entries = devices.map((device) => [device.device_id, device] as const)
    return new Map(entries)
  }, [devices])

  const employeeById = useMemo(() => {
    const entries = activeEmployees.map((employee) => [
      employee.employee_id || employee.id,
      employee,
    ] as const)
    return new Map(entries)
  }, [activeEmployees])

  const rows = useMemo<InternalDeviceAssignmentRow[]>(
    () =>
      deviceAssignments.map((assignment, index) => {
        const device = deviceById.get(assignment.device_id)
        const employee = employeeById.get(assignment.employee_id)
        return {
          id: assignment.device_assigment_id || String(index + 1),
          assignment_id: assignment.device_assigment_id || '',
          device_id: assignment.device_id ?? null,
          display_id: String(index + 1).padStart(3, '0'),
          device_status: device?.device_status ?? null,
          device_type: device?.device_type ?? null,
          device_brand: device?.device_brand ?? null,
          model: device?.model ?? '',
          serial_number: device?.serial_number ?? '',
          name: device?.name ?? '',
          assigned_to: employee?.fullname ?? assignment.employee_id ?? '-',
        }
      }),
    [deviceAssignments, deviceById, employeeById],
  )

  const searchableKeys = useMemo<(keyof InternalDeviceAssignmentRow)[]>(
    () => ['display_id', 'name', 'model', 'serial_number', 'assigned_to'],
    [],
  )
  const statusFilterOptions = useMemo(
    () => [
      { label: 'Todos', value: 'all' },
      { label: 'En revision', value: 'en_revision' },
      { label: 'Excelente', value: 'excelente' },
      { label: 'Bueno', value: 'bueno' },
      { label: 'Regular', value: 'regular' },
      { label: 'Malo', value: 'malo' },
    ],
    [],
  )

  const columnsDesktop = useMemo<ColumnDefinition<InternalDeviceAssignmentRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
      },
      {
        key: 'device_status',
        label: 'ESTATUS',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <Label
            type={statusToLabelType(row.device_status?.name)}
            text={row.device_status?.name ?? 'SIN ESTATUS'}
          />
        ),
      },
      {
        key: 'device_type',
        label: 'DISPOSITIVO',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
        render: (row) => row.device_type?.name ?? '-',
      },
      {
        key: 'device_brand',
        label: 'MARCA',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => row.device_brand?.name ?? '-',
      },
      {
        key: 'model',
        label: 'MODELO',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'serial_number',
        label: 'No. SERIE',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'NOMBRE',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'assigned_to',
        label: 'ASIGNADO A',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
        render: (row) => row.assigned_to ?? '-',
      },
      {
        key: 'assignment_id',
        label: '',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <div data-tour="internaldevices-asignation-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => {
                if (row.device_id) {
                  updateQuery({
                    id: row.device_id,
                    assignmentId: row.assignment_id,
                    view: null,
                  })
                }
                void fetchDeviceAssignmentById(row.assignment_id, true)
              }}
              permissions={{ details: true, delete: false, update: false }}
            />
          </div>
        ),
      },
    ],
    [fetchDeviceAssignmentById, updateQuery],
  )

  const columnsMobile = useMemo<ColumnDefinition<InternalDeviceAssignmentRow>[]>(
    () => [
      {
        key: 'display_id',
        label: 'ID',
        cellClass: 'w-2/12',
        headerClass: 'w-2/12',
      },
      {
        key: 'name',
        label: 'DISPOSITIVO',
        cellClass: 'w-4/12',
        headerClass: 'w-4/12',
      },
      {
        key: 'assigned_to',
        label: 'ASIGNADO A',
        cellClass: 'w-3/12',
        headerClass: 'w-3/12',
        render: (row) => row.assigned_to ?? '-',
      },
      {
        key: 'assignment_id',
        label: '',
        cellClass: 'w-1/12',
        headerClass: 'w-1/12',
        render: (row) => (
          <div data-tour="internaldevices-asignation-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => {
                if (row.device_id) {
                  updateQuery({
                    id: row.device_id,
                    assignmentId: row.assignment_id,
                    view: null,
                  })
                }
                void fetchDeviceAssignmentById(row.assignment_id, true)
              }}
              permissions={{ details: true, delete: false, update: false }}
            />
          </div>
        ),
      },
    ],
    [fetchDeviceAssignmentById, updateQuery],
  )

  const columns = isMobile ? columnsMobile : columnsDesktop
  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row.device_status?.name ?? null, statusFilter)),
    [rows, statusFilter],
  )

  useEffect(() => {
    if (!deviceAssignment?.device_id) return
    if (!deviceById.has(deviceAssignment.device_id)) {
      void fetchDeviceById(deviceAssignment.device_id, true)
    }
  }, [deviceAssignment, deviceById, fetchDeviceById])

  useEffect(() => {
    if (!deviceAssignment?.employee_id) {
      setAssignmentEmployeeName('')
      return
    }
    const existing = employeeById.get(deviceAssignment.employee_id)
    if (existing) {
      setAssignmentEmployeeName(existing.fullname)
      return
    }
    void fetchEmployeeById(deviceAssignment.employee_id, true).then((employee) => {
      setAssignmentEmployeeName(employee?.fullname ?? deviceAssignment.employee_id)
    })
  }, [deviceAssignment, employeeById, fetchEmployeeById])

  const assignmentDevice = deviceAssignment
    ? deviceById.get(deviceAssignment.device_id) ??
      (device?.device_id === deviceAssignment.device_id ? device : null)
    : null

  const handleEditInformation = useCallback(() => {
    const targetId = selectedDevice?.device_id ?? normalizedId
    if (!targetId) return
    updateQuery({ id: targetId, view: 'edit' })
  }, [normalizedId, selectedDevice, updateQuery])

  const handleCreateReview = useCallback(() => {
    const targetId = selectedDevice?.device_id ?? normalizedId
    if (!targetId) return
    updateQuery({ id: targetId, view: 'review' })
  }, [normalizedId, selectedDevice, updateQuery])

  const selectedDeviceByQuery = useMemo<InternalDevice | null>(() => {
    if (!normalizedId) return null
    return devices.find((item) => item.device_id === normalizedId) ?? null
  }, [devices, normalizedId])

  if (isReviewView) {
    return (
      <InternalDeviceReview
        device={selectedDeviceByQuery}
        onBack={handleBackToDetails}
      />
    )
  }

  if (isEditView) {
    return (
      <InternalDeviceEdit
        device={selectedDeviceByQuery}
        mode="edit"
        onBack={handleBackToDetails}
      />
    )
  }

  if (isCreateView) {
    return (
      <div className="space-y-4">
        <CollapsibleSection
          title="Nueva Asignacion de Dispositivo"
          enableCollapse={false}
          rightContent={
            <Button
              hideIcon
              onClick={handleAssign}
              data-tour="internaldevices-asignation-assign"
              disabled={
                !stepValidity.device ||
                currentStep !== 'signature' ||
                !userSignature
              }
              className={isMobile ? 'w-full mt-3' : ''}
            >
              Asignar dispositivo
            </Button>
          }
        >
          <div className="rounded-2xl bg-white-100 p-6 shadow-md">
            <div data-tour="internaldevices-asignation-steps">
              <Breadcrumbs
                activeId={currentStep}
                onActiveChange={(id) => handleStepChange(id as StepId)}
                dataTestId="internal-device-asignation-steps"
              >
                {steps.map((step) => (
                  <Breadcrumbs.Item
                    key={step.id}
                    id={step.id}
                    label={step.label}
                    renderContent={() => (
                      <div className="space-y-6">
                        {step.id === 'device' ? (
                          <div data-tour="internaldevices-asignation-form">
                            <DynamicForm
                              fields={deviceFields}
                              onSubmit={() => undefined}
                              onValuesChange={handleValuesChange}
                              onValidChange={(valid) => handleValidChange('device', valid)}
                              responsiveLayoutMatrix={stepLayouts.device}
                              valuesVersion={formVersion}
                              valuesVersionActive
                              showSubmitIf={() => false}
                              dataTestId="internal-device-asignation-device"
                            />
                          </div>
                        ) : (
                          <div
                            className="rounded-2xl bg-white-100 p-6 shadow-sm"
                            data-tour="internaldevices-asignation-signature"
                          >
                            <div className="text-c2 text-gray-70">Firma de Realizacion</div>
                            <div className="min-h-[360px] w-full flex items-center justify-center">
                              {userSignature ? (
                                <div className="w-full">
                                  <SignatureBox
                                    title={user?.fullName ?? ''}
                                    imageUrl={userSignature}
                                  />
                                </div>
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Button
                                    hideIcon
                                    className="px-6"
                                    onClick={handleSignatureClick}
                                    data-tour="internaldevices-asignation-signature-button"
                                  >
                                    Click para Firmar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div
                          className={
                            isMobile
                              ? 'flex flex-col gap-3'
                              : 'flex justify-end gap-4'
                          }
                        >
                          {!isFirstStep && (
                            <Button
                              variant="outline"
                              hideIcon
                              onClick={handlePrevious}
                              data-tour="internaldevices-asignation-prev"
                            >
                              Regresar
                            </Button>
                          )}
                          {!isLastStep && (
                            <Button
                              hideIcon
                              onClick={handleNext}
                              disabled={!canAdvance}
                              data-tour="internaldevices-asignation-next"
                            >
                              Siguiente
                            </Button>
                          )}
                          {isLastStep && (
                            <Button
                              variant="ghost"
                              hideIcon
                              onClick={handleBackToList}
                              data-tour="internaldevices-asignation-back"
                            >
                              Volver al listado
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                ))}
              </Breadcrumbs>
            </div>
          </div>
        </CollapsibleSection>
        <SignatureComponent
          open={signatureOpen}
          onClose={() => setSignatureOpen(false)}
          onAuthorization={handleSignatureAuthorization}
          responsibleGuid={user?.idEmployee ?? ''}
        />
      </div>
    )
  }

  return (
    <>
      <div data-tour="internaldevices-asignation-table">
        <DataTable<InternalDeviceAssignmentRow>
          tables={[
            {
              title: 'Dispositivos Asignados',
              columns,
            data: filteredRows,
              enableCollaps: true,
              enableSelection: false,
            },
          ]}
          textSize={{ mobile: 'text-d3', desktop: 'text-c2' }}
          enableInternalSearch
          searchableKeys={searchableKeys}
          showCalendar
          showFilter
          showRefresh
          showDownloadTable
          onRefreshPage={handleRefresh}
          filterTitle="Estatus"
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value)}
          dataTableTitle="Asignacion de Dispositivos"
          showButton={false}
          searchDataTour="internaldevices-asignation-search"
          calendarDataTour="internaldevices-asignation-calendar"
          refreshDataTour="internaldevices-asignation-refresh"
          rightContent={
            <Button
              hideIcon
              onClick={handleOpenCreate}
              data-tour="internaldevices-asignation-create"
            >
              Nueva Asignacion
            </Button>
          }
        />
      </div>
      <AssignmentDetail
        open={openDetails}
        onClose={() => {
          updateQuery({ id: null, assignmentId: null, view: null })
        }}
        loading={loadingDeviceAssignment}
        assignment={deviceAssignment ?? null}
        assignmentDevice={assignmentDevice}
        assignmentEmployeeName={assignmentEmployeeName}
        onEditInformation={handleEditInformation}
        onCreateReview={handleCreateReview}
      />
    </>
  )
}

export default InternalDevicesAsignationPage
