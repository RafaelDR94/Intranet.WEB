"use client";

import React from "react";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import MailIcon from "@/assets/icons/Comunicacion/mail.svg";
import PhoneIcon from "@/assets/icons/Comunicacion/phone.svg";
import NetworkRightIcon from "@/assets/icons/Connectivity/network-right.svg";
import FingerprintCheckIcon from "@/assets/icons/Identy/fingerprint-check-circle.svg";
import FingerprintErrorIcon from "@/assets/icons/Identy/fingerprint-error-circle.svg";
import GroupIcon from "@/assets/icons/Users/Users/group.svg";
import UserIcon from "@/assets/icons/Users/Users/user.svg";
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

type DetailFieldProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

const DetailField = ({ icon: Icon, label, value }: DetailFieldProps) => (
  <div className="flex items-start gap-3 text-b3 text-gray-90">
    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center overflow-visible">
      <Icon className="h-6 w-6 overflow-visible text-blue-80" />
    </div>
    <div className="min-w-0">
      <p className="font-medium uppercase">{label}</p>
      <p className="break-words">{value}</p>
    </div>
  </div>
);

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
  const managerName = detailEmployee?.manager_name || "N/A";
  const hasFingerprint = Boolean(detailEmployee?.dr_fingerprint);

  const laboralContent = detailEmployee ? (
    <div className="min-w-0 space-y-6 pt-2">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <Avatar
            src={detailEmployee.image_url}
            alt={detailDisplay?.fullname || "Colaborador"}
            initials={detailDisplay?.fullname}
            size="xl"
            online={false}
            className="h-[210px] w-[210px] rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-b2 text-gray-90">
            <span className="font-medium uppercase">Empresa:</span>{" "}
            <span>
              {detailDepartment?.enterprice_name || organizationChartEmptyValue}
            </span>
          </p>

          <Label
            type={detailEmployee.is_active ? "valido" : "invalido"}
            text={detailEmployee.is_active ? "Activo" : "Inactivo"}
            className="m-0"
          />

          {canSeeInformation ? (
            <div className="flex items-center gap-3">
              {hasFingerprint ? (
                <FingerprintCheckIcon className="text-green-70" />
              ) : (
                <FingerprintErrorIcon className="text-alert-red-100" />
              )}
              <Button
                variant="ghost"
                size="xsmall"
                hideIcon
                className={
                  hasFingerprint
                    ? "px-0 text-green-80"
                    : "px-0 text-alert-red-100"
                }
              >
                Actualizar huella
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
        {showEmployeeNumber ? (
          <DetailField
            icon={UserIcon}
            label="No. Empleado"
            value={detailDisplay?.employeeNumber || organizationChartEmptyValue}
          />
        ) : null}
        <DetailField icon={UserStarIcon} label="Responsable" value={managerName} />
        <DetailField
          icon={PhoneIcon}
          label="Teléfono"
          value={detailDisplay?.phone || organizationChartEmptyValue}
        />
        <DetailField
          icon={MailIcon}
          label="Correo"
          value={detailDisplay?.email || organizationChartEmptyValue}
        />
        <DetailField
          icon={GroupIcon}
          label="Departamento"
          value={detailDepartment?.name || organizationChartEmptyValue}
        />
        <DetailField
          icon={NetworkRightIcon}
          label="Puesto"
          value={detailDisplay?.position || organizationChartEmptyValue}
        />
      </div>

      <div className="h-px w-full bg-gray-20" />

      {showAssignedDevices ? (
        <div className="space-y-4">
          <h3 className="text-s1 font-semibold text-green-100">
            Dispositivos Asignados
          </h3>

          <div className="space-y-4 text-b3 text-gray-90">
            <p>
              <span className="font-medium">Teléfono:</span>{" "}
              {organizationChartEmptyValue}
            </p>
            <p>
              <span className="font-medium">Computadora:</span>{" "}
              {organizationChartEmptyValue}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      divider={false}
      collapsedWidthClass="w-[478px] min-w-[478px]"
      contentClassName="px-4 pb-6 pt-0 sm:px-5 md:px-7"
    >
      {!detailEmployee ? (
        <div className="text-b3 text-gray-100">Selecciona un colaborador.</div>
      ) : (
        <div className="min-w-0 space-y-[18px]">
          <h2 className="break-words text-s1 font-semibold leading-tight text-green-100">
            {detailDisplay?.fullname}
          </h2>

          <div className="space-y-4">
            <div className="w-fit rounded-[8px] bg-green-80 px-4 py-[6px] text-btn-xs font-semibold text-white">
              Información Laboral
            </div>
            {laboralContent}
          </div>
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default OrganizationChartEmployeeDetailsPanel;
