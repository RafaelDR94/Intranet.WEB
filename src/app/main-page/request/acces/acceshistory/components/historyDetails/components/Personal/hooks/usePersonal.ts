import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import JSZip from "jszip";

const usePersonal = () => {
  const { current, setCurrent } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
      setCurrent: s.setCurrent,
    }),
    shallow,
  );

  const externalPersons = current?.externalpersons ?? [];
  const internalPersons = current?.internalpersons ?? [];
  const router = useRouter();

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

  const handleEditInformation = useCallback(() => {
    if (!current?.id) return;
    setCurrent(current);
    router.push(
      `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(current.id)}`,
    );
  }, [current, router, setCurrent]);

  return {
    current,
    externalPersons,
    internalPersons,
    handleEditInformation,
    downloadImagesZip
  };
};

export default usePersonal;
