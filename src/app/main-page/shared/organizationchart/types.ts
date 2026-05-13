export type OrganizationChartCapabilities = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type OrganizationChartRouteConfig = {
  basePath: string;
  capabilities: OrganizationChartCapabilities;
};
