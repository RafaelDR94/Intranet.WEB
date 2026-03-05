"use client"
import React from "react";

import ReportsTable from "./Components/Reports/ReportsTable";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import Administration from "./Components/Administration/Adminstration";
import Catalog from "./Components/Catalog/Catalog";
import { Breadcrumbs } from "@/app/components/Breadcrumbs/Breadcrumbs";

const ProyectDetail = () => {
  const { currentPagePermissions } = useAuth();
  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* Breadcrumbs con contenido controlado por el componente */}
      <Breadcrumbs dataTestId="proyectdetail-breadcrumbs" ariaLabel="Secciones del proyecto">
        {currentPagePermissions?.reports && <Breadcrumbs.Item id="reports" label="Reportes" renderContent={<ReportsTable />} />}
        {currentPagePermissions?.administration && <Breadcrumbs.Item id="administration" label="Administración" renderContent={<Administration />} />}
        {currentPagePermissions?.catalogs && <Breadcrumbs.Item id="catalog" label="Catálogo" renderContent={<Catalog />} />}
      </Breadcrumbs>
    </div>
  );
};

export default ProyectDetail;

