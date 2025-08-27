export type PerDiemBalanceCardProps = {
  startDate: string; // "YYYY-MM-DD" o cualquier string ya formateado
  endDate: string;
  requestedAmount: number;
  verifiedAmount: number;
  enterpriseAmount: number;
  employeeAmount: number;
  elapsedDays: number;
  totalDays: number;
  percentage: number; // 0–100
};