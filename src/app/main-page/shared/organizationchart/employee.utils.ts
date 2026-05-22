import type { EmployeeType } from "@/app/mappings/employees/employee.types";

export type OrganizationChartEmployeeExtras = {
  employee?: string;
  name?: string;
  second_name?: string;
  father_lastname?: string;
  mother_lastname?: string;
  employee_email?: string;
  employee_phone?: string;
  workposition_name?: string;
  age?: string | number;
  birth_date?: string;
  birthdate?: string;
  date_of_birth?: string;
  marital_status?: string;
  civil_status?: string;
  address?: string;
  emergency_phone?: string;
  emergency_number?: string;
};

export type OrganizationChartEmployee = EmployeeType &
  Partial<OrganizationChartEmployeeExtras>;

export const organizationChartEmptyValue = "N/D";

const collator = new Intl.Collator("es-MX", {
  sensitivity: "base",
  numeric: true,
});

export const organizationChartNameCollator = collator;

export const formatOrganizationChartEmployeeName = (
  employee: Partial<OrganizationChartEmployeeExtras>,
) => {
  const firstName = employee.name?.trim() ?? "";
  const secondName = employee.second_name?.trim() ?? "";
  const lastName = employee.father_lastname?.trim() ?? "";

  const hasTwoNames = Boolean(firstName && secondName);
  const names = [firstName, secondName].filter(Boolean).join(" ").trim();

  if (names) {
    const surname = lastName
      ? hasTwoNames
        ? `${lastName.charAt(0).toUpperCase()}.`
        : lastName
      : "";
    return `${names}${surname ? ` ${surname}` : ""}`.trim();
  }

  const fallback = employee.employee ?? "";
  const raw = (fallback || (employee as EmployeeType)?.fullname || "").trim();
  if (!raw) return "Sin nombre";

  const tokens = raw.split(/\s+/).filter(Boolean);
  if (tokens.length === 1) return tokens[0];

  const inferredNames = tokens.slice(0, 2).join(" ");
  const inferredLast = tokens[2] ?? tokens[1] ?? "";
  const inferredSurname =
    tokens.length > 2
      ? `${inferredLast.charAt(0).toUpperCase()}.`
      : inferredLast;

  return `${inferredNames}${inferredSurname ? ` ${inferredSurname}` : ""}`.trim();
};

export const getOrganizationChartEmployeeDetails = (
  employee: OrganizationChartEmployee,
) => {
  const fullNameFromParts = [
    employee.firstname,
    employee.secondname,
    employee.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const fullNameFromAltParts = [
    employee.name,
    employee.second_name,
    employee.father_lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    fullname:
      employee.fullname?.trim() ||
      fullNameFromParts ||
      fullNameFromAltParts ||
      "Sin nombre",
    position:
      employee.workposition?.name ||
      employee.workposition_name ||
      organizationChartEmptyValue,
    phone:
      employee.phone_number ||
      employee.employee_phone ||
      organizationChartEmptyValue,
    email:
      employee.email || employee.employee_email || organizationChartEmptyValue,
    employeeNumber:
      employee.employee_number ||
      employee.employee ||
      organizationChartEmptyValue,
  };
};

export const getDepartmentEmployeeDisplay = (
  employee: OrganizationChartEmployee,
) => {
  const details = getOrganizationChartEmployeeDetails(employee);
  return {
    ...details,
    fullname: formatOrganizationChartEmployeeName(employee),
  };
};

export const getDirectoryEmployeeShortName = (employee: EmployeeType) => {
  const first = employee.firstname?.trim() ?? "";
  const last = employee.lastname?.trim() ?? "";
  const firstParts = first.split(" ").filter(Boolean);

  if (firstParts.length >= 2 && last) {
    return `${firstParts.slice(0, 2).join(" ")} ${last[0].toUpperCase()}.`;
  }

  const full = `${first} ${last}`.trim();
  return full || employee.fullname || organizationChartEmptyValue;
};
