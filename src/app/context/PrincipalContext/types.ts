import { UseThemeReturn } from "./hooks/useTheme/types"
import { ReturnTypeUseAlert } from "./hooks/useAlert/types"
export interface PrincipalContextValue {
  usePrincipalTheme: UseThemeReturn,
  usePrincipalAlert:ReturnTypeUseAlert
}
