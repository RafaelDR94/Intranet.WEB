import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type {
  DocumentTypeSummary,
  ManagementDocument,
} from "@/app/mappings/documents/documents.types";

const fetchMock = vi.fn();
const fetchDocumentsMock = vi.fn();

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

const documents: ManagementDocument[] = [
  {
    document_id: "1",
    name: "Manual de Administración",
    code: "MAN-ADM",
    description: "Manual",
    document_type: documentTypes[0],
    department: {
      department_id: "dept-2",
      name: "Operaciones",
      enterprise_id: "ent-1",
      enterprice_name: "Empresa 1",
    },
    management: true,
    route: "/manual-administracion.pdf",
    extension: "pdf",
  },
  {
    document_id: "2",
    name: "Manual de Administración",
    code: "MAN-ADM-02",
    description: "Manual",
    document_type: documentTypes[0],
    department: {
      department_id: "dept-1",
      name: "Administración",
      enterprise_id: "ent-1",
      enterprice_name: "Empresa 1",
    },
    management: true,
    route: "/manual-administracion-02.pdf",
    extension: "pdf",
  },
  {
    document_id: "3",
    name: "Manual duplicado",
    code: "MAN-ADM-03",
    description: "Manual",
    document_type: documentTypes[0],
    department: {
      department_id: "dept-1",
      name: "Administración",
      enterprise_id: "ent-1",
      enterprice_name: "Empresa 1",
    },
    management: true,
    route: "/manual-administracion-03.pdf",
    extension: "pdf",
  },
];

vi.mock("@/app/stores/useDocumentsStore/useDocumentsStore", () => ({
  useDocumentsStore: (selector: any) =>
    selector({
      documents,
      managementDocuments: documents,
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocuments: fetchDocumentsMock,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}));

import useDocumentRegistry from "./useDocumentRegistry";

describe("useDocumentRegistry hook", () => {
  beforeEach(() => {
    fetchMock.mockClear();
    fetchDocumentsMock.mockClear();
  });

  it("loads document types and exposes only active options", async () => {
    const { result } = renderHook(() => useDocumentRegistry());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchDocumentsMock).toHaveBeenCalled();
    });

    const documentTypeField = result.current.fields.find(
      (field) => field.name === "documentType",
    );

    expect(documentTypeField?.options).toHaveLength(1);
    expect(documentTypeField?.options?.[0]).toEqual({
      label: "MANUAL",
      value: "2dcf1875-35b6-4d9c-b6a2-6df144f1580c",
    });

    const destinationAreaField = result.current.fields.find(
      (field) => field.name === "destinationArea",
    );

    expect(destinationAreaField?.options).toEqual([
      { label: "Administración", value: "dept-1" },
      { label: "Operaciones", value: "dept-2" },
    ]);
  });
});
