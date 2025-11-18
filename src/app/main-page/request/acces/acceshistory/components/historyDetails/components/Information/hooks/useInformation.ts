import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useMemo } from "react";
import { shallow } from "zustand/shallow";


const useInformation = () => {

  const { current } = useAccesRequirementStore(
    (s) => ({
      current: s.current,
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
          src: r?.evidence_send_email,
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



  return {
    current,
    cards,
  };
};
export default useInformation;
