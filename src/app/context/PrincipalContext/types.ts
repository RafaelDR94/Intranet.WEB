import { ReturnTypeUseAlert } from "./hooks/useAlert/types"
import type { UseLoadingOverlay } from './hooks/useLoadingOverlay/useLoadingOverlay';
import { UseShowImage } from "./hooks/useShowImage/useShowImage";
import { UseThemeReturn } from "./hooks/useTheme/types"
export interface PrincipalContextValue {
  usePrincipalTheme: UseThemeReturn,
  usePrincipalAlert: ReturnTypeUseAlert
  usePrincipalLoading: UseLoadingOverlay;
  usePrincipalImage: UseShowImage;
}
