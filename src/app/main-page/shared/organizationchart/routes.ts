type QueryValue = string | number | boolean | null | undefined;

type SearchParamsLike = {
  get: (name: string) => string | null;
};

const trimTrailingSlash = (value: string) =>
  value.endsWith("/") ? value.slice(0, -1) : value;

const appendQuery = (
  path: string,
  query?: Record<string, QueryValue>,
) => {
  if (!query) return path;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const search = params.toString();
  return search ? `${path}?${search}` : path;
};

export const getOrganizationChartDepartmentsPath = (basePath: string) =>
  `${trimTrailingSlash(basePath)}/departments`;

export const getOrganizationChartGeneralDirectoryPath = (basePath: string) =>
  `${trimTrailingSlash(basePath)}/generaldirectory`;

export const buildOrganizationChartDepartmentsPath = (
  basePath: string,
  query?: Record<string, QueryValue>,
) => appendQuery(getOrganizationChartDepartmentsPath(basePath), query);

export const resolveOrganizationChartVisualDepartmentsPath = (
  basePath: string,
  searchParams: SearchParamsLike,
) => {
  const sourceDepartmentId = searchParams.get("sourceDepartmentId");
  if (!sourceDepartmentId) {
    return getOrganizationChartDepartmentsPath(basePath);
  }

  return buildOrganizationChartDepartmentsPath(basePath, {
    view: "detail",
    id: sourceDepartmentId,
    label: searchParams.get("sourceDepartmentLabel") ?? undefined,
    force: true,
  });
};
