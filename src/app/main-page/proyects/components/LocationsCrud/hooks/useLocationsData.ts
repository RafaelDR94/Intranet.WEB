'use client';

import { useEffect, useMemo } from 'react';

import useQuery from '@/app/hooks/useQuery/useQuery';
import useProyectLocationStore from '@/app/stores/useProyectLocationStore/useProyectLocationStore';
import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import type { CrudRecord, CrudScope } from '../../types';

const locationToCrudRecord = (location: ProyectLocationType): CrudRecord => {
  const projectLabel =
    location.proyect?.[0]?.proyectKey ||
    location.proyect?.[0]?.name ||
    'Sin proyecto';

  return {
    id: String(location.id ?? ''),
    primary: String(location.name ?? ''),
    secondary: projectLabel,
    tertiary: String(location.address ?? ''),
    status: 'Activa',
    description: String(location.address ?? ''),
    mapLink: String(location.linkmaps ?? ''),
    linkmaps: String(location.linkmaps ?? ''),
    projectCode: projectLabel,
  };
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const useLocationsData = (scope: CrudScope) => {
  const { all } = useQuery();
  const projectId = getSingleValue(all.id)?.trim();

  const {
    locations,
    loadingLocations,
    error,
    fetchLocations,
    fetchAllLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    resetFlags,
  } = useProyectLocationStore((state) => ({
    locations: state.locations,
    loadingLocations: state.loadingLocations,
    error: state.error,
    fetchLocations: state.fetchLocations,
    fetchAllLocations: state.fetchAllLocations,
    createLocation: state.createLocation,
    updateLocation: state.updateLocation,
    deleteLocation: state.deleteLocation,
    resetFlags: state.resetFlags,
  }));

  useEffect(() => {
    if (scope === 'project') {
      if (!projectId) return;
      void fetchLocations(projectId, true);
      return;
    }

    void fetchAllLocations(true);
  }, [fetchAllLocations, fetchLocations, projectId, scope]);

  const rows = useMemo(() => locations.map(locationToCrudRecord), [locations]);

  const refreshRows = async () => {
    if (scope === 'project') {
      if (!projectId) return;
      await fetchLocations(projectId, true);
      return;
    }

    await fetchAllLocations(true);
  };

  return {
    rows,
    loading: loadingLocations,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    resetFlags,
    refreshRows,
  };
};
