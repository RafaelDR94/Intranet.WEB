import type { ReactNode } from "react";

import type { EmployeeType } from "@/app/mappings/employees/employee.types";

export type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  isMobile: boolean;
};

export type UseShowDetailsResult = {
  employee?: EmployeeType;
  hasEmployee: boolean;
  initials: string;
  primaryNameLine: string;
  secondaryNameLine: string;
  companyName: string;
  position: string;
  employeeNumber: string;
  phoneNumber: string;
  email: string;
  departmentName: string;
  confirmToggleOpen: boolean;
  currentStatus: boolean;
  statusType: "valido" | "prohibido";
  statusText: string;
  actionLabel: string;
  displayName: string;
  userId: string | null;
  openConfirmToggle: () => void;
  closeConfirmToggle: () => void;
  handleConfirmToggle: () => void;
};

export type ShowDetailsViewProps = UseShowDetailsResult & {
  isMobile: boolean;
};
