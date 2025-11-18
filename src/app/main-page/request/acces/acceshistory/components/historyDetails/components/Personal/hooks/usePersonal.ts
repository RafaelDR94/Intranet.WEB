import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";


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


  return {
    current,
    externalPersons,
    internalPersons,
    downloadImagesZip
  };
};

export default usePersonal;
