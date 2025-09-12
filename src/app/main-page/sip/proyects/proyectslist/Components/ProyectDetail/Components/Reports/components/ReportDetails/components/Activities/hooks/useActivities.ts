import { useMemo } from "react";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
const useActivities = () => {
    const { currentReport } = useReportsStore();
    const items = useMemo(() => {
        const acts = currentReport?.activities ?? [];
        return acts.map((a, idx) => ({
            title: a?.title ?? `Actividad ${idx + 1}`,
            description: a?.description ?? a?.title ?? '',
            image: a?.urlimage ?? '',
        }));
    }, [currentReport]);
    return {  items };
}
export default useActivities;