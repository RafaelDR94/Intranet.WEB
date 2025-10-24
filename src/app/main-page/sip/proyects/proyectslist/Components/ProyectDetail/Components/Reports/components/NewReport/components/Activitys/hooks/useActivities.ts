import { useEffect,useRef,useState } from "react";
import useActivitiesStore from "@/app/stores/useActivitiesStore/useActivitiesStore";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import { shallow } from "zustand/shallow";
const useActitivities = ()=>{
  const initialValuesSeted = useRef(false);
  const setActivities = useActivitiesStore((state) => state.setActivities);
  const reset = useActivitiesStore((state) => state.reset);
  const [canStart, setCanStart] = useState(false);
  const { report } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      isReportHydrated: state.isReportHydrated,
    }),
    shallow
  );
  
  useEffect(() => {
    reset();
    setCanStart(true);
  }, [reset])


  useEffect(() => {

    if (canStart && !initialValuesSeted.current) {
      initialValuesSeted.current=true
      const existing = report.activities ?? [];
      setActivities(existing);
    }


  }, [report.activities, setActivities, canStart]);
  return({report,canStart})
}
export default useActitivities;