'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import ArrowLeftIcon from '@/assets/icons/navegacion/long-arrow-up-left.svg'

type DeviceBrandFormProps = {
  brand: InternalDeviceBrand | null
  onBack: () => void
  mode?: 'edit' | 'create'
}

const formLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10]],
  md: [[5, 5], [5, 5], [10]],
  lg: [[3.3, 3.3, 3.3], [10]],
}

const DeviceBrandForm: React.FC<DeviceBrandFormProps> = ({
  brand,
  onBack,
  mode = 'edit',
}) => {
  const isMobile = useIsMobile()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const isCreate = mode === 'create'

  const {
    createDeviceBrand,
    updateDeviceBrand,
    activateDeviceBrand,
    creatingDeviceBrand,
    updatingDeviceBrand,
    activatingDeviceBrand,
  } = useInternalDevicesStore(
    (state) => ({
      createDeviceBrand: state.createDeviceBrand,
      updateDeviceBrand: state.updateDeviceBrand,
      activateDeviceBrand: state.activateDeviceBrand,
      creatingDeviceBrand: state.creatingDeviceBrand,
      updatingDeviceBrand: state.updatingDeviceBrand,
      activatingDeviceBrand: state.activatingDeviceBrand,
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

    if (!brand) return
    setFormValues({
      name: brand.name ?? '',
      extract: brand.name ?? '',
      status: brand.is_active ? 'active' : 'inactive',
      description: brand.description ?? '',
    })
    setFormVersion((prev) => prev + 1)
  }, [brand, isCreate])

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
        placeholder: 'Nombre de la marca',
        value: formValues.name ?? '',
        validations: [{ type: 'required' }],
      },
      {
        type: 'input',
        name: 'extract',
        label: 'Extracto*',
        placeholder: 'Extracto',
        value: formValues.extract ?? '',
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
    const name = String(formValues.name ?? '').trim()
    const extract = String(formValues.extract ?? '').trim()
    const description = String(formValues.description ?? '').trim()
    const desiredActive = formValues.status === 'inactive' ? false : true

    if (!name || !extract || !description) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Completa nombre, extracto y descripcion para continuar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      return
    }

    if (isCreate) {
      const created = await createDeviceBrand({
        name: name || extract,
        description,
      })

      if (created && !desiredActive) {
        await activateDeviceBrand(created.device_brand_id)
      }

      if (created) {
        onBack()
      }
      return
    }

    if (!brand) {
      showAlert({
        type: 'error',
        title: 'Marca no disponible',
        description: 'No se encontro informacion de la marca.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      return
    }

    const updated = await updateDeviceBrand({
      device_brand_id: brand.device_brand_id,
      name: name || brand.name,
      description: description || brand.description,
    })

    if (updated && brand.is_active !== desiredActive) {
      await activateDeviceBrand(brand.device_brand_id)
    }

    if (updated) {
      onBack()
    }
  }, [activateDeviceBrand, brand, createDeviceBrand, formValues, isCreate, onBack, showAlert, updateDeviceBrand])

  if (!brand && !isCreate) {
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
              <span className="text-b4 text-blue-60">Editar marca</span>
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
            Cargando informacion de la marca...
          </div>
        </CollapsibleSection>
      </div>
    )
  }

  const isSaving = creatingDeviceBrand || updatingDeviceBrand || activatingDeviceBrand

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
              {isCreate ? 'Nueva marca' : 'Editar marca'}
            </span>
          </button>
        }
        enableCollapse={false}
        rightContent={
          <Button
            hideIcon
            onClick={handleSave}
            disabled={isSaving || (!brand && !isCreate)}
            className={isMobile ? 'w-full mt-3' : ''}
          >
            Guardar informacion
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
            dataTestId="device-brand-form"
          />
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default DeviceBrandForm
