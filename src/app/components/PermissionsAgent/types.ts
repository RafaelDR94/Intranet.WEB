/** Props del componente PermissionAgent */
export interface PermissionAgentProps {
  /** Elementos hijos a renderizar cuando hay permisos */
  children: React.ReactNode;
  /** Ruta a redirigir si no hay permisos */
  fallbackPath?: string;
  /** Ruta explícita a validar en lugar de la actual */
  strictPath?: string;
}
