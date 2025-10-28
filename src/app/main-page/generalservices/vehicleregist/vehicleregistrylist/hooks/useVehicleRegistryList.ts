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

const DATE_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const normalizeStatus = (status: string): string =>
  status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const isInTransitStatus = (status?: string): boolean => {
  if (!status) return false;
  const normalized = normalizeStatus(status);
  return normalized === 'en transito' || normalized === 'in transit';
};

const parseDate = (iso: string | undefined | null): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateLabel = (iso: string | undefined | null): string => {
  const date = parseDate(iso);
  return date ? DATE_FORMATTER.format(date) : '--';
};

const formatTimeLabel = (iso: string | undefined | null): string => {
  const date = parseDate(iso);
  return date ? TIME_FORMATTER.format(date) : '--';
};

const buildVehicleName = (assignment: TransportAssignament): string => {
  const parts = [
    assignment.transport?.brand,
    assignment.transport?.model,
    assignment.transport?.UnitType,
  ];

  return parts.filter((part) => !!part && part.trim().length > 0).join(' ');
};

const toRow = (assignment: TransportAssignament): VehicleRegistryRow => {
  const departureDate = parseDate(assignment.departure_date);
  const rowId =
    assignment.vehicleassignments_id ||
    assignment.transport?.transport_id ||
    `${assignment.employee_id}-${assignment.departure_date || ''}` ||
    `${assignment.employee_id}-${Date.now()}`;

  return {
    id: rowId,
    departureDate: formatDateLabel(assignment.departure_date),
    departureTime: formatTimeLabel(assignment.departure_date),
    arrivalDate: formatDateLabel(assignment.arrival_date),
    arrivalTime: formatTimeLabel(assignment.arrival_date),
    vehicle: buildVehicleName(assignment),
    plates: assignment.transport?.plates ?? '',
    driver: assignment.name ?? '',
    status: assignment.status?.status ?? '',
    destination: assignment.destination ?? '',
    departureSort: departureDate ? departureDate.getTime() : 0,
    statusVariant: isInTransitStatus(assignment.status?.status)
      ? 'inTransit'
      : 'other',
    assignment,
  };
};

const sortByDepartureDesc = (
  a: VehicleRegistryRow,
  b: VehicleRegistryRow
): number => {
  return b.departureSort - a.departureSort;
};

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
    return assignments.map(toRow);
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
    router.push('/main-page/generalservices/vehicleregist/vehicleregistry');
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
