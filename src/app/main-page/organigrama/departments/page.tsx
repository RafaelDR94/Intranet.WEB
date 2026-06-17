"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import OrganizationChartDepartmentsView from "@/app/main-page/shared/organizationchart/components/OrganizationChartDepartmentsView";
import { resolveOrganizationChartVisualDepartmentsPath } from "@/app/main-page/shared/organizationchart/routes";
import type { OrganizationChartRouteConfig } from "@/app/main-page/shared/organizationchart/types";

const routeConfig: OrganizationChartRouteConfig = {
  basePath: "/main-page/organigrama",
  capabilities: {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
};

const OrganigramaDepartmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");

  useEffect(() => {
    if (currentView !== "create") return;
    router.replace(
      resolveOrganizationChartVisualDepartmentsPath(
        routeConfig.basePath,
        searchParams,
      ),
    );
  }, [currentView, router, searchParams]);

  return <OrganizationChartDepartmentsView routeConfig={routeConfig} />;
};

export default OrganigramaDepartmentsPage;
