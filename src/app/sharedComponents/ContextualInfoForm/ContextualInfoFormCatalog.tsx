import React from "react";

import { ContextualInfoForm } from "./ContextualInfoForm";

/**
 * Catalogo manual del formulario contextual compartido.
 */
export function ContextualInfoFormCatalog() {
  return (
    <ContextualInfoForm
      values={{
        company: "DISITREK",
        projectCode: "PY-SEMAR-014",
        debtorCode: "00124",
        clientCode: "00345",
        startDate: "2026-05-10",
        endDate: "2026-05-15",
        assignedPerson: "Angel Vazquez",
      }}
    />
  );
}
