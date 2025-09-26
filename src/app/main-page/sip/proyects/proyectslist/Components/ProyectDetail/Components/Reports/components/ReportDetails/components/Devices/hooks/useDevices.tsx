
import { useMemo } from 'react';

import type { Row } from '../types';

import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';
import {useReportsStore} from '@/app/stores/useReportsStore/useReportsStore';
const useDevices = () => {
    const { currentReport } = useReportsStore();
  const { currentProyect } = useProyectsStore();
  const rows: Row[] = useMemo(() => {
    // Intenta obtener desde currentProyect si existiera un campo devices; fallback a currentReport
    const projectDevices: any[] = (currentProyect as any)?.devices ?? [];
    if (Array.isArray(projectDevices) && projectDevices.length > 0) {
      return projectDevices.map((d: any, i: number) => ({
        id: String(i + 1),
        index: i + 1,
        device:
          d?.fullInformation || [d?.brand, d?.model, d?.serialnumber].filter(Boolean).join(' ') || '—',
      }));
    }
    const reportDevices = currentReport?.reportDeviceView ?? [];
    return reportDevices.map((rd, i) => ({
      id: String(i + 1),
      index: i + 1,
      device:
        rd?.device_external_view?.fullInformation ||
        [rd?.device_external_view?.brand, rd?.device_external_view?.model, rd?.device_external_view?.serialnumber]
          .filter(Boolean)
          .join(' ') || '—',
    }));
  }, [currentProyect, currentReport]);
  return {rows};
};

export default useDevices;
