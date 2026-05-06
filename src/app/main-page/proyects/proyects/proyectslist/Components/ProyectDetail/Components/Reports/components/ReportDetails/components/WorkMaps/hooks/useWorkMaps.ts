import { useMemo } from "react";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
const useWorkMaps = () => {
    const { currentReport } = useReportsStore();
    const items = useMemo(() => {
        const acts = currentReport?.maps ?? [];
        return acts.map((a, idx) => ({
            title:a?.title ?? `Mapa ${idx + 1}`,
            description: a?.description ?? a?.title ?? '',
            image: a?.urlimage ?? '',
        }));
    }, [currentReport]);
    return {  items };
}
export default useWorkMaps;