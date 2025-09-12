
import { containerstyle, label } from "./styles";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";

import React from "react";
const normalize = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
};

const EmployeeName = () => {
  const { currentReport } = useReportsStore();
  const employeeName = normalize(currentReport?.employe?.fullname) ?? "N/A";
  const positionName =
    normalize(currentReport?.workposition?.name) ??
    normalize(currentReport?.employe?.workposition?.name) ??
    "N/A";

  return (
    <div className={containerstyle}>
      <div className={label}>
        Responsable: <span className="underline-offset-2">{employeeName}</span>
      </div>
      <div className={label}>Posicion de trabajo: {positionName}</div>
    </div>
  );
};

export default EmployeeName;
