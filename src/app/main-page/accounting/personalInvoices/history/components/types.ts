import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
export interface SideMenuProps {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  selected: HistoryRow | null;
}
