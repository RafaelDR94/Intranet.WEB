/**
 * Props for the {@link PerDiemBalanceCard} component.
 *
 * @property startDate - Beginning of the per diem period as a formatted string.
 * @property endDate - End of the per diem period.
 * @property requestedAmount - Total amount requested.
 * @property verifiedAmount - Amount already verified.
 * @property enterpriseAmount - Balance in favor of the company.
 * @property employeeAmount - Balance in favor of the employee.
 * @property elapsedDays - Number of days elapsed in the period.
 * @property totalDays - Total number of days in the period.
 * @property percentage - Percentage of verified amount (0-100).
 */
export type PerDiemBalanceCardProps = {
  startDate: string;
  endDate: string;
  requestedAmount: number;
  verifiedAmount: number;
  bodyClassName?: string;
  donutSize?: number;
};