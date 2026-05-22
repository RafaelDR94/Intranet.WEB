'use client'

import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'

import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/app/components/Button/Button'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type { FieldModel } from '@/app/components/DynamicForm/types'
import type { InitialFile } from '@/app/components/FileUploader/types'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import SignaturePad from '@/app/components/SignaturePAD/SignaturePAD'

import type {
  ActivationTabId,
  PendingUserActivationPayload,
  PendingUserDetailData,
} from '../../types'

import {
  description,
  emptyMessage,
  previewContainer,
  previewImage,
  title,
} from '@/app/main-page/configuration/userconfiguration/components/Signature/styles'

const TAB_ORDER: ActivationTabId[] = ['employee', 'signature']

const TAB_LABELS: Record<ActivationTabId, string> = {
  employee: 'Información Empleado',
  signature: 'Firma',
}

const ROLE_OPTIONS = [
  { label: 'Diseñadora', value: 'designer' },
  { label: 'Supervisor RH', value: 'rh-supervisor' },
  { label: 'Compras', value: 'compras' },
  { label: 'Almacén', value: 'warehouse' },
]

type PendingUserActivationProps = {
  user: PendingUserDetailData | null
  roleOptions: { label: string; value: string }[]
  onActivate: (payload: PendingUserActivationPayload) => void | Promise<void>
  onClose: () => void
}

const getInitialActivationValues = (
  user: PendingUserDetailData | null,
): Omit<PendingUserActivationPayload, 'userId' | 'signature'> => ({
  profileImage: null,
  email: user?.email ?? '',
  businessPhone: user?.businessPhone ?? '',
  userRoleId: user?.userRoleId ?? '',
  managerialPermissions: Boolean(user?.managerialPermissions),
  provisionalPassword: user?.provisionalPassword ?? '',
  changePasswordOnNextLogin: Boolean(user?.changePasswordOnNextLogin),
  hasFingerprint: Boolean(user?.hasFingerprint),
})

const getEmployeeFields = (
  user: PendingUserDetailData,
  roleOptions: { label: string; value: string }[],
  initialImage?: InitialFile,
): FieldModel[] => [
  {
    type: 'imageUploaderExpanded',
    name: 'profileImage',
    label: 'Imagen',
    value: null,
    initialFile: initialImage,
    preview: true,
    previewCoverMode: true,
    buttonLabel: 'Subir imagen',
    accept: 'image/*',
    className: '!min-h-[290px] !w-full',
  },
  {
    type: 'input',
    name: 'employeeNumber',
    label: 'No. de empleado',
    value: user.employeeNumber,
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'firstName',
    label: 'Primer Nombre*',
    value: user.firstName,
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'middleName',
    label: 'Segundo Nombre',
    value: user.middleName,
    disabled: true,
  },
  {
    type: 'input',
    name: 'lastName',
    label: 'Primer Apellido*',
    value: user.lastName,
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'secondLastName',
    label: 'Segundo Apellido',
    value: user.secondLastName,
    disabled: true,
  },
  {
    type: 'select',
    name: 'departmentLabel',
    label: 'Departamentos*',
    value: user.departmentLabel,
    options: [{ label: user.departmentLabel, value: user.departmentLabel }],
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'select',
    name: 'companyLabel',
    label: 'Empresa*',
    value: user.companyLabel,
    options: [{ label: user.companyLabel, value: user.companyLabel }],
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'positionLabel',
    label: 'Puesto*',
    value: user.positionLabel,
    disabled: true,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'email',
    label: 'Correo Electrónico*',
    value: user.email,
    validations: [{ type: 'required' }, { type: 'email' }],
  },
  {
    type: 'input',
    name: 'businessPhone',
    label: 'Teléfono*',
    value: user.businessPhone,
  },
  {
    type: 'select',
    name: 'userRoleId',
    label: 'Seleccionar rol de usuario',
    value: user.userRoleId,
    options: roleOptions.length > 0 ? roleOptions : ROLE_OPTIONS,
    validations: [{ type: 'required' }],
  },
  {
    type: 'checkbox',
    name: 'managerialPermissions',
    label: 'Permisos gerenciales',
    value: user.managerialPermissions,
    className: 'gap-4 [&>span]:text-b1 [&>span]:text-green-90',
  },
  {
    type: 'password',
    name: 'provisionalPassword',
    label: 'Contraseña provisional*',
    value: user.provisionalPassword,
    validations: [{ type: 'required' }],
  },
  {
    type: 'toggle',
    name: 'changePasswordOnNextLogin',
    label: 'Solicitar cambio de contraseña en el siguiente acceso',
    value: user.changePasswordOnNextLogin,
    className:
      'items-start gap-4 [&>span]:max-w-[290px] [&>span]:text-b1 [&>span]:leading-8 [&>span]:text-green-90',
  },
  {
    type: 'toggle',
    name: 'hasFingerprint',
    label: 'Captura dactilar',
    value: user.hasFingerprint,
    className: 'items-center gap-4 [&>span]:text-b1 [&>span]:text-green-90',
  },
]

const SignatureDraftCard = ({
  signature,
  onOpenPad,
}: {
  signature: string
  onOpenPad: () => void
}) => (
  <section className="space-y-4">
    <h3 className={title}>Firma Digital</h3>
    <p className={description}>
      La firma se insertará en los documentos después de haber autorizado una
      acción
    </p>
    <div className="flex flex-col items-center gap-4">
      <div className={clsx(previewContainer, 'w-full max-w-[280px]')}>
        {signature ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={signature}
            alt="Firma del usuario"
            className={clsx(previewImage, 'max-h-[85px]')}
          />
        ) : (
          <span className={emptyMessage}>
            Aún no hay una firma cargada para esta activación.
          </span>
        )}
      </div>

      <Button
        onClick={onOpenPad}
        variant="solid"
        hideIcon
        className="h-8 px-6 text-c3 min-w-[110px]"
      >
        {signature ? 'Actualizar Firma' : 'Crear Firma'}
      </Button>
    </div>
  </section>
)

const PendingUserActivation: React.FC<PendingUserActivationProps> = ({
  user,
  roleOptions,
  onActivate,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<ActivationTabId>('employee')
  const [employeeFormValid, setEmployeeFormValid] = useState(false)
  const [signaturePadOpen, setSignaturePadOpen] = useState(false)
  const [draftSignature, setDraftSignature] = useState('')
  const [formValues, setFormValues] = useState<
    Omit<PendingUserActivationPayload, 'userId' | 'signature'>
  >(() => getInitialActivationValues(user))

  useEffect(() => {
    setActiveStep('employee')
    setDraftSignature(user?.signature ?? '')
    setSignaturePadOpen(false)
    setFormValues(getInitialActivationValues(user))
  }, [user?.id, user?.signature])

  const initialImage = useMemo<InitialFile | undefined>(() => {
    if (!user?.avatarUrl) return undefined

    return {
      name: `${user.fullname}.jpg`,
      url: user.avatarUrl,
    }
  }, [user?.avatarUrl, user?.fullname])

  const employeeFields = useMemo(
    () => (user ? getEmployeeFields(user, roleOptions, initialImage) : []),
    [initialImage, roleOptions, user],
  )

  const currentStepIndex = TAB_ORDER.indexOf(activeStep)
  const canGoBack = currentStepIndex > 0
  const canGoNext = currentStepIndex < TAB_ORDER.length - 1
  const canActivate = Boolean(user?.id && employeeFormValid)

  const handlePreviousStep = () => {
    if (!canGoBack) return
    setActiveStep(TAB_ORDER[currentStepIndex - 1])
  }

  const handleNextStep = () => {
    if (activeStep === 'employee' && !employeeFormValid) return
    if (!canGoNext) return
    setActiveStep(TAB_ORDER[currentStepIndex + 1])
  }

  const employeeContent = (
    <DynamicForm
      fields={employeeFields}
      onSubmit={() => undefined}
      showSubmitIf={() => false}
      onValidChange={setEmployeeFormValid}
      onValuesChange={(values) => {
        setFormValues((current) => ({
          ...current,
          ...values,
        }))
      }}
      dataTestId="it-users-pending-employee-form"
      responsiveLayoutMatrix={{
        sm: [
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
          [10],
        ],
        md: [
          [4, 6],
          [5, 5],
          [5, 5],
          [3.34, 3.33, 3.33],
          [3.34, 3.33, 3.33],
          [3.34, 3.33, 3.33],
          [5, 5],
        ],
        lg: [
          [3.2, 3.4, 3.4],
          [3.2, 3.4, 3.4],
          [3.2, 3.4, 3.4],
          [3.34, 3.33, 3.33],
          [3.34, 3.33, 3.33],
          [5, 5],
        ],
      }}
    />
  )

  const signatureContent = (
    <div className="max-w-[340px] pt-2">
      <SignatureDraftCard
        signature={draftSignature}
        onOpenPad={() => setSignaturePadOpen(true)}
      />
    </div>
  )

  return (
    <>
      {!user ? (
        <FormsLayout
          title="Activar Empleado"
          primaryLabel="Activar cuenta"
          showPrimaryButton={false}
          showSecondaryButton
          onSecondaryClick={onClose}
          enableCollapse={false}
        >
          <div className="w-full text-center text-gray-70">
            Selecciona un usuario para activar su cuenta.
          </div>
        </FormsLayout>
      ) : (
        <FormsLayout
          title="Activar Empleado"
          primaryLabel="Activar cuenta"
          showSecondaryButton
          onSecondaryClick={onClose}
          secondaryLabel="Cancelar"
          onPrimaryClick={() => {
            if (!user) return
            onActivate({
              userId: user.id,
              ...formValues,
              signature: draftSignature,
            })
          }}
          primaryDisabled={!canActivate}
          enableCollapse={false}
        >
          <div className="w-full space-y-6">
            <Breadcrumbs
              activeId={activeStep}
              onActiveChange={(id) => setActiveStep(id as ActivationTabId)}
              ariaLabel="Secciones de activación"
              dataTestId="it-users-pending-breadcrumbs"
            >
              <Breadcrumbs.Item
                id="employee"
                label={TAB_LABELS.employee}
                renderContent={employeeContent}
              />
              <Breadcrumbs.Item
                id="signature"
                label={TAB_LABELS.signature}
                renderContent={signatureContent}
              />
            </Breadcrumbs>

            <div className="flex items-center justify-between pt-5">
              <Button
                type="button"
                variant="outline"
                hideIcon
                onClick={handlePreviousStep}
                disabled={!canGoBack}
              >
                Regresar
              </Button>

              {canGoNext ? (
                <Button
                  type="button"
                  hideIcon
                  onClick={handleNextStep}
                  disabled={activeStep === 'employee' && !employeeFormValid}
                >
                  Siguiente
                </Button>
              ) : (
                <p className="text-right text-label text-gray-70">
                  La firma es opcional para activar la cuenta.
                </p>
              )}
            </div>
          </div>
        </FormsLayout>
      )}

      {signaturePadOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-gray-90/70 p-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-4xl">
            <SignaturePad
              onSignatureSave={(signature) => {
                setDraftSignature(signature)
                setSignaturePadOpen(false)
              }}
              onCancel={() => setSignaturePadOpen(false)}
              fullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

export default PendingUserActivation
