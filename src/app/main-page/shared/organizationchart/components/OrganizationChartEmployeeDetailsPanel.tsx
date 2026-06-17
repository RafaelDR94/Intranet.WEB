"use client";
import React from "react";
import Image from "next/image";

import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import MailIcon from "@/assets/icons/Comunicacion/mail.svg";
import PhoneIcon from "@/assets/icons/Comunicacion/phone.svg";
import UserIcon from "@/assets/icons/Users/Users/user.svg";
import GroupIcon from "@/assets/icons/Users/Users/group.svg";
import PositionIcon from "@/assets/icons/Maps/position.svg";
import UserStarIcon from "@/assets/icons/Users/Users/user-star.svg";
import {
  type OrganizationChartEmployee,
  getOrganizationChartEmployeeDetails,
  organizationChartEmptyValue,
} from "../employee.utils";

type EmployeeDetailsPanelProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeType | null;
  canSeeInformation: boolean;
};

const renderEmployeePhoto = (
  employee: OrganizationChartEmployee,
  fullname: string,
) => {
  if (employee.image_url) {
    return (
      <Image
        src={employee.image_url}
        alt={fullname || "Colaborador"}
        width={94}
        height={132}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-20 text-b2 font-semibold text-gray-70">
      {(fullname || "N").trim().charAt(0).toUpperCase()}
    </div>
  );
};

const OrganizationChartEmployeeDetailsPanel = ({
  open,
  onClose,
  employee,
  canSeeInformation,
}: EmployeeDetailsPanelProps) => {
  const { currentPagePermissions } = useAuth();
  const showEmployeeNumber = Boolean(currentPagePermissions?.showEmployeeNumber);
  const showAssignedDevices = Boolean(currentPagePermissions?.showAssignedDevices);
  const detailEmployee = employee as OrganizationChartEmployee | null;
  const detailDepartment = detailEmployee?.department;
  const detailDisplay = detailEmployee
    ? getOrganizationChartEmployeeDetails(detailEmployee)
    : null;
  const managerName = detailEmployee?.manager_id || organizationChartEmptyValue;

  const laboralContent = detailEmployee ? (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="h-[96px] w-[74px] shrink-0 overflow-hidden rounded-[8px] bg-gray-20">
          {renderEmployeePhoto(
            detailEmployee,
            detailDisplay?.fullname || "Colaborador",
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-c2 font-semibold text-gray-80">
            EMPRESA: {detailDepartment?.enterprice_name || organizationChartEmptyValue}
          </p>
          <span className="inline-flex rounded-full bg-green-20 px-3 py-1 text-b4 text-green-100">
            Activo
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-y-3 text-b3 text-gray-90 md:grid-cols-2 md:gap-x-4">
        {showEmployeeNumber ? (
          <div className="flex items-start gap-2">
            <UserIcon className="mt-0.5 h-4 w-4 text-blue-80" />
            <div>
              <dt className="font-semibold text-gray-90">NO. EMPLEADO:</dt>
              <dd>{detailDisplay?.employeeNumber || organizationChartEmptyValue}</dd>
            </div>
          </div>
        ) : null}
        <div className="flex items-start gap-2">
          <PhoneIcon className="mt-0.5 h-4 w-4 text-blue-80" />
          <div>
            <dt className="font-semibold text-gray-90">TELÉFONO:</dt>
            <dd>{detailDisplay?.phone || organizationChartEmptyValue}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GroupIcon className="mt-0.5 h-4 w-4 text-blue-80" />
          <div>
            <dt className="font-semibold text-gray-90">DEPARTAMENTO:</dt>
            <dd>{detailDepartment?.name || organizationChartEmptyValue}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MailIcon className="mt-0.5 h-4 w-4 text-blue-80" />
          <div>
            <dt className="font-semibold text-gray-90">CORREO:</dt>
            <dd className="break-all">{detailDisplay?.email || organizationChartEmptyValue}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2 md:col-span-2">
          <PositionIcon className="mt-0.5 h-4 w-4 text-blue-80" />
          <div>
            <dt className="font-semibold text-gray-90">PUESTO:</dt>
            <dd>{detailDisplay?.position || organizationChartEmptyValue}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2 md:col-span-2">
          <UserStarIcon className="mt-0.5 h-4 w-4 text-blue-80" />
          <div>
            <dt className="font-semibold text-gray-90">RESPONSABLE:</dt>
            <dd>{managerName}</dd>
          </div>
        </div>
      </dl>

      {showAssignedDevices ? (
        <div className="border-t border-gray-20 pt-4">
          <h3 className="text-s2 font-semibold text-gray-100">
            Dispositivos Asignados
          </h3>
          <dl className="mt-3 space-y-2 text-b3 text-gray-90">
            <div className="flex gap-1">
              <dt className="font-semibold text-gray-90">TELÉFONO:</dt>
              <dd>{organizationChartEmptyValue}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-semibold text-gray-90">COMPUTADORA:</dt>
              <dd>{organizationChartEmptyValue}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <DetailsPanelLayout open={open} onClose={onClose} divider={false}>
      {!detailEmployee ? (
        <div className="text-b3 text-gray-100">Selecciona un colaborador.</div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-s1 font-semibold text-green-100">
              {detailDisplay?.fullname}
            </h2>
          </div>

          {canSeeInformation ? (
            <ButtonsNavigation
              ariaLabel="Secciones de Información"
              buttonSize="small"
              activeVariant="solid"
              inactiveVariant="outline"
            >
              <ButtonsNavigation.Item
                id="laboral"
                label="Información Laboral"
                renderContent={laboralContent}
              />
            </ButtonsNavigation>
          ) : (
            <div className="space-y-4">
              <div className="mb-6 mt-3 w-[157px] rounded-[8px] bg-green-80 px-[8px] py-[6px] text-b4 text-white">
                Información Laboral
              </div>
              {laboralContent}
            </div>
          )}
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default OrganizationChartEmployeeDetailsPanel;
