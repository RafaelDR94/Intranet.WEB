"use client";

import React from "react";
import OrganizationChartGeneralDirectoryView from "@/app/main-page/shared/organizationchart/components/OrganizationChartGeneralDirectoryView";
import type { OrganizationChartRouteConfig } from "@/app/main-page/shared/organizationchart/types";

const routeConfig: OrganizationChartRouteConfig = {
  basePath: "/main-page/organigrama",
  capabilities: {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
};

const OrganigramaGeneralDirectoryPage = () => {
  return <OrganizationChartGeneralDirectoryView routeConfig={routeConfig} />;
};

export default OrganigramaGeneralDirectoryPage;
