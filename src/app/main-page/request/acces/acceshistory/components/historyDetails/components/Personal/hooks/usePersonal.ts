import { useMemo, useCallback } from "react";
import JSZip from "jszip";
import { shallow } from "zustand/shallow";

import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import type { InfoItem } from "@/app/components/InfoCards/types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { ExternalPersonModel } from "@/app/mappings/externalperson/externalperson.types";

export type PersonalListItem =
  | (ExternalPersonModel & { personType: "external" })
  | (EmployeeType & { personType: "internal"; name: string });

const buildExternalCards = (external: ExternalPersonModel): InfoItem[][] => [
  [
    { label: "Nombre", value: external?.name },
    { label: "Apellido Paterno", value: external?.lastname },
    { label: "Apellido Materno", value: external?.motherslastname },
  ],
  [
    { label: "CURP", value: external?.curp },
    { label: "Clave de Elector", value: external?.electorkey },
    { label: "Vigencia de Credencial", value: external?.electorvigence },
  ],
  [{ label: "Número de Seguridad Social", value: external?.nss }],
  [{ label: "Número de Licencia", value: external?.license_number }],
  [{ label: "Vigencia de Licencia", value: external?.vigence }],
  [{ label: "Telefono", value: external?.phone_number }],
  [{ label: "Correo Electrónico", value: external?.email }],
];

const buildInternalCards = (internal: EmployeeType): InfoItem[][] => [
  [
    { label: "Primer Nombre", value: internal?.firstname },
    { label: "Segundo Nombre", value: internal?.secondname },
    { label: "Apellido Paterno", value: internal?.lastname },
  ],
  [
    { label: "Apellido Materno", value: internal?.motherlast_name ?? "—" },
    { label: "Número de Empleado", value: internal?.employee_number },
    { label: "Género", value: internal?.gender },
  ],
  [
    { label: "Correo Electrónico", value: internal?.email },
    { label: "Telefono", value: internal?.phone_number },
    { label: "Extensión", value: internal?.extension },
  ],
  [
    { label: "Departamento", value: internal?.department?.name },
    { label: "Puesto", value: internal?.workposition?.name },
  ],
];

const usePersonal = () => {
  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
    }),
    shallow,
  );

  const externalPersons = current?.externalpersons ?? [];
  const internalPersons = current?.internalpersons ?? [];

  const downloadImagesZip = async (item: ExternalPersonModel) => {
    const zip = new JSZip();

    const files = [
      { url: item.back_ine_url, name: "back_ine.jpg" },
      { url: item.frontal_ine_url, name: "frontal_ine.jpg" },
      { url: item.license_url, name: "license.jpg" },
      { url: item.pictureURL, name: "picture.jpg" },
    ];

    for (const file of files) {
      if (!file.url) continue;

      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = `${item.name}_${item.lastname}_Acceso.zip`;
    a.click();
  };

  const normalizedInternalPersons = useMemo(
    () =>
      internalPersons.map((person) => ({
        ...person,
        name:
          person.fullname ||
          [person.firstname, person.secondname, person.lastname]
            .filter(Boolean)
            .join(" "),
        personType: "internal" as const,
      })),
    [internalPersons],
  );

  const normalizedExternalPersons = useMemo(
    () =>
      externalPersons.map((person) => ({
        ...person,
        personType: "external" as const,
      })),
    [externalPersons],
  );

  const getCardsForPerson = useCallback(
    (person?: PersonalListItem | null) => {
      if (!person) return [];
      return person.personType === "external"
        ? buildExternalCards(person)
        : buildInternalCards(person);
    },
    [],
  );

  return {
    current,
    externalPersons: normalizedExternalPersons,
    internalPersons: normalizedInternalPersons,
    getCardsForPerson,
    downloadImagesZip,
  };
};

export default usePersonal;
