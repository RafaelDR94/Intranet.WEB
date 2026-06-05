import { Employees } from "@/app/configurations/Axios/urls";

export type FetchEmployeesOptions = {
  isActive?: boolean;
};

export const buildEmployeesUrl = (options?: FetchEmployeesOptions) => {
  const params = new URLSearchParams();

  if (options?.isActive !== undefined) {
    params.set("isActive", String(options.isActive));
  }

  const query = params.toString();
  return query ? `${Employees}?${query}` : Employees;
};
