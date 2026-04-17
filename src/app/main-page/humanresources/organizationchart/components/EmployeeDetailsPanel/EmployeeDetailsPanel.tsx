"use client";

import React from "react";

import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

type EmployeeDetailsExtras = {
  employee?: string;
  name?: string;
  second_name?: string;
  father_lastname?: string;
  employee_email?: string;
  employee_phone?: string;
  workposition_name?: string;
  age?: string | number;
  birth_date?: string;
  birthdate?: string;
  date_of_birth?: string;
  marital_status?: string;
  civil_status?: string;
  address?: string;
  emergency_phone?: string;
  emergency_number?: string;
};

type EmployeeDetailsPanelProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeType | null;
  canSeeInformation: boolean;
};

const emptyValue = "N/D";

const getEmployeeDisplay = (
  employee: EmployeeType & Partial<EmployeeDetailsExtras>,
) => {
  const fullNameFromParts = [
    employee.firstname,
    employee.secondname,
    employee.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const fullNameFromAltParts = [
    employee.name,
    employee.second_name,
    employee.father_lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    fullname:
      employee.fullname?.trim() ||
      fullNameFromParts ||
      fullNameFromAltParts ||
      "Sin nombre",
    position:
      employee.workposition?.name || employee.workposition_name || emptyValue,
    phone: employee.phone_number || employee.employee_phone || emptyValue,
    email: employee.email || employee.employee_email || emptyValue,
    employeeNumber: employee.employee_number || employee.employee || emptyValue,
  };
};

const EmployeeDetailsPanel = ({
  open,
  onClose,
  employee,
  canSeeInformation,
}: EmployeeDetailsPanelProps) => {
  const { currentPagePermissions } = useAuth();
  const showEmployeeNumber = Boolean(currentPagePermissions?.showEmployeeNumber);
  const showAssignedDevices = Boolean(currentPagePermissions?.showAssignedDevices)
  const detailEmployee = employee as (EmployeeType & EmployeeDetailsExtras) | null;
  const detailDepartment = detailEmployee?.department;
  const detailDisplay = detailEmployee
    ? getEmployeeDisplay(detailEmployee)
    : null;

  return (
    <DetailsPanelLayout open={open} onClose={onClose} divider={false}>
      {!detailEmployee ? (
        <div className="text-b3 text-gray-100">Selecciona un colaborador.</div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-s1 font-semibold text-green-100">
              {detailDisplay?.fullname}
            </h2>
          </div>

          {canSeeInformation ? (
            <ButtonsNavigation
              ariaLabel="Secciones de informacion"
              buttonSize="small"
              activeVariant="solid"
              inactiveVariant="outline"
            >
              <ButtonsNavigation.Item
                id="laboral"
                label="Informacion Laboral"
                renderContent={
                  <div className="space-y-6">
                    <dl className="text-b3 space-y-2 text-gray-100">
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">EMPRESA:</dt>
                        <dd>{detailDepartment?.enterprice_name || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">
                          NO. EMPLEADO:
                        </dt>
                        <dd>{detailDisplay?.employeeNumber || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1 my-6">
                        <dt className="text-gray-90 font-semibold">
                          RESPONSABLE:
                        </dt>
                        <dd>{detailEmployee.manager_id || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">AREA:</dt>
                        <dd>{detailDepartment?.name || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">
                          POSICION DE TRABAJO:
                        </dt>
                        <dd>{detailDisplay?.position || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1 mt-6">
                        <dt className="text-gray-90 font-semibold">TELEFONO:</dt>
                        <dd>{detailDisplay?.phone || emptyValue}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray-90 font-semibold">CORREO:</dt>
                        <dd>{detailDisplay?.email || emptyValue}</dd>
                      </div>
                    </dl>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-green-20 px-3 py-1 text-b4 text-green-100">
                        Activo
                      </span>
                    </div>
                    {showAssignedDevices && (
                      <div className="border-t border-gray-20 pt-4">
                        <h3 className="text-s2 font-semibold text-gray-100">
                          Dispositivos Asignados
                        </h3>
                        <dl className="mt-4 text-b3 space-y-2 text-gray-100">
                          <div className="flex gap-1">
                            <dt className="text-gray-90 font-semibold">
                              TELEFONO:
                            </dt>
                            <dd>{emptyValue}</dd>
                          </div>
                          <div className="flex gap-1">
                            <dt className="text-gray-90 font-semibold">
                              COMPUTADORA:
                            </dt>
                            <dd>{emptyValue}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                }
              />
              {/* <ButtonsNavigation.Item
                id="personal"
                label="Informacion Personal"
                renderContent={
                  <div className="space-y-5">
                    <div className="h-[132px] w-[94px] overflow-hidden rounded-[8px] bg-gray-20">
                      {detailEmployee.image_url ? (
                        <Image
                          src={detailEmployee.image_url}
                          alt={detailDisplay?.fullname || "Colaborador"}
                          width={94}
                          height={132}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-20 text-b2 font-semibold text-gray-70">
                          {(detailDisplay?.fullname || "N")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <dl className="text-b2 text-gray-90 space-y-4">
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          <dt className="font-semibold text-gray-90">EDAD:</dt>
                          <dd>{resolvedAge} ANOS</dd>
                        </div>
                        <div className="flex gap-1">
                          <dt className="font-semibold text-gray-90">
                            FECHA DE CUMPLEANOS:
                          </dt>
                          <dd>{resolvedBirthDate}</dd>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <dt className="font-semibold text-gray-90">
                          ESTADO CIVIL:
                        </dt>
                        <dd>{resolvedMaritalStatus}</dd>
                      </div>

                      <div className="space-y-1">
                        <div className="flex gap-1">
                          <dt className="font-semibold text-gray-90">
                            DIRECCION:
                          </dt>
                          <dd>{resolvedAddress}</dd>
                        </div>
                        <div className="flex gap-1">
                          <dt className="font-semibold text-gray-90">
                            NUMERO DE EMERGENCIA:
                          </dt>
                          <dd>{resolvedEmergencyNumber}</dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                }
              />
              <ButtonsNavigation.Item
                id="documents"
                label="Documentos"
                renderContent={
                  <div className="space-y-2">
                    {documentsToRender.map((document, index) => {
                      const fileName =
                        document.name ||
                        document.file_name ||
                        document.filename ||
                        `Documento ${index + 1}`;
                      const fileUrl = document.url || document.file_url || "";
                      return (
                        <div
                          key={document.id ?? `${fileName}-${index}`}
                          className="flex items-center justify-between border-b border-blue-20 py-2"
                        >
                          <div className="flex items-center gap-3 text-gray-70">
                            <DocumentIcon className="h-6 w-6 shrink-0" />
                            <span className="text-b2">{fileName}</span>
                          </div>
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-70 transition-colors hover:text-blue-90"
                              aria-label={`Descargar ${fileName}`}
                            >
                              <DownloadIcon className="h-6 w-6" />
                            </a>
                          ) : (
                            <span
                              className="text-blue-70"
                              aria-label={`${fileName} sin enlace de descarga`}
                            >
                              <DownloadIcon className="h-6 w-6 opacity-80" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                }
              /> */}
            </ButtonsNavigation>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-80 text-b4 w-[157px] rounded-[8px] px-[8px] py-[6px] text-white mb-6 mt-3">
                Informacion Laboral
              </div>

              <dl className="text-b3 space-y-2 text-gray-100">
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">EMPRESA:</dt>
                  <dd> {detailDepartment?.enterprice_name || emptyValue}</dd>
                </div>
                {showEmployeeNumber && (
                  <div className="flex gap-1">
                    <dt className="text-gray-90 font-semibold">NO. EMPLEADO:</dt>
                    <dd>{detailDisplay?.employeeNumber || emptyValue}</dd>
                  </div>
                )}
                <div className="flex gap-1 my-6">
                  <dt className="text-gray-90 font-semibold">RESPONSABLE:</dt>
                  <dd>{detailEmployee.manager_id || emptyValue}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">AREA:</dt>
                  <dd>{detailDepartment?.name || emptyValue}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">
                    POSICION DE TRABAJO:
                  </dt>
                  <dd>{detailDisplay?.position || emptyValue}</dd>
                </div>
                <div className="flex gap-1 mt-6">
                  <dt className="text-gray-90 font-semibold">TELEFONO:</dt>
                  <dd>{detailDisplay?.phone || emptyValue}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="text-gray-90 font-semibold">CORREO:</dt>
                  <dd>{detailDisplay?.email || emptyValue}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default EmployeeDetailsPanel;
