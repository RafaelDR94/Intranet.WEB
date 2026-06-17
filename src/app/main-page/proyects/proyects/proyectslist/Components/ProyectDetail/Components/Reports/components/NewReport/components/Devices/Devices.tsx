"use client"
'use client';


import React from 'react';
import DevicesList from './Components/DevicesList/DevicesList';
import ReportDevicesCrudForm from './Components/ReportDevicesCrudForm/ReportDevicesCrudForm';
import useDevices from './hooks/useDevices';



const Devices: React.FC = () => {

  const { selectedRowId,
    handleCreate,
    handleEdit,
    handleCloseForm } = useDevices();

  return (
    <section className="flex flex-col gap-6">

      {!selectedRowId && <DevicesList
        selectedRowId={selectedRowId}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />}
      {selectedRowId && <ReportDevicesCrudForm
        selectedRowId={selectedRowId}
        onClose={handleCloseForm}
        onSaved={handleCloseForm}
      />}
    </section>
  );
};

export default Devices;
