'use client'

import React from 'react'

import Avatar from '@/app/components/Avatar/Avatar'
import { Button } from '@/app/components/Button/Button'
import Label from '@/app/components/Label/Label'
import MailIcon from '@/assets/icons/Comunicacion/mail.svg'
import PhoneIcon from '@/assets/icons/Comunicacion/phone.svg'
import FingerprintCheckIcon from '@/assets/icons/Identy/fingerprint-check-circle.svg'
import FingerprintErrorIcon from '@/assets/icons/Identy/fingerprint-error-circle.svg'
import NetworkRightIcon from '@/assets/icons/Connectivity/network-right.svg'
import UserIcon from '@/assets/icons/Users/Users/user.svg'

import type { UserAccountDetailData } from '../../../types'

type DetailsTabProps = {
  user: UserAccountDetailData
  onGoToUpdateUser: () => void
}

const DetailsTab: React.FC<DetailsTabProps> = ({ user, onGoToUpdateUser }) => {
  return (
    <div className="min-w-0 space-y-6 pt-3">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <Avatar
            src={user.avatarUrl}
            alt={user.fullname}
            size="xl"
            online={false}
            className="h-[96px] w-[96px] rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-b3 text-gray-90">
            <span className="font-medium">EMPRESA:</span>{' '}
            <span>{user.company}</span>
          </p>

          <Label
            type={user.isActive ? 'valido' : 'invalido'}
            text={user.statusLabel}
          />

          <div className="flex items-center gap-3">
            {user.hasFingerprint ? (
              <FingerprintCheckIcon className="text-green-70" />
            ) : (
              <FingerprintErrorIcon className="text-alert-red-100" />
            )}
            <Button
              variant="ghost"
              size="xsmall"
              hideIcon
              className={
                user.hasFingerprint
                  ? 'px-0 text-green-80'
                  : 'px-0 text-alert-red-100'
              }
              onClick={onGoToUpdateUser}
            >
              Actualizar huella
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-b3 text-gray-90">
        <UserIcon className="mt-1 shrink-0 text-blue-80" />
        <div>
          <p className="font-medium uppercase">No. Empleado:</p>
          <p>{user.employeeNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 text-b3 text-gray-90 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <PhoneIcon className="mt-1 shrink-0 text-blue-80" />
          <div>
            <p className="font-medium uppercase">Teléfono</p>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MailIcon className="mt-1 shrink-0 text-blue-80" />
          <div>
            <p className="font-medium uppercase">Correo</p>
            <p className="break-all">{user.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <NetworkRightIcon className="mt-1 shrink-0 text-blue-80" />
          <div>
            <p className="font-medium uppercase">Departamento</p>
            <p>{user.departmentLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <NetworkRightIcon className="mt-1 shrink-0 text-blue-80" />
          <div>
            <p className="font-medium uppercase">Puesto</p>
            <p>{user.positionLabel}</p>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-20" />

      <div className="space-y-4">
        <h3 className="text-s1 font-semibold text-green-100">Roles</h3>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-b3 text-gray-90">Rol asignado: {user.roleName}</p>
          <Button
            hideIcon
            size="small"
            className="self-start"
            onClick={onGoToUpdateUser}
          >
            Cambiar rol
          </Button>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-20" />

      <div className="space-y-4">
        <h3 className="text-s1 font-semibold text-green-100">
          Dispositivos Asignados
        </h3>

        <div className="space-y-4 text-b3 text-gray-90">
          {user.assignedDevices.length > 0 ? (
            user.assignedDevices.map((device) => (
              <p key={device.id}>
                <span className="font-medium">{device.typeLabel}:</span>{' '}
                {device.description}
              </p>
            ))
          ) : (
            <p>Sin asignar</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailsTab
