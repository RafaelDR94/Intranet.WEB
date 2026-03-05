'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import CollapsibleSection from '@/app/components/CollapsibleSection/CollapsibleSection'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type {
  FieldModel,
  ResponsiveLayoutMatrix,
} from '@/app/components/DynamicForm/types'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { useInternalDevicesStore } from '@/app/stores/useInternalDevicesStore/useInternalDevicesStore'
import ArrowLeftIcon from '@/assets/icons/navegacion/nav-arrow-left.svg'

type InternalDeviceReviewProps = {
  device: InternalDevice | null
  onBack: () => void
}

const formLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10]],
  md: [[5, 5], [10]],
  lg: [[4, 6], [10]],
}

const InternalDeviceReview: React.FC<InternalDeviceReviewProps> = ({
  device,
  onBack,
}) => {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert

  const {
    deviceStatuses,
    fetchDeviceStatuses,
    createDeviceReview,
    creatingDeviceReview,
  } = useInternalDevicesStore(
    (state) => ({
      deviceStatuses: state.deviceStatuses,
      fetchDeviceStatuses: state.fetchDeviceStatuses,
      createDeviceReview: state.createDeviceReview,
      creatingDeviceReview: state.creatingDeviceReview,
    }),
    shallow,
  )

  const [formVersion, setFormVersion] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, any>>({
    status_id: '',
    description: '',
  })
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    void fetchDeviceStatuses(undefined, true)
  }, [fetchDeviceStatuses])

  useEffect(() => {
    setFormValues({ status_id: '', description: '' })
    setIsValid(false)
    setFormVersion((prev) => prev + 1)
  }, [device])

  const statusOptions = useMemo(
    () =>
      deviceStatuses.map((item) => ({
        label: item.name,
        value: item.device_status_id,
      })),
    [deviceStatuses],
  )

  const fields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'select',
        name: 'status_id',
        label: 'Revision a realizar*',
        value: formValues.status_id ?? '',
        options: statusOptions,
        validations: [{ type: 'required' }],
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Observaciones',
        value: formValues.description ?? '',
        rows: 6,
      },
    ],
    [formValues, statusOptions],
  )

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...values }))
  }, [])

  const handleSave = useCallback(async () => {
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

    const userId = user?.idUser
    if (!userId) {
      showAlert({
        type: 'warning',
        title: 'Usuario no disponible',
        description: 'No se encontro el usuario autenticado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      return
    }

    if (!formValues.status_id) {
      showAlert({
        type: 'warning',
        title: 'Datos incompletos',
        description: 'Selecciona la revision a realizar para continuar.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      })
      return
    }

    const result = await createDeviceReview({
      description: formValues.description ?? '',
      device_id: device.device_id,
      user_id: userId,
      status_id: formValues.status_id,
    })

    if (result) {
      onBack()
    }
  }, [createDeviceReview, device, formValues, onBack, showAlert, user?.idUser])

  if (!device) {
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
              <span>Nueva Revision de Dispositivo</span>
            </button>
          }
          enableCollapse={false}
          rightContent={
            <Button hideIcon disabled className={isMobile ? 'w-full mt-3' : ''}>
              Guardar Informacion
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
            <span>Nueva Revision de Dispositivo</span>
          </button>
        }
        enableCollapse={false}
        rightContent={
          <Button
            hideIcon
            onClick={handleSave}
            disabled={!isValid || creatingDeviceReview}
            className={isMobile ? 'w-full mt-3' : ''}
          >
            Guardar Informacion
          </Button>
        }
      >
        <div className="rounded-2xl bg-white-100 p-6 shadow-md">
          <div className="mb-6 text-b2 text-blue-100">Dispositivo</div>
          <DynamicForm
            fields={fields}
            onValuesChange={handleValuesChange}
            onValidChange={setIsValid}
            responsiveLayoutMatrix={formLayout}
            dataTestId="internal-device-review-form"
            onSubmit={() => undefined}
            valuesVersion={formVersion}
            valuesVersionActive
            showSubmitIf={() => false}
            disabled={!device}
          />
          <div className="h-6" />
          <div className="rounded-xl border border-blue-100/40 bg-white-100 p-6 text-gray-60" />
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default InternalDeviceReview
