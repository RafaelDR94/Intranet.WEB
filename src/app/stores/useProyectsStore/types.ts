import type { Proyect } from '@/app/mappings/proyects/proyects.types'

/**
 * Shape of the projects store state.
 */
export type ProyectsState = {
  /** Lista de proyectos */
  proyects: Proyect[]
  /** Flag de carga */
  loading: boolean
  /** Mensaje de error si ocurre */
  error?: string

  /** Obtiene proyectos */
  fetchProyects: (force?: boolean) => Promise<void>
  /** Refetch forzado */
  forceFetchProyects: () => Promise<void>
  /** Limpia estado */
  reset: () => void
}

export type Set = (
  partial:
    | Partial<ProyectsState>
    | ((s: ProyectsState) => Partial<ProyectsState>)
) => void

export type Get = () => ProyectsState