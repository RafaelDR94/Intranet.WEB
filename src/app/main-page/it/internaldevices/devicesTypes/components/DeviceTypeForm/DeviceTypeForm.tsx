'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import ArrowLeftIcon from '@/assets/icons/navegacion/long-arrow-up-left.svg'

type DeviceTypeFormProps = {
  deviceType: InternalDeviceType | null
  onBack: () => void
  mode?: 'edit' | 'create'
}

const formLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10]],
  md: [[5, 5], [5, 5], [10]],
  lg: [[3.3, 3.3, 3.3], [10]],
}

const DeviceTypeForm: React.FC<DeviceTypeFormProps> = ({
  deviceType,
  onBack,
  mode = 'edit',
}) => {
  const { currentPagePermissions } = useAuth()
  const isMobile = useIsMobile()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const isCreate = mode === 'create'

  const {
    createDeviceType,
    updateDeviceType,
    activateDeviceType,
    creatingDeviceType,
    updatingDeviceType,
    activatingDeviceType,
  } = useInternalDevicesStore(
    (state) => ({
      createDeviceType: state.createDeviceType,
      updateDeviceType: state.updateDeviceType,
      activateDeviceType: state.activateDeviceType,
      creatingDeviceType: state.creatingDeviceType,
      updatingDeviceType: state.updatingDeviceType,
      activatingDeviceType: state.activatingDeviceType,
    }),
    shallow,
  )

  const [formVersion, setFormVersion] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, any>>({})

  useEffect(() => {
    if (isCreate) {
      setFormValues({
        name: '',
        extract: '',
        status: 'active',
        description: '',
      })
      setFormVersion((prev) => prev + 1)
      return
    }

    if (!deviceType) return
    setFormValues({
      name: deviceType.name ?? '',
      extract: deviceType.name ?? '',
      status: deviceType.is_active ? 'active' : 'inactive',
      description: deviceType.description ?? '',
    })
    setFormVersion((prev) => prev + 1)
  }, [deviceType, isCreate])

  const statusOptions = useMemo(
    () => [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
    ],
    [],
  )

  const fields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'input',
        name: 'name',
        label: 'Nombre*',
        value: formValues.name ?? '',
        placeholder: 'Nombre de tipo de dispositivo',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'extract',
        label: 'Extracto*',
        value: formValues.extract ?? '',
        placeholder: 'Extracto',
        validations: [{ type: 'required' }],
      },
      {
        type: 'select',
        name: 'status',
        label: 'Estatus',
        value: formValues.status ?? 'active',
        options: statusOptions,
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Descripcion',
        value: formValues.description ?? '',
        rows: 4,
      },
    ],
    [formValues, statusOptions],
  )

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...values }))
  }, [])

  const handleSave = useCallback(async () => {
    if (isCreate ? !currentPagePermissions?.createDeviceType : !currentPagePermissions?.updateDeviceType) return
    const name = String(formValues.name ?? '').trim()
    const extract = String(formValues.extract ?? '').trim()
    const description = String(formValues.description ?? '').trim()
    const desiredActive = formValues.status === 'inactive' ? false : true

    if (!name || !extract || !description || !formValues.status) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Completa nombre, extracto, estatus y descripcion.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    if (isCreate) {
      const created = await createDeviceType({
        name: name || extract,
        description,
      })

      if (created && !desiredActive) {
        await activateDeviceType(created.device_type_id)
      }

      if (created) {
        onBack()
      }
      return
    }

    if (!deviceType) {
      showAlert({
        type: 'error',
        title: 'Tipo no disponible',
        description: 'No se encontro Información del tipo de dispositivo.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      return
    }

    const updated = await updateDeviceType({
      device_type_id: deviceType.device_type_id,
      name: name || deviceType.name,
      description: description || deviceType.description,
    })

    if (updated && deviceType.is_active !== desiredActive) {
      await activateDeviceType(deviceType.device_type_id)
    }

    if (updated) {
      onBack()
    }
  }, [activateDeviceType, createDeviceType, deviceType, formValues, isCreate, onBack, showAlert, updateDeviceType])

  if (!deviceType && !isCreate) {
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
              <span className="text-b4 text-blue-60">Editar tipo de dispositivo</span>
            </button>
          }
          enableCollapse={false}
          rightContent={
            <Button hideIcon disabled className={isMobile ? 'w-full mt-3' : ''}>
              Guardar Información
            </Button>
          }
        >
          <div className="rounded-2xl bg-white-100 p-6 text-gray-70 shadow-md">
            Cargando Información del tipo...
          </div>
        </CollapsibleSection>
      </div>
    )
  }

  const isSaving = creatingDeviceType || updatingDeviceType || activatingDeviceType

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
            <span className="text-b4 text-blue-60">
              {isCreate ? 'Nuevo tipo de dispositivo' : 'Editar tipo de dispositivo'}
            </span>
          </button>
        }
        enableCollapse={false}
        rightContent={
          <Button
            hideIcon
            onClick={handleSave}
            disabled={isSaving || (!deviceType && !isCreate)}
            className={isMobile ? 'w-full mt-3' : ''}
          >
            Guardar Información
          </Button>
        }
      >
        <div className="rounded-2xl bg-white-100 p-6 shadow-md">
          <DynamicForm
            fields={fields}
            onSubmit={() => undefined}
            onValuesChange={handleValuesChange}
            responsiveLayoutMatrix={formLayout}
            valuesVersion={formVersion}
            valuesVersionActive
            showSubmitIf={() => false}
            dataTestId="device-type-form"
          />
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default DeviceTypeForm
