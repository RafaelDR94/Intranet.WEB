import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { DocumentTypeSummary } from "@/app/mappings/documents/documents.types";

const fetchMock = vi.fn();

const documentTypes: DocumentTypeSummary[] = [
  {
    document_type_id: "1dcf1875-35b6-4d9c-b6a2-6df144f1580c",
    name: "FORMATO",
    description: "FORMATO",
    is_active: false,
  },
  {
    document_type_id: "2dcf1875-35b6-4d9c-b6a2-6df144f1580c",
    name: "MANUAL",
    description: "MANUAL",
    is_active: true,
  },
];

vi.mock("@/app/stores/useDocumentTypesStore/useDocumentTypesStore", () => ({
  useDocumentTypesStore: (selector: any) =>
    selector({
      documentTypes,
      activeDocumentTypes: documentTypes.filter((doc) => doc.is_active),
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocumentTypes: fetchMock,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}));

import useDocumentRegistry from "./useDocumentRegistry";

describe("useDocumentRegistry hook", () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it("loads document types and exposes only active options", async () => {
    const { result } = renderHook(() => useDocumentRegistry());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const documentTypeField = result.current.fields.find(
      (field) => field.name === "documentType",
    );

    expect(documentTypeField?.options).toHaveLength(1);
    expect(documentTypeField?.options?.[0]).toEqual({
      label: "MANUAL",
      value: "2dcf1875-35b6-4d9c-b6a2-6df144f1580c",
    });
  });
});
