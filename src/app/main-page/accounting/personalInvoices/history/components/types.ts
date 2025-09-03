import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";

/** Props for the history side menu component. */
export interface SideMenuProps {
  /** Whether the panel is open. */
  panelOpen: boolean;
  /** Callback to toggle the panel visibility. */
  setPanelOpen: (open: boolean) => void;
  /** Currently selected history row. */
  selected: HistoryRow | null;
}
