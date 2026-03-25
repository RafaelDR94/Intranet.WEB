"use client";

import useVehicleRegistryList from "./hooks/useVehicleRegistryList";
import VehicleRegistryListView from "./VehicleRegistryListView";

const VehicleRegistryList = () => {
  const state = useVehicleRegistryList();
  return <VehicleRegistryListView {...state} />;
};

export default VehicleRegistryList;

