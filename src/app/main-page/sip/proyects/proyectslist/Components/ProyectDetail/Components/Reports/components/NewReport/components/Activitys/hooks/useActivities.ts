import { useEffect, useRef, useState } from "react";
import useActivitiesStore from "@/app/stores/useActivitiesStore/useActivitiesStore";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import { shallow } from "zustand/shallow";

const useActitivities = () => {
  const initialValuesSeted = useRef(false);
  const setActivities = useActivitiesStore((state) => state.setActivities);
  const [canStart, setCanStart] = useState(false);

  const { report, isReportHydrated } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      isReportHydrated: state.isReportHydrated,
    }),
    shallow
  );

  // Habilita el flujo una vez montado.
  useEffect(() => {
    setCanStart(true);
  }, []);

  // Replica las actividades del reporte solo una vez por montaje,
  // esperando a que el reporte esté hidratado (local/online).
  useEffect(() => {
    if (!canStart || initialValuesSeted.current) return;

    const hasFrontId = Boolean(report.front_identifier);
    const hasActivities = Array.isArray(report.activities) && report.activities.length > 0;

    // Evita inicializar mientras el builder aún no ha cargado
    if (!isReportHydrated && !hasFrontId && !hasActivities) return;

    initialValuesSeted.current = true;
    const existing = report.activities ?? [];
    setActivities(existing);
  }, [canStart, report.activities, report.front_identifier, isReportHydrated, setActivities]);

  return { report, canStart };
};

export default useActitivities;
