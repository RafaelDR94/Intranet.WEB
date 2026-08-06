'use client'

import React, { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

import ButtonsNavigation from '@/app/components/ButtonsNavigation/ButtonsNavigation'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useUsersStore } from '@/app/stores/useUsersStore/useUsersStore'

import type { UserAccountDetailData } from '../../types'

import DetailsTab from './components/DetailsTab'
import UpdateUserTab from './components/UpdateUserTab'

export type UserAccountDetailProps = {
  open: boolean
  onClose: () => void
  user: UserAccountDetailData | null
}

type UserDetailSection = 'details' | 'update-user'

const UserAccountDetail: React.FC<UserAccountDetailProps> = ({
  open,
  onClose,
  user,
}) => {
  const { currentPagePermissions } = useAuth()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert
  const [activeSection, setActiveSection] =
    useState<UserDetailSection>('details')
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false)

  const { toggleActive, fetchEmployeesWithActiveUser, togglingActive, resetFlags } =
    useUsersStore(
      (state) => ({
        toggleActive: state.toggleActive,
        fetchEmployeesWithActiveUser: state.fetchEmployeesWithActiveUser,
        togglingActive: state.togglingActive,
        resetFlags: state.resetFlags,
      }),
      shallow,
    )

  useEffect(() => {
    if (open) setActiveSection('details')
  }, [open, user?.id])

  useEffect(() => {
    if (!open) setConfirmDeactivateOpen(false)
  }, [open])

  useEffect(() => {
    setConfirmDeactivateOpen(false)
  }, [user?.userId])

  const handleSectionChange = (section: string) => {
    if (section === 'deactivate-user') return
    setActiveSection(section as UserDetailSection)
  }

  const handleConfirmDeactivate = async () => {
    if (!currentPagePermissions?.deactivateUser) return
    if (!user?.userId || togglingActive) return

    const ok = await toggleActive({
      id: user.userId,
      isActive: false,
    })

    if (!ok) {
      showAlert({
        type: 'error',
        title: 'No fue posible desactivar el usuario',
        description:
          useUsersStore.getState().error ??
          'Ocurrio un error al desactivar el usuario.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1800,
      })
      resetFlags()
      return
    }

    await fetchEmployeesWithActiveUser(true)
    setConfirmDeactivateOpen(false)
    showAlert({
      type: 'success',
      title: 'Usuario desactivado',
      description: 'La cuenta fue desactivada correctamente.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1600,
    })
    resetFlags()
    onClose()
  }

  return (
    <>
      <DetailsPanelLayout
        open={open}
        onClose={onClose}
        zIndex={10000}
        divider={false}
        collapsedWidthClass="w-[478px] min-w-[478px]"
        contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
      >
        {!user ? (
          <div className="text-center text-gray-70">
            Selecciona un usuario para ver el detalle.
          </div>
        ) : (
          <div className="min-w-0 space-y-[18px]">
            <h2 className="break-words text-s1 font-semibold leading-tight text-green-100">
              {user.fullname}
            </h2>

            <ButtonsNavigation
              dataTestId="it-users-detail-nav"
              ariaLabel="Secciones del usuario"
              buttonSize="xsmall"
              activeVariant="solid"
              inactiveVariant="outline"
              activeId={activeSection}
              onActiveChange={handleSectionChange}
            >
              <ButtonsNavigation.Item
                id="details"
                label="Detalles"
                className="h-[24px] rounded-[8px] px-4 py-[6px]"
                renderContent={
                  <DetailsTab
                    user={user}
                    onGoToUpdateUser={() => setActiveSection('update-user')}
                  />
                }
              />
              {currentPagePermissions?.updateUser && <ButtonsNavigation.Item
                id="update-user"
                label="Actualizar Usuario"
                className="h-[24px] rounded-[8px] px-4 py-[6px]"
                renderContent={<UpdateUserTab user={user} />}
              />}
              {currentPagePermissions?.deactivateUser && activeSection !== 'update-user' && (
                <ButtonsNavigation.Item
                  id="deactivate-user"
                  label="Desactivar Usuario"
                  activeVariant="ghost"
                  inactiveVariant="ghost"
                  className="!ml-auto h-[24px] px-0 py-[6px] text-green-80"
                  disabled={!user.userId || togglingActive}
                  onClick={() => setConfirmDeactivateOpen(true)}
                />
              )}
            </ButtonsNavigation>
          </div>
        )}
      </DetailsPanelLayout>

      <PopUp
        open={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
        title="Desactivar usuario"
        content={`¿Esta seguro de desactivar a ${user?.fullname ?? 'este usuario'}?`}
        showPrimaryButton
        showSecondaryButton
        primaryButtonText={togglingActive ? 'Desactivando...' : 'Aceptar'}
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleConfirmDeactivate}
      />
    </>
  )
}

export default UserAccountDetail
