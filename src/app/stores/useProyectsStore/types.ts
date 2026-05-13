import type {
  LinkProyectLocationsPayload,
  Proyect,
  ProyectPost,
  ProyectPut,
} from '@/app/mappings/proyects/proyects.types'

/**
 * Shape of the projects store state.
 */
export type ProyectsState = {
  /** Lista de proyectos */
  proyects: Proyect[]
  /** Proyecto seleccionado actualmente */
  currentProyect: Proyect | null

  /** Flags de proceso */
  loading: boolean
  creating: boolean
  updating: boolean
  linkingLocations: boolean
  removing: boolean

  /** Flags de éxito */
  successGet: boolean
  successPost: boolean
  successPut: boolean
  successLinkLocations: boolean
  successDelete: boolean

  /** Mensaje de error si ocurre */
  error?: string

  /** Obtiene proyectos */
  fetchProyects: (force?: boolean, idEmployee?: string) => Promise<void>
  /** Obtiene un proyecto por id */
  fetchProyectById: (id: string) => Promise<Proyect | null>
  /** Refetch forzado */
  forceFetchProyects: () => Promise<void>

  /** Crea un proyecto */
  createProyect: (payload: ProyectPost) => Promise<Proyect | null>
  /** Actualiza un proyecto */
  updateProyect: (payload: ProyectPut) => Promise<Proyect | null>
  /** Vincula ubicaciones existentes a un proyecto */
  linkLocationsToProyect: (payload: LinkProyectLocationsPayload) => Promise<boolean>
  /** Elimina un proyecto */
  deleteProyect: (id: string) => Promise<boolean>

  /** Asigna el proyecto actual */
  setCurrentProyect: (p: Proyect | null) => void
  /** Limpia el proyecto actual */
  clearCurrentProyect: () => void

  /** Limpia estado */
  reset: () => void
  /** Limpia solo flags */
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<ProyectsState>
    | ((s: ProyectsState) => Partial<ProyectsState>)
) => void

export type Get = () => ProyectsState
