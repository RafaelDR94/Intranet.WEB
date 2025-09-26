"use client";
import React from "react";

import ReportsTable from "./Components/Reports/ReportsTable";

// import Administration from "./Components/Administration/Adminstration";
// import Catalog from "./Components/Catalog/Catalog";
import { Breadcrumbs } from "@/app/components/Breadcrumbs/Breadcrumbs";

const ProyectDetail = () => {
  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* Breadcrumbs con contenido controlado por el componente */}
      <Breadcrumbs dataTestId="proyectdetail-breadcrumbs" ariaLabel="Secciones del proyecto">
        <Breadcrumbs.Item id="reports" label="Reportes" renderContent={<ReportsTable />}/>
{/* 
        <Breadcrumbs.Item id="administration" label="Administración" renderContent={<Administration />} />

        <Breadcrumbs.Item id="catalog" label="Catálogo" renderContent={<Catalog />} /> */}

      </Breadcrumbs>
    </div>
  );
};

export default ProyectDetail;

