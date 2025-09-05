export interface PermissionRedirectProps {
  /**
   * Ordered list of absolute routes to evaluate.
   */
  routes: string[];
  /**
   * Path to navigate when user lacks permissions.
   * @default '/main-page'
   */
  homePath?: string;
  /**
   * Optional custom permission checker.
   * Primarily for testing and docs.
   */
  permissionChecker?: (path: string) => boolean;
  /**
   * Optional custom router implementation.
   * Primarily for testing and docs.
   */
  router?: {
    replace: (path: string) => void;
    push: (path: string) => void;
  };
}
