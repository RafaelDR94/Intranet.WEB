import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import type { ResponsiveLayoutMatrix, FieldModel } from '@/app/components/DynamicForm/types'
import type { Authorized } from '@/app/components/SignaturePopUp/types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import useQuery from '@/app/hooks/useQuery/useQuery'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useDeviceAssignmentResponsiveUrlStore } from '@/app/stores/useDeviceAssignmentResponsiveUrlStore/useDeviceAssignmentResponsiveUrlStore'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import { CreatePDFBlob } from '@/app/utilities/PDF/PDF'
import useTutorialAutoRun from '@/tutorials/engine/useTutorialAutoRun'

import useInternalDevicesAsignation from './useInternalDevicesAsignation'
import useInternalDevicesAsignationTable from './useInternalDevicesAsignationTable'
import { buildDeviceAssignmentResponsiveDocument } from '../utilities/buildDeviceAssignmentResponsiveDocument'
import type { InternalDeviceAssignmentRow } from '../types'

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

/**
 * Orchestrates internal devices asignation page state and side effects.
 */
const useInternalDevicesAsignationPage = () => {
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
  const { firebasestorage } = useFirebase()

  const {
    devices,
    deviceStatuses,
    fetchDevices,
    fetchDeviceStatuses,
    fetchDeviceById,
    fetchDeviceAssignmentById,
    fetchDeviceAssignments,
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
      fetchDeviceAssignments: state.fetchDeviceAssignments,
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

  const { updateDeviceAssignmentResponsiveUrl } = useDeviceAssignmentResponsiveUrlStore(
    (state) => ({
      updateDeviceAssignmentResponsiveUrl: state.updateDeviceAssignmentResponsiveUrl,
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
  const [responsiveOpen, setResponsiveOpen] = useState(false)
  const [responsiveUrl, setResponsiveUrl] = useState<string | null>(null)
  const [responsiveTitle, setResponsiveTitle] = useState<string>('')
  const prevCreateView = useRef(false)
  const prevDeviceId = useRef<string | null>(null)
  const suppressCreateSuccessRef = useRef(false)

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
    if (suppressCreateSuccessRef.current) return

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
    const unreviewedDevices = devices.filter((device) => !device.reviewed)
    const filtered = unreviewedDevices.filter((device) => device.is_active && !device.assigned)
    return filtered.length ? filtered : unreviewedDevices
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

  const selectedEmployee = useMemo(
    () =>
      activeEmployees.find(
        (employee) => (employee.employee_id || employee.id) === formValues.employee_id,
      ) ?? null,
    [activeEmployees, formValues.employee_id],
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

  const handleStepChangeFromBreadcrumbs = useCallback(
    (stepId: string) => {
      const match = steps.find((step) => step.id === stepId)
      if (!match) return
      handleStepChange(match.id)
    },
    [handleStepChange],
  )

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

    if (!firebasestorage?.uploadFile) {
      showAlert({
        type: 'error',
        title: 'Firebase no disponible',
        description: 'No se pudo subir la responsiva en este momento.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    try {
      suppressCreateSuccessRef.current = true
      showSpinner({ message: 'Asignando dispositivo...' })

      const created = await createDeviceAssignment({
        device_id: formValues.device_id,
        employee_id: formValues.employee_id,
        observations: '',
        delivery_condition: '',
        id_user: user.idEmployee,
      })

      if (!created?.device_assigment_id) {
        throw new Error('No se pudo crear la asignacion.')
      }

      const employee =
        activeEmployees.find(
          (item) => (item.employee_id || item.id) === formValues.employee_id,
        ) ?? (await fetchEmployeeById(formValues.employee_id, true))
      if (!employee) {
        throw new Error('No se pudo obtener el colaborador.')
      }

      const device =
        selectedDevice ??
        (await fetchDeviceById(formValues.device_id, true)) ??
        null
      if (!device) {
        throw new Error('No se pudo obtener el dispositivo.')
      }

      const document = buildDeviceAssignmentResponsiveDocument({
        assignment: created,
        device,
        employee: employee as EmployeeType,
        signatureUrl: userSignature,
      })

      const pdfBlob = await CreatePDFBlob(document)
      const storagePath = `Assets/DeviceAssignment/${created.device_assigment_id}/responsiva.pdf`
      const pdfUrl = await firebasestorage.uploadFile(pdfBlob, storagePath, true)

      if (!pdfUrl) {
        throw new Error('No se pudo subir la responsiva.')
      }

      await updateDeviceAssignmentResponsiveUrl({
        idDeviceAssignment: created.device_assigment_id,
        responsiveUrl: pdfUrl,
      })

      await fetchDeviceAssignments(true)

      showAlert({
        type: 'info',
        title: 'Asignacion creada',
        description: 'La responsiva se guardo correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      handleRefresh()
      updateQuery({ view: null })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo completar la asignacion.'
      showAlert({
        type: 'error',
        title: 'No se pudo completar la asignacion',
        description: message,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      })
    } finally {
      hideSpinner()
      resetFlags()
      suppressCreateSuccessRef.current = false
    }
  }, [
    createDeviceAssignment,
    fetchDeviceAssignments,
    fetchDeviceById,
    fetchEmployeeById,
    firebasestorage,
    formValues.device_id,
    formValues.employee_id,
    activeEmployees,
    handleRefresh,
    hideSpinner,
    showAlert,
    showSpinner,
    updateDeviceAssignmentResponsiveUrl,
    updateQuery,
    userSignature,
    user?.idEmployee,
    selectedDevice,
  ])

  const handleSignatureAuthorization = useCallback((authorized: Authorized) => {
    if (authorized?.signature) {
      setUserSignature(authorized.signature)
      setSignatureOpen(false)
    }
  }, [])

  const handleSignatureClick = useCallback(() => {
    if (!formValues.employee_id) {
      showAlert({
        type: 'warning',
        title: 'Colaborador pendiente',
        description: 'Selecciona un colaborador antes de firmar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }
    setSignatureOpen(true)
  }, [formValues.employee_id, showAlert])

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

  const handleCloseDetails = useCallback(() => {
    updateQuery({ id: null, assignmentId: null, view: null })
  }, [updateQuery])

  const handleOpenResponsive = useCallback(
    (url?: string | null, title?: string) => {
      if (!url) {
        showAlert({
          type: 'warning',
          title: 'Responsiva no disponible',
          description: 'No se encontro una responsiva para esta asignacion.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        })
        return
      }
      setResponsiveUrl(url)
      setResponsiveTitle(title ?? 'Responsiva de asignacion')
      setResponsiveOpen(true)
    },
    [showAlert],
  )

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

  const handleOpenAssignmentDetails = useCallback(
    (row: InternalDeviceAssignmentRow) => {
      if (row.device_id) {
        updateQuery({
          id: row.device_id,
          assignmentId: row.assignment_id,
          view: null,
        })
      }
      void fetchDeviceAssignmentById(row.assignment_id, true)
    },
    [fetchDeviceAssignmentById, updateQuery],
  )

  const handleOpenResponsiveFromRow = useCallback(
    (row: InternalDeviceAssignmentRow) => {
      handleOpenResponsive(row.responsive_url, `Responsiva ${row.display_id}`)
    },
    [handleOpenResponsive],
  )

  const {
    columns,
    rows,
    searchableKeys,
    statusFilter,
    statusFilterOptions,
    handleStatusFilterChange,
  } = useInternalDevicesAsignationTable({
    deviceAssignments,
    deviceById,
    employeeById,
    isMobile,
    onOpenDetails: handleOpenAssignmentDetails,
    onOpenResponsive: handleOpenResponsiveFromRow,
  })

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

  const handleCloseResponsive = useCallback(() => {
    setResponsiveOpen(false)
    setResponsiveUrl(null)
  }, [])

  return {
    assignmentDevice,
    assignmentEmployeeName,
    canAdvance,
    columns,
    currentStep,
    deviceAssignment: deviceAssignment ?? null,
    deviceFields,
    handleAssign,
    handleBackToDetails,
    handleCloseDetails,
    handleBackToList,
    handleCloseResponsive,
    handleCreateReview,
    handleEditInformation,
    handleNext,
    handleOpenCreate,
    handlePrevious,
    handleSignatureAuthorization,
    handleSignatureClick,
    handleStatusFilterChange,
    handleStepChangeFromBreadcrumbs,
    handleValuesChange,
    handleValidChange,
    handleRefresh,
    isCreateView,
    isDefaultView,
    isEditView,
    isFirstStep,
    isLastStep,
    isReviewView,
    isMobile,
    openDetails,
    rows,
    searchableKeys,
    selectedDeviceByQuery,
    selectedEmployee,
    userFullName: user?.fullName ?? '',
    showResponsive: responsiveOpen && Boolean(responsiveUrl),
    signatureOpen,
    stepLayouts,
    steps,
    statusFilter,
    statusFilterOptions,
    formVersion,
    userSignature,
    responsiveTitle,
    responsiveUrl,
    setSignatureOpen,
    setResponsiveOpen,
    loadingDeviceAssignment,
    formValues,
  }
}

export default useInternalDevicesAsignationPage
