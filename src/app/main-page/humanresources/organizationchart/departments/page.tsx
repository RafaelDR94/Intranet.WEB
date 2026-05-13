"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CreateEmployee from "@/app/main-page/administration/usersmanagment/createemployee/CreateEmployee";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import OrganizationChartDepartmentsView from "@/app/main-page/shared/organizationchart/components/OrganizationChartDepartmentsView";
import { departmentsStyles } from "@/app/main-page/shared/organizationchart/styles";
import { resolveOrganizationChartVisualDepartmentsPath } from "@/app/main-page/shared/organizationchart/routes";
import type { OrganizationChartRouteConfig } from "@/app/main-page/shared/organizationchart/types";

const DepartmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentPagePermissions } = useAuth();
  const currentView = searchParams.get("view") ?? "list";
  const idEmployee = searchParams.get("idEmployee");

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

  const canRenderCreateView =
    currentView === "create" &&
    ((Boolean(idEmployee) && routeConfig.capabilities.canUpdate) ||
      (!idEmployee && routeConfig.capabilities.canCreate));

  if (canRenderCreateView) {
    return (
      <div className={departmentsStyles.container}>
        <CreateEmployee
          redirectOnSuccess={false}
          onSuccess={() =>
            router.push(
              resolveOrganizationChartVisualDepartmentsPath(
                routeConfig.basePath,
                searchParams,
              ),
            )
          }
        />
      </div>
    );
  }

  return <OrganizationChartDepartmentsView routeConfig={routeConfig} />;
};

export default DepartmentsPage;
