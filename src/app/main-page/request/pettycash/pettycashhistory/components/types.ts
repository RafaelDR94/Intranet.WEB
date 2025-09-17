import { PettyCashHistoryDetail, PettyCashHistoryRow } from "../types";

/** Props for the history side menu component. */
export interface SideMenuProps {
  /** Whether the panel is open. */
  panelOpen: boolean;
  /** Callback to toggle the panel visibility. */
  setPanelOpen: (open: boolean) => void;
  /** Currently selected history row. */
  selected: PettyCashHistoryRow | null;
  /** Detailed information fetched by id. */
  detail: PettyCashHistoryDetail | null;
  /** Whether the detail is loading. */
  isDetailLoading: boolean;
}
