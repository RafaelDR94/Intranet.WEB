import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SAPKeyPage from "./page";

const useSAPKeyPage = vi.hoisted(() => vi.fn());
const SAPTable = vi.hoisted(() => vi.fn(() => <div>SAPTable</div>));
const SAPForm = vi.hoisted(() => vi.fn(() => <div>SAPForm</div>));

const buildHookState = () => ({
  sapKeys: [{ id: "sap-1" }],
  selectedSAPKey: null,
  isCreateView: false,
  isEditView: false,
  isListView: true,
  loadingFormInfo: false,
  submitting: false,
  handleRefresh: vi.fn(),
  handleOpenCreate: vi.fn(),
  handleOpenEdit: vi.fn(),
  handleBackToList: vi.fn(),
  handleDeleteSAPKey: vi.fn(),
  handleSubmit: vi.fn(),
});

vi.mock("./hooks/useSAPKeyPage", () => ({
  default: useSAPKeyPage,
}));

vi.mock("./components/SAPTable/SAPTable", () => ({
  default: SAPTable,
}));

vi.mock("./components/SAPForm/SAPForm", () => ({
  default: SAPForm,
}));

describe("SAPKeyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSAPKeyPage.mockReturnValue(buildHookState());
  });

  it("renders SAPTable in list view", () => {
    render(<SAPKeyPage />);

    expect(screen.getByText("SAPTable")).toBeInTheDocument();
    expect(SAPTable).toHaveBeenCalledWith(
      expect.objectContaining({
        sapKeys: [{ id: "sap-1" }],
      }),
      undefined,
    );
  });

  it("renders SAPForm in create view", () => {
    useSAPKeyPage.mockReturnValue({
      ...buildHookState(),
      selectedSAPKey: null,
      isCreateView: true,
      isEditView: false,
      isListView: false,
    });

    render(<SAPKeyPage />);

    expect(screen.getByText("SAPForm")).toBeInTheDocument();
    expect(SAPForm).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "create",
        sapKey: null,
      }),
      undefined,
    );
  });

  it("renders SAPForm in edit view", () => {
    useSAPKeyPage.mockReturnValue({
      ...buildHookState(),
      selectedSAPKey: { id: "sap-2" },
      isCreateView: false,
      isEditView: true,
      isListView: false,
    });

    render(<SAPKeyPage />);

    expect(SAPForm).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "edit",
        sapKey: { id: "sap-2" },
      }),
      undefined,
    );
  });
});
