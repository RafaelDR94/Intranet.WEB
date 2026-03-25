'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTransportStore } from '@/app/stores/useTransportStore/useTransportStore';

import type {
  VehicleRegistryRow,
} from '../types';

import type { TransportAssignament } from '@/app/mappings/transport/transport.types';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { shallow } from 'zustand/shallow';
import { sortByDepartureDesc, toVehicleRegistryRow } from '../utilities/vehicleRegistryRows';

const useVehicleRegistryList = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const router = useRouter();
  const [openDetailsPanel, setOpenDetailsPanel] = useState<boolean>(false);
  const { assignments, fetchAssignments, successGetAssignments, loadingAssignments, setCurrentAssignment, resetCurrentAssignment, reset, error, resetFlags } =
    useTransportStore((state) => ({
      assignments: state.assignments,
      fetchAssignments: state.fetchAssignments,
      loadingAssignments: state.loadingAssignments,
      successGetAssignments: state.successGetAssignments,
      setCurrentAssignment: state.setCurrentAssignment,
      resetCurrentAssignment: state.resetCurrentAssignment,
      reset: state.reset,
      error: state.error,
      resetFlags: state.resetFlags
    }), shallow);

  useEffect(() => {

    void fetchAssignments(true);
  }, [fetchAssignments]);

  const rows = useMemo<VehicleRegistryRow[]>(() => {
    return assignments.map(toVehicleRegistryRow);
  }, [assignments]);

  const { inTransitRows, otherRows } = useMemo(() => {
    const inTransit: VehicleRegistryRow[] = [];
    const others: VehicleRegistryRow[] = [];

    rows.forEach((row) => {
      if (row.statusVariant === 'inTransit') {
        inTransit.push(row);
      } else {
        others.push(row);
      }
    });

    inTransit.sort(sortByDepartureDesc);
    others.sort(sortByDepartureDesc);

    return {
      inTransitRows: inTransit,
      otherRows: others,
    };
  }, [rows]);

  const handleRefresh = useCallback(() => {
    reset();
    void fetchAssignments(true);
  }, [fetchAssignments]);

  const handleCreate = useCallback(() => {
    router.push('/main-page/generalservices/vehicleregist/vehicleregistry');
  }, [router]);

  const handleArrive = useCallback((assignment: TransportAssignament) => {
    resetCurrentAssignment();
    setCurrentAssignment(assignment);
    router.push('/main-page/generalservices/vehicleregist/vehicleregistry?id='+assignment.vehicleassignments_id);
  }, [router]);

  const handleOpenDetails = useCallback((assignment: TransportAssignament) => {
    setCurrentAssignment(assignment);
    setOpenDetailsPanel(true);
  }, [setCurrentAssignment, setOpenDetailsPanel]);


  const handleCloseDetails = useCallback(() => {
    resetCurrentAssignment();
    setOpenDetailsPanel(false);
  }, [setOpenDetailsPanel]);

  useEffect(() => {
    if (loadingAssignments) {
      usePrincipalLoading.showSpinner({ message: "Cargando registros..." })
      return;
    }
    if (successGetAssignments) {
      resetFlags();
    }
    if (error) {
      usePrincipalAlert.showAlert({
        type: "error",
        title: "Error al obtener listas",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      resetFlags();
    }
    console.log("Escondiendo spiner desde useVehicleRegistryList");
    usePrincipalLoading.hideSpinner();
  }, [loadingAssignments, error, usePrincipalLoading, usePrincipalAlert, resetFlags, successGetAssignments])


  const searchableKeys = useMemo(
    () =>
      [
        'departureDate',
        'arrivalDate',
        'vehicle',
        'plates',
        'driver',
        'status',
        'destination',
      ] as (keyof VehicleRegistryRow)[],
    []
  );

  return {
    inTransitRows,
    otherRows,
    loading: loadingAssignments,
    handleRefresh,
    handleCreate,
    handleArrive,
    searchableKeys,
    handleOpenDetails,
    handleCloseDetails,
    openDetailsPanel
  };
};

export default useVehicleRegistryList;
