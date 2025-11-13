import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/router";

const useInformation = () => {
  const router = useRouter();
  const { current, setCurrent } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
      setCurrent: s.setCurrent,
    }),
    shallow,
  );

  const cards = useMemo(() => {
    const r = current;

    if (!r) return [] as { label: string; value?: React.ReactNode }[][];

    const newcards = [
      [
        {
          label: "Evidencia del documento enviado",
          value: "",
          src: r?.dr_responsiblesignature,
        },
      ],
      [
        { label: "Empresa", value: r?.external_enterprise?.name },
        { label: "Responsable del acceso", value: r?.dr_responsiblename },
      ],
      [
        { label: "Fecha Inicio", value: r?.start_date },
        { label: "Fecha Final", value: r?.end_date },
      ],
      [{ label: "Ubicación", value: r?.location?.address }],
      [{ label: "Motivo de visita", value: r?.motive }],
    ];
    return newcards;
  }, [current]);

  const handleEditInformation = useCallback(() => {
    if (!current?.id) return;
    setCurrent(current);
    router.push(
      `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(current.id)}`,
    );
  }, [current, router, setCurrent]);

  return {
    current,
    cards,
    handleEditInformation,
  };
};
export default useInformation;
