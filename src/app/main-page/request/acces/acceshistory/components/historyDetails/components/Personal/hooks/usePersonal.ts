import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";
import { useMemo } from "react";
import JSZip from "jszip";

const usePersonal = () => {
  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
    }),
    shallow,
  );

  const externalPersons = current?.externalpersons ?? [];
  const internalPersons = current?.internalpersons ?? [];

  const downloadImagesZip = async (item: any) => {
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

  const cards = useMemo(() => {
    const external = current?.externalpersons[0];
    const internal = current?.internalpersons[0];

    if (!external) return [] as { label: string; value?: React.ReactNode }[][];

    const newcards = [
      [
        {
          label: 'Nombre',
          value: external?.name 
        },
        {
          label: 'Apellido Paterno',
          value: external?.lastname
        },
        {
          label: 'Apellido Materno',
          value: external?.motherslastname 
        },
      ],
      [
        {
          label: 'CURP',
          value: external?.curp
        },
        {
          label: 'Clave de Elector',
          value: external?.electorkey
        },
        {
          label: 'Vigencia de Credencial',
          value: external?.electorvigence
        },
      ],
      [
        {
          label: 'Número de Seguridad Social',
          value: external?.nss
        },
      ],
      [
        {
          label: 'Número de Licencia',
          value: external?.license_number
        },
      ],
      [
        {
          label: 'Vigencia de Licencia',
          value: external?.vigence
        },
      ],
      [
        {
          label: 'Telefono',
          value: external?.phone_number
        },
      ],
      [
        {
          label: 'Correo Electrónico',
          value: external?.email
        },
      ],
    ];
    return newcards;
  }, [current]);

  return {
    current,
    externalPersons,
    internalPersons,
    cards,
    downloadImagesZip,
  };
};

export default usePersonal;
