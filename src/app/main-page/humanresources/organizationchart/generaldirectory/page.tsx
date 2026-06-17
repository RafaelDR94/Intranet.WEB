"use client";

import React, { useMemo } from "react";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import OrganizationChartGeneralDirectoryView from "@/app/main-page/shared/organizationchart/components/OrganizationChartGeneralDirectoryView";
import type { OrganizationChartRouteConfig } from "@/app/main-page/shared/organizationchart/types";

const GeneralDirectoryPage = () => {
  const { currentPagePermissions } = useAuth();

  const routeConfig = useMemo<OrganizationChartRouteConfig>(
    () => ({
      basePath: "/main-page/humanresources/organizationchart",
      capabilities: {
        canCreate: Boolean(currentPagePermissions?.create),
        canUpdate: Boolean(
          currentPagePermissions?.update ?? currentPagePermissions?.canSeeDetails,
        ),
        canDelete: Boolean(currentPagePermissions?.delete),
      },
    }),
    [currentPagePermissions],
  );

  return <OrganizationChartGeneralDirectoryView routeConfig={routeConfig} />;
};

export default GeneralDirectoryPage;
