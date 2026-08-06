'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { Button } from '@/app/components/Button/Button'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import type { FieldModel } from '@/app/components/DynamicForm/types'
import type { InitialFile } from '@/app/components/FileUploader/types'
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded'
import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useUsersStore } from '@/app/stores/useUsersStore/useUsersStore'

import type { UserAccountDetailData } from '../../../types'

type UpdateUserTabProps = {
  user: UserAccountDetailData
}

const UpdateUserTab: React.FC<UpdateUserTabProps> = ({ user }) => {
  const { currentPagePermissions } = useAuth()
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { firebasestorage } = useFirebase()
  const submitRef = useRef<(() => void | Promise<any>) | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const {
    roles,
    fetchRoles,
    fetchEmployeesWithActiveUser,
    fetchUserById,
    updateUserProfile,
    updating,
  } = useUsersStore(
    (state) => ({
      roles: state.roles,
      fetchRoles: state.fetchRoles,
      fetchEmployeesWithActiveUser: state.fetchEmployeesWithActiveUser,
      fetchUserById: state.fetchUserById,
      updateUserProfile: state.updateUserProfile,
      updating: state.updating,
    }),
    shallow,
  )

  const { fetchEmployeeById } = useEmployeesStore(
    (state) => ({
      fetchEmployeeById: state.fetchEmployeeById,
    }),
    shallow,
  )

  useEffect(() => {
    void fetchRoles(false)
  }, [fetchRoles])

  const initialImage = useMemo<InitialFile | undefined>(() => {
    if (!user.avatarUrl) return undefined

    return {
      name: `${user.fullname}.jpg`,
      url: user.avatarUrl,
    }
  }, [user.avatarUrl, user.fullname])

  const roleOptions = useMemo(() => {
    const mappedRoles = roles.map((role) => ({
      label: role.name,
      value: role.id,
    }))

    if (
      user.userRoleId &&
      user.roleName &&
      !mappedRoles.some((role) => role.value === user.userRoleId)
    ) {
      return [
        ...mappedRoles,
        { label: user.roleName, value: user.userRoleId },
      ]
    }

    return mappedRoles
  }, [roles, user.roleName, user.userRoleId])

  const fields = useMemo<FieldModel[]>(
    () => [
      {
        type: 'input',
        name: 'email',
        label: 'Correo electronico',
        value: user.email,
        inputSize: 'sm',
        className:
          '!mb-0 !w-full !rounded-[8px] !border-[1.5px] !border-gray-40 !px-3 !py-2 !text-b3 text-black-100',
        validations: [{ type: 'required' }, { type: 'email' }],
      },
      {
        type: 'input',
        name: 'businessPhone',
        label: 'Telefono empresarial',
        value: user.businessPhone,
        inputSize: 'sm',
        className:
          '!mb-0 !w-full !rounded-[8px] !border-[1.5px] !border-gray-40 !px-3 !py-2 !text-b3 text-black-100',
      },
      {
        type: 'select',
        name: 'roleId',
        label: 'Seleccionar rol de usuario',
        value: user.userRoleId,
        options: roleOptions,
        className:
          '[&>div:first-of-type]:min-h-[40px] [&>div:first-of-type]:rounded-[8px] [&>div:first-of-type]:border-[1.5px] [&>div:first-of-type]:border-gray-40 [&>div:first-of-type]:px-3 [&>div:first-of-type]:py-2 [&>label]:text-label [&>label]:text-gray-70',
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
        label: 'Contrasena provisional',
        value: '',
        autoComplete: 'new-password',
        inputSize: 'sm',
        className:
          '!mb-0 !w-full !rounded-[8px] !border-[1.5px] !border-gray-40 !px-3 !py-2 !pr-10 !text-b3 text-black-100',
      },
      {
        type: 'toggle',
        name: 'changePasswordOnNextLogin',
        label: 'Solicitar cambio de contrasena en el siguiente acceso',
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
    ],
    [roleOptions, user],
  )

  const handleSubmit = async (values: Record<string, any>) => {
    if (!currentPagePermissions?.updateUser) return
    if (!user.userId) {
      showAlert({
        type: 'warning',
        title: 'Usuario no disponible',
        description:
          'Aun no se carga el identificador del usuario. Espera un momento e intenta nuevamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1800,
      })
      return
    }

    try {
      showSpinner({ message: 'Actualizando perfil del usuario...' })

      const email = String(values.email ?? '').trim()
      const roleId = String(values.roleId ?? user.userRoleId ?? '').trim()
      const changePasswordOnNextLogin = Boolean(
        values.changePasswordOnNextLogin,
      )
      const provisionalPassword = String(values.provisionalPassword ?? '').trim()

      let imageUrl = user.avatarUrl ?? ''

      if (selectedImage) {
        if (!firebasestorage?.uploadImage) {
          throw new Error('Firebase no esta disponible para subir la imagen.')
        }

        imageUrl = await firebasestorage.uploadImage(
          selectedImage,
          `Employees/${user.id}/profileImage.jpg`,
        )
      }

      const updatedProfile = await updateUserProfile({
        userId: user.userId,
        employeeId: user.id,
        roleId,
        email,
        phoneNumber: String(values.businessPhone ?? '').trim(),
        imageUrl,
        isGerence: Boolean(values.managerialPermissions),
        drFingerprint: Boolean(values.hasFingerprint),
        password: provisionalPassword,
        changePassword: changePasswordOnNextLogin,
      })

      if (!updatedProfile) {
        showAlert({
          type: 'error',
          title: 'No fue posible actualizar el usuario',
          description:
            'El backend no devolvio una respuesta valida para la actualizacion.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1800,
        })
        return
      }

      await Promise.all([
        fetchEmployeesWithActiveUser(true),
        fetchEmployeeById(user.id, true),
        fetchUserById(user.userId, true),
      ])

      setSelectedImage(null)

      showAlert({
        type: 'success',
        title: 'Usuario actualizado',
        description: `Los datos de ${user.username} se actualizaron correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1600,
      })
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : 'Ocurrio un error al actualizar el usuario.'

      showAlert({
        type: 'error',
        title: 'Error al actualizar usuario',
        description,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      })
    } finally {
      hideSpinner()
    }
  }

  return (
    <div className="space-y-4 pt-[18px]">
      <div className="w-[159px]">
        <ImageUploaderExpanded
          onImage={(file) => {
            setSelectedImage(file instanceof File ? file : null)
          }}
          initialFile={initialImage}
          preview
          previewCoverMode
          buttonLabel="Cambiar imagen"
          className="!min-h-[143px] !w-[159px]"
          previewWrapperClassName="!mx-0 !h-[143px] !w-[159px] !rounded-[10px]"
          previewImageClassName="!h-[143px] !w-[159px] !rounded-[10px]"
          previewActionsClassName="!bottom-2"
          previewButtonClassName="!h-[24px] !rounded-[8px] !border-[1.5px] !border-green-80 !bg-transparent !px-4 !py-[6px] !text-[10px] !font-semibold !leading-[12px] !text-green-80"
          dataTestId="it-users-update-user-image"
        />
      </div>

      <div className="h-px w-full max-w-[420px] bg-[#9EB9C7]" />

      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        showSubmitIf={() => false}
        externalSubmitRef={submitRef}
        dataTestId="it-users-update-user-form"
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10], [10]],
          md: [[10], [10], [10], [10], [10], [10], [10]],
          lg: [[10], [10], [10], [10], [10], [10], [10]],
        }}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          size="medium"
          hideIcon
          onClick={() => submitRef.current?.()}
          disabled={updating}
          className="min-w-[177px] rounded-[12px] px-8 py-3 text-b1"
        >
          Guardar ajustes
        </Button>
      </div>
    </div>
  )
}

export default UpdateUserTab
