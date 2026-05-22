"use client";
import React from "react";
import Image from "next/image";

import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
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
            <div className="h-[132px] w-[94px] overflow-hidden rounded-[8px] bg-gray-20">
              {renderEmployeePhoto(
                detailEmployee,
                detailDisplay?.fullname || "Colaborador",
              )}
            </div>
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
                renderContent={
                  <div className="space-y-6">
                    <dl className="text-b3 space-y-2 text-gray-100">
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">EMPRESA:</dt>
                        <dd>
                          {detailDepartment?.enterprice_name ||
                            organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">
                          NO. EMPLEADO:
                        </dt>
                        <dd>
                          {detailDisplay?.employeeNumber ||
                            organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="my-6 flex gap-1">
                        <dt className="text-gray-90 font-semibold">
                          RESPONSABLE:
                        </dt>
                        <dd>
                          {detailEmployee.manager_id || organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">AREA:</dt>
                        <dd>
                          {detailDepartment?.name || organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">
                          POSICION DE TRABAJO:
                        </dt>
                        <dd>
                          {detailDisplay?.position || organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="mt-6 flex gap-1">
                        <dt className="text-gray-90 font-semibold">TELEFONO:</dt>
                        <dd>
                          {detailDisplay?.phone || organizationChartEmptyValue}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">CORREO:</dt>
                        <dd>
                          {detailDisplay?.email || organizationChartEmptyValue}
                        </dd>
                      </div>
                    </dl>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-green-20 px-3 py-1 text-b4 text-green-100">
                        Activo
                      </span>
                    </div>
                    {showAssignedDevices ? (
                      <div className="border-t border-gray-20 pt-4">
                        <h3 className="text-s2 font-semibold text-gray-100">
                          Dispositivos Asignados
                        </h3>
                        <dl className="mt-4 space-y-2 text-b3 text-gray-100">
                          <div className="flex gap-1">
                            <dt className="text-gray-90 font-semibold">
                              TELEFONO:
                            </dt>
                            <dd>{organizationChartEmptyValue}</dd>
                          </div>
                          <div className="flex gap-1">
                            <dt className="text-gray-90 font-semibold">
                              COMPUTADORA:
                            </dt>
                            <dd>{organizationChartEmptyValue}</dd>
                          </div>
                        </dl>
                      </div>
                    ) : null}
                  </div>
                }
              />
            </ButtonsNavigation>
          ) : (
            <div className="space-y-4">
              <div className="mb-6 mt-3 w-[157px] rounded-[8px] bg-green-80 px-[8px] py-[6px] text-b4 text-white">
                Información Laboral
              </div>

              <dl className="space-y-2 text-b3 text-gray-100">
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">EMPRESA:</dt>
                  <dd>
                    {detailDepartment?.enterprice_name ||
                      organizationChartEmptyValue}
                  </dd>
                </div>
                {showEmployeeNumber ? (
                  <div className="flex gap-1">
                    <dt className="text-gray-90 font-semibold">NO. EMPLEADO:</dt>
                    <dd>
                      {detailDisplay?.employeeNumber ||
                        organizationChartEmptyValue}
                    </dd>
                  </div>
                ) : null}
                <div className="my-6 flex gap-1">
                  <dt className="text-gray-90 font-semibold">RESPONSABLE:</dt>
                  <dd>
                    {detailEmployee.manager_id || organizationChartEmptyValue}
                  </dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">AREA:</dt>
                  <dd>{detailDepartment?.name || organizationChartEmptyValue}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">
                    POSICION DE TRABAJO:
                  </dt>
                  <dd>{detailDisplay?.position || organizationChartEmptyValue}</dd>
                </div>
                <div className="mt-6 flex gap-1">
                  <dt className="text-gray-90 font-semibold">TELEFONO:</dt>
                  <dd>{detailDisplay?.phone || organizationChartEmptyValue}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">CORREO:</dt>
                  <dd>{detailDisplay?.email || organizationChartEmptyValue}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default OrganizationChartEmployeeDetailsPanel;
