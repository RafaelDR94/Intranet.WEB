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
  /** Authorization request modal state. */
  authorizationRequestOpen?: boolean;
  /** Authorization request options. */
  authorizationRequestOptions?: Array<{ label: string; value: string }>;
  /** Selected authorizer id. */
  authorizationRequestSelected?: string;
  /** Validation error for authorization request. */
  authorizationRequestError?: string | null;
  /** Whether the authorization request is being sent. */
  isRequestingAuthorization?: boolean;
  /** Open the authorization request flow. */
  onRequestAuthorization?: (row: PettyCashHistoryRow | null) => void;
  /** Close the authorization request modal. */
  onCancelAuthorizationRequest?: () => void;
  /** Confirm the authorization request. */
  onConfirmAuthorizationRequest?: () => void;
  /** Update selected authorizer. */
  onAuthorizationRequestChange?: (value: string) => void;
}
