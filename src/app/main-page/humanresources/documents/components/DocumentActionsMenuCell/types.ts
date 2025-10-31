import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";

export type DocumentActionsMenuCellProps = {
  row: ManagementDocumentTableRow;
  onView?: (row: ManagementDocumentTableRow) => void;
  onDelete?: (row: ManagementDocumentTableRow) => void;
};
