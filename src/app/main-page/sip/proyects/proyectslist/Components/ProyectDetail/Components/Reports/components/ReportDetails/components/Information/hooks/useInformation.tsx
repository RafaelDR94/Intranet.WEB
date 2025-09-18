import { useMemo } from "react";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { formatDate } from "@/app/utilities/DatesHelper/Dateshelper";
const useInformation = () => {
    const { currentReport } = useReportsStore();

    const cards = useMemo(() => {
        const r = currentReport;
        if (!r) return [] as { label: string; value?: React.ReactNode }[][];
        const typeName = r?.reportcategories?.typesofreports?.name ?? r?.type ?? '—';
        const categoryName = r?.reportcategories?.name ?? '—';
        const locationName = r?.location?.name ?? '—';

        const newcards = [
            [
                { label: 'Tipo de reporte', value: typeName },
                { label: 'Ticket', value: r?.ticket ?? '—' },
                { label: 'Categoría', value: categoryName },
            ],
            [
                { label: 'Fecha Inicio', value: formatDate(r?.startdate) },
                { label: 'Fecha Final', value: formatDate(r?.enddate) },
            ],
            [
                { label: 'Ubicación', value: locationName },
            ],
            [
                { label: 'Observaciones', value: r?.remarks ?? '—' },
            ],

        ];
        if (r?.model?.diagnostic) newcards.push([
            { label: 'Diagnóstico', value: r?.diagnostic ?? '—' },
        ],);
        if (r?.model?.solution) newcards.push([
            { label: 'Solución', value: r?.solution ?? '—' },
        ],);
        return newcards;

    }, [currentReport]);

    const progressPct: number = (() => {
        const raw = (currentReport as any)?.progress;
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
            const n = Number(raw.replace('%', '').trim());
            return isNaN(n) ? 0 : n;
        }
        return 0;
    })();
    return { cards, progressPct,currentReport };
}
export default useInformation;