import { useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import useQuery from "@/app/hooks/useQuery/useQuery";
import type { CompleteTransport } from "@/app/mappings/transport/transport.types";


const useVehicleForm = () => {
  const { all } = useQuery();
  const enterpriseId = all.enterpriseId;

  const hasInitVehicles = useRef(false);
  const [vehicleSelected, setVehicleSelected] = useState("");
  const [openVehicleForm, setOpenVehicleForm] = useState(false);

  const { vehicles, addVehicle, removeVehicle } = useAccessRequestStore(
    (s) => ({
      vehicles: s.vehicles,
      addVehicle: s.addVehicle,
      removeVehicle: s.removeVehicle,
    }),
    shallow
  );

  const { transports, fetchTransportsByEnterprise } = useTransportStore(
    (s) => ({
      transports: s.transports,
      fetchTransportsByEnterprise: s.fetchTransportsByEnterprise,
    }),
    shallow
  );

  useEffect(() => {
    if (!hasInitVehicles.current && enterpriseId) {
      hasInitVehicles.current = true;
      void fetchTransportsByEnterprise(String(enterpriseId), true);
    }
  }, [enterpriseId, fetchTransportsByEnterprise]);

  const handleSelectVehicle = (selected: string) => {
    setVehicleSelected(selected);
  };

  const handleConfirmVehicle = () => {
    const selectedVehicle = transports.find(
      (vehicle) => vehicleSelected === String(vehicle.transport_id)
    );
    if (selectedVehicle) addVehicle(selectedVehicle as CompleteTransport);
    setVehicleSelected("");
  };

  const handleAddVehicle = () => {
    setOpenVehicleForm(true);
  };

  const handleCancel = () => {
    setOpenVehicleForm(false);
  };

  const handleDelete = (vehicle: CompleteTransport) => {
    removeVehicle(vehicle.transport_id);
  };



  useEffect(() => {
    if (vehicles.length > 0) {
      setOpenVehicleForm(false);
    }
  }, [vehicles]);

  const filteredSystemExternalTransport = useMemo(() => {
    const selectedIds = new Set(vehicles.map(p => String(p.transport_id)));
    return transports.filter(p => !selectedIds.has(String(p.transport_id)));
  }, [transports, vehicles]);

  return {
    systemVehicles: filteredSystemExternalTransport.map(t => ({ label: t.brand + " " + t.model + " " + t.year, value: t.transport_id })),
    vehicles,
    vehicleSelected,
    handleSelectVehicle,
    handleConfirmVehicle,
    handleAddVehicle,
    handleCancel,
    handleDelete,
    openVehicleForm,
  };
};

export default useVehicleForm;
