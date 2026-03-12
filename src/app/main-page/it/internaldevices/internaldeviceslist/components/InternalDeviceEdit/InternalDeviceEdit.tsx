'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/app/components/Button/Button'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import type { InternalDevice, InternalDevicePut } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import ArrowLeftIcon from '@/assets/icons/navegacion/long-arrow-up-left.svg'

const steps = [
  { id: 'device', label: 'Dispositivo' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'features', label: 'Caracteristicas' },
] as const

type StepId = (typeof steps)[number]['id']

type InternalDeviceEditProps = {
  device: InternalDevice | null
  onBack: () => void
  mode?: 'edit' | 'create'
}

const stepLayouts: Record<StepId, ResponsiveLayoutMatrix> = {
  device: {
    sm: [[10], [10], [10], [10]],
    md: [[5, 5], [5, 5]],
    lg: [[3.3, 3.3, 3.3], [3.3]],
  },
  hardware: {
    sm: [[10], [10], [10], [10]],
    md: [[5, 5], [5, 5]],
    lg: [[3.3, 3.3, 3.3], [3.3]],
  },
  features: {
    sm: [[10], [10], [10], [10]],
    md: [[5, 5], [5, 5], [10]],
    lg: [[3.3, 3.3, 3.3], [10]],
  },
}

const InternalDeviceEdit: React.FC<InternalDeviceEditProps> = ({
  device,
  onBack,
  mode = 'edit',
}) => {
  const isMobile = useIsMobile()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const { user } = useAuth()
  const isCreate = mode === 'create'

  const {
    deviceTypes,
    deviceBrands,
    deviceStatuses,
    fetchDeviceTypes,
    fetchDeviceBrands,
    fetchDeviceStatuses,
    createDevice,
    updateDevice,
    creatingDevice,
    updatingDevice,
  } = useInternalDevicesStore(
    (state) => ({
      deviceTypes: state.deviceTypes,
      deviceBrands: state.deviceBrands,
      deviceStatuses: state.deviceStatuses,
      fetchDeviceTypes: state.fetchDeviceTypes,
      fetchDeviceBrands: state.fetchDeviceBrands,
      fetchDeviceStatuses: state.fetchDeviceStatuses,
      createDevice: state.createDevice,
      updateDevice: state.updateDevice,
      creatingDevice: state.creatingDevice,
      updatingDevice: state.updatingDevice,
    }),
    shallow,
  )

  const [currentStep, setCurrentStep] = useState<StepId>('device')
  const [formVersion, setFormVersion] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [stepValidity, setStepValidity] = useState<Record<StepId, boolean>>({
    device: false,
    hardware: false,
    features: false,
  })

  useEffect(() => {
    void fetchDeviceTypes(undefined, true)
    void fetchDeviceBrands(undefined, true)
    void fetchDeviceStatuses(undefined, true)
  }, [fetchDeviceBrands, fetchDeviceStatuses, fetchDeviceTypes])

  useEffect(() => {
    if (isCreate) {
      setFormValues({
        device_type_id: '',
        device_brand_id: '',
        device_status_id: '',
        model: '',
        name: '',
        serial_number: '',
        ip_address: '',
        mac_address: '',
        operating_system: '',
        charge_sn: '',
        description: '',
        additional_features: '',
      })
      setCurrentStep('device')
      setStepValidity({ device: false, hardware: false, features: false })
      setFormVersion((prev) => prev + 1)
      return
    }

    if (!device) return
    setFormValues({
      device_type_id: device.device_type?.device_type_id ?? '',
      device_brand_id: device.device_brand?.device_brand_id ?? '',
      device_status_id: device.device_status?.device_status_id ?? '',
      model: device.model ?? '',
      name: device.name ?? '',
      serial_number: device.serial_number ?? '',
      ip_address: device.ip_address ?? '',
      mac_address: device.mac_address ?? '',
      operating_system: device.operating_system ?? '',
      charge_sn: device.charge_sn ?? '',
      description: device.description ?? '',
      additional_features: '',
    })
    setCurrentStep('device')
    setStepValidity({ device: false, hardware: false, features: false })
    setFormVersion((prev) => prev + 1)
  }, [device, isCreate])

  const typeOptions = useMemo(() => {
    const options = deviceTypes.map((item) => ({
      label: item.name,
      value: item.device_type_id,
    }))
    const current = device?.device_type
    if (current && !options.some((opt) => opt.value === current.device_type_id)) {
      options.unshift({ label: current.name, value: current.device_type_id })
    }
    return options
  }, [device?.device_type, deviceTypes])

  const brandOptions = useMemo(() => {
    const options = deviceBrands.map((item) => ({
      label: item.name,
      value: item.device_brand_id,
    }))
    const current = device?.device_brand
    if (current && !options.some((opt) => opt.value === current.device_brand_id)) {
      options.unshift({ label: current.name, value: current.device_brand_id })
    }
    return options
  }, [device?.device_brand, deviceBrands])

  const statusOptions = useMemo(() => {
    const options = deviceStatuses.map((item) => ({
      label: item.name,
      value: item.device_status_id,
    }))
    const current = device?.device_status
    if (current && !options.some((opt) => opt.value === current.device_status_id)) {
      options.unshift({ label: current.name, value: current.device_status_id })
    }
    return options
  }, [device?.device_status, deviceStatuses])

  const deviceFields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'select',
        name: 'device_type_id',
        label: 'Tipo de dispositivo*',
        value: formValues.device_type_id ?? '',
        options: typeOptions,
        validations: [{ type: 'required' }],
      },
      {
        type: 'select',
        name: 'device_brand_id',
        label: 'Marca*',
        value: formValues.device_brand_id ?? '',
        options: brandOptions,
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'model',
        label: 'Modelo*',
        value: formValues.model ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'select',
        name: 'device_status_id',
        label: isCreate ? 'Estatus del dispositivo' : 'Estatus del dispositivo*',
        value: formValues.device_status_id ?? '',
        options: statusOptions,
        validations: isCreate ? [] : [{ type: 'required' }],
      },
    ],
    [brandOptions, formValues, isCreate, statusOptions, typeOptions],
  )

  const hardwareFields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'input',
        name: 'serial_number',
        label: 'Numero de serie*',
        value: formValues.serial_number ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'name',
        label: 'Nombre del equipo*',
        value: formValues.name ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'ip_address',
        label: 'Direccion*',
        value: formValues.ip_address ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'mac_address',
        label: 'Direccion MAC*',
        value: formValues.mac_address ?? '',
        validations: [{ type: 'required' }],
      },
    ],
    [formValues],
  )

  const featuresFields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'input',
        name: 'operating_system',
        label: 'Sistema operativo*',
        value: formValues.operating_system ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'charge_sn',
        label: 'Numero de serie de cargador*',
        value: formValues.charge_sn ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'description',
        label: 'Otros accesorios*',
        value: formValues.description ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'textarea',
        name: 'additional_features',
        label: 'Caracteristicas adicionales',
        value: formValues.additional_features ?? '',
        rows: 4,
      },
    ],
    [formValues],
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
  const canAdvance = stepValidity[currentStep]

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

  const handleSave = useCallback(async () => {
    if (isCreate) {
      if (!user?.idEnterprise) {
        showAlert({
          type: 'warning',
          title: 'Empresa no disponible',
          description: 'No se encontro la empresa activa del usuario.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        })
        return
      }

      if (!formValues.device_type_id || !formValues.device_brand_id) {
        showAlert({
          type: 'warning',
          title: 'Datos incompletos',
          description: 'Completa tipo y marca para registrar el dispositivo.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        })
        return
      }

      if (
        !formValues.name ||
        !formValues.model ||
        !formValues.serial_number ||
        !formValues.ip_address ||
        !formValues.mac_address ||
        !formValues.operating_system ||
        !formValues.charge_sn ||
        !formValues.description
      ) {
        showAlert({
          type: 'warning',
          title: 'Datos incompletos',
          description: 'Completa los campos obligatorios del dispositivo.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        })
        return
      }

      const created = await createDevice({
        name: formValues.name ?? '',
        model: formValues.model ?? '',
        serial_number: formValues.serial_number ?? '',
        ip_address: formValues.ip_address ?? '',
        mac_address: formValues.mac_address ?? '',
        mac_wifi_address: '',
        operating_system: formValues.operating_system ?? '',
        charge_sn: formValues.charge_sn ?? '',
        description: formValues.description ?? '',
        low_motive: '',
        assigned: false,
        reviewed: false,
        device_type_id: formValues.device_type_id ?? '',
        device_brand_id: formValues.device_brand_id ?? '',
        assurance: new Date().toISOString(),
        id_enterprise: user.idEnterprise ?? '',
        proyect_id: '',
      })

      if (created) {
        onBack()
      }
      return
    }

    if (!device) {
      showAlert({
        type: 'error',
        title: 'Dispositivo no disponible',
        description: 'No se encontro informacion del dispositivo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      return
    }

    const payload: InternalDevicePut = {
      device_id: device.device_id,
      name: formValues.name ?? device.name ?? '',
      model: formValues.model ?? device.model ?? '',
      serial_number: formValues.serial_number ?? device.serial_number ?? '',
      ip_address: formValues.ip_address ?? device.ip_address ?? '',
      mac_address: formValues.mac_address ?? device.mac_address ?? '',
      mac_wifi_address: device.mac_wifi_address ?? '',
      operating_system: formValues.operating_system ?? device.operating_system ?? '',
      charge_sn: formValues.charge_sn ?? device.charge_sn ?? '',
      description: formValues.description ?? device.description ?? '',
      low_motive: device.low_motive ?? '',
      assigned: device.assigned ?? false,
      reviewed: device.reviewed ?? false,
      device_type_id:
        formValues.device_type_id ?? device.device_type?.device_type_id ?? '',
      device_brand_id:
        formValues.device_brand_id ?? device.device_brand?.device_brand_id ?? '',
      device_status_id:
        formValues.device_status_id ?? device.device_status?.device_status_id ?? '',
      is_active: device.is_active ?? true,
      assurance: device.assurance ?? new Date().toISOString(),
      id_enterprise: device.enterprise?.enterprise_id ?? '',
      proyect_id: device.device_proyect?.id ?? '',
    }

    if (
      !payload.device_type_id ||
      !payload.device_brand_id ||
      !payload.device_status_id
    ) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Completa tipo, marca y estatus para guardar los cambios.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    if (
      !payload.name ||
      !payload.model ||
      !payload.serial_number ||
      !payload.ip_address ||
      !payload.mac_address ||
      !payload.operating_system ||
      !payload.charge_sn ||
      !payload.description
    ) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Completa los campos obligatorios del dispositivo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    void updateDevice(payload)
  }, [createDevice, device, formValues, isCreate, onBack, showAlert, updateDevice, user?.idEnterprise])

  if (!device && !isCreate) {
    return (
      <div className="space-y-4">
        <CollapsibleSection
          title={
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={onBack}
            >
              <ArrowLeftIcon className="h-5 w-5 text-blue-60" />
              <span className='text-b4 text-blue-60'>Detalle de dispositivo</span>
            </button>
          }
          enableCollapse={false}
          rightContent={
            <Button hideIcon disabled className={isMobile ? 'w-full mt-3' : ''}>
              Guardar informacion
            </Button>
          }
        >
          <div className="rounded-2xl bg-white-100 p-6 text-gray-70 shadow-md">
            Cargando informacion del dispositivo...
          </div>
        </CollapsibleSection>
      </div>
    )
  }

  const renderStepForm = (stepId: StepId) => {
    const commonProps = {
      onSubmit: () => undefined,
      onValuesChange: handleValuesChange,
      valuesVersion: formVersion,
      valuesVersionActive: true,
      showSubmitIf: () => false,
      disabled: !device && !isCreate,
    }

    if (stepId === 'device') {
      return (
        <DynamicForm
          fields={deviceFields}
          onValidChange={(valid) => handleValidChange('device', valid)}
          responsiveLayoutMatrix={stepLayouts.device}
          dataTestId="internal-device-edit-device"
          {...commonProps}
        />
      )
    }

    if (stepId === 'hardware') {
      return (
        <DynamicForm
          fields={hardwareFields}
          onValidChange={(valid) => handleValidChange('hardware', valid)}
          responsiveLayoutMatrix={stepLayouts.hardware}
          dataTestId="internal-device-edit-hardware"
          {...commonProps}
        />
      )
    }

    return (
      <DynamicForm
        fields={featuresFields}
        onValidChange={(valid) => handleValidChange('features', valid)}
        responsiveLayoutMatrix={stepLayouts.features}
        dataTestId="internal-device-edit-features"
        {...commonProps}
      />
    )
  }

  return (
    <div className="space-y-4">
      <CollapsibleSection
        title={
          <button
            type="button"
            className="flex items-center gap-2 text-blue-100 text-b2"
            onClick={onBack}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className='text-b4 text-blue-60'>
              {isCreate ? 'Lista de dispositivos' : 'Detalle de dispositivo'}
            </span>
          </button>
        }
        enableCollapse={false}
        rightContent={
          <Button
            hideIcon
            onClick={handleSave}
            disabled={isCreate ? creatingDevice : !device || updatingDevice}
            className={isMobile ? 'w-full mt-3' : ''}
          >
            {isCreate ? 'Crear dispositivo' : 'Guardar informacion'}
          </Button>
        }
      >
        <div className="rounded-2xl bg-white-100 p-6 shadow-md">
          <Breadcrumbs
            activeId={currentStep}
            onActiveChange={(id) => handleStepChange(id as StepId)}
            dataTestId="internal-device-edit-steps"
          >
            {steps.map((step) => (
              <Breadcrumbs.Item
                key={step.id}
                id={step.id}
                label={step.label}
                renderContent={() => (
                  <div className="space-y-6">
                    {renderStepForm(step.id)}
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
                        >
                          Regresar
                        </Button>
                      )}
                      {!isLastStep && (
                        <Button
                          hideIcon
                          onClick={handleNext}
                          disabled={!canAdvance}
                        >
                          Siguiente
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
            ))}
          </Breadcrumbs>
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default InternalDeviceEdit
