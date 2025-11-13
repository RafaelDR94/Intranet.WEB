import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

const useInformation = () => {
  const router = useRouter();
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

  const handleEditInformation = useCallback(() => {
    if (!current?.id) return;
    router.push(
      `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(current.id)}+&mode=edit`,
    );
  }, [current, router]);

  return {
    current,
    cards,
    handleEditInformation,
  };
};
export default useInformation;
