import type { Proyect } from '@/app/mappings/proyects/proyects.types'

export type ProyectsState = {
  proyects: Proyect[]
  loading: boolean
  error?: string

  fetchProyects: (force?: boolean) => Promise<void>
  forceFetchProyects: () => Promise<void>
  reset: () => void
}

export type Set = (
  partial:
    | Partial<ProyectsState>
    | ((s: ProyectsState) => Partial<ProyectsState>)
) => void

export type Get = () => ProyectsState