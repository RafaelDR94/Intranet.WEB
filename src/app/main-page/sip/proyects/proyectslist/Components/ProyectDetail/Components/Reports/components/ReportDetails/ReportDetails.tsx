"use client";
import React from "react";

import Activities from "./components/Activities/Activities";
import Devices from "./components/Devices/Devices";
import Information from "./components/Information/Information";
import Refactions from "./components/Refactions/Refactions";
import Signature from "./components/Signatures/Signatures";
import WorkMaps from "./components/WorkMaps/WorkMaps";

import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
const ReportDetails = () => {
  const { currentReport } = useReportsStore();
  return (
    <div className="space-y-4">
      <ButtonsNavigation
        dataTestId="reportdetails-nav"
        ariaLabel="Secciones del reporte"
        buttonSize="small"
        activeVariant="solid"
        inactiveVariant="outline"
      >
        <ButtonsNavigation.Item id="info" label="InformaciÃ³n" renderContent={<Information />} />
        <ButtonsNavigation.Item id="activities" label="Actividades" className="rounded-full" renderContent={<Activities />} />
        {(currentReport && currentReport?.reportDeviceView?.length > 0) && <ButtonsNavigation.Item id="devices" label="Dispositivos" className="rounded-full" renderContent={<Devices />} />}
        {(currentReport && currentReport?.refactions?.length > 0) && <ButtonsNavigation.Item id="refactions" label="Refacciones" className="rounded-full" renderContent={<Refactions />} />}
        {currentReport && currentReport?.maps?.length > 0 && <ButtonsNavigation.Item id="workmaps" label="Mapas de trabajo" className="rounded-full" renderContent={<WorkMaps />} />}
        <ButtonsNavigation.Item id="signature" label="Firma" className="rounded-full" renderContent={<Signature />} />
      </ButtonsNavigation>
    </div>
  );
};

export default ReportDetails;
