import { UseThemeReturn } from "./hooks/useTheme/types"
import { ReturnTypeUseAlert } from "./hooks/useAlert/types"
import type { UseLoadingOverlay } from './hooks/useLoadingOverlay/useLoadingOverlay';
export interface PrincipalContextValue {
  usePrincipalTheme: UseThemeReturn,
  usePrincipalAlert:ReturnTypeUseAlert
  usePrincipalLoading: UseLoadingOverlay;
}
