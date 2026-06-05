import { render } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SAPTable from "./SAPTable";

const DataTable = vi.hoisted(() => vi.fn(() => <div>DataTable</div>));
const useIsMobile = vi.hoisted(() => vi.fn(() => false));

vi.mock("@/app/components/DataTable/DataTable", () => ({
  DataTable,
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile,
  }),
);

vi.mock("@/assets/icons/acciones/trash.svg", () => ({ default: "trash.svg" }));
vi.mock("@/assets/icons/Editor/edit-pencil.svg", () => ({
  default: "edit-pencil.svg",
}));
vi.mock("@/assets/icons/navegacion/more-horiz.svg", () => ({
  default: "more-horiz.svg",
}));

describe("SAPTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("configures DataTable with the expected columns and search keys", () => {
    render(
      <SAPTable
        sapKeys={[
          {
            id: "sap-1",
            satKey: "86121700",
            descriptionSatKey: "Servicios",
            internalKey: "G001",
            descriptionInternalKey: "Gasto operativo",
            gtsType: "A",
            iva: 0.16,
            isActive: true,
          },
        ]}
        onCreate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    const dataTableMock = DataTable as unknown as {
      mock: { calls: Array<[any]> };
    };
    const props = dataTableMock.mock.calls[0]?.[0];

    expect(props).toBeDefined();

    if (!props) {
      throw new Error("DataTable did not receive props");
    }

    const labels = props.tables[0].columns.map((column: any) => column.label);

    expect(labels).toEqual([
      "TIPO DE GASTO",
      "DENOMINACION DE GASTO",
      "GRUPO IVA",
      "CLAVE SAT",
      "DESCRIPCION",
      "TIPO",
      "",
    ]);
    expect(labels).not.toContain("CUENTA DE MAYOR");
    expect(props.searchableKeys).toEqual([
      "internalKey",
      "descriptionInternalKey",
      "ivaLabel",
      "satKey",
      "descriptionSatKey",
      "gtsTypeLabel",
    ]);
    expect(props.tables[0].data[0]).toEqual(
      expect.objectContaining({
        ivaLabel: "IVA ACREDITABLE 16 % - 0.16",
        gtsTypeLabel: "Administrativo",
      }),
    );
  });
});
