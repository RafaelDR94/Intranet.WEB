'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { AccessRequestStoreState, } from './types'
import type { CompleteTransport } from '@/app/mappings/transport/transport.types'

/**
 * Store para manejar las listas de un Access Request (vehicles, internal/external persons, tools).
 */
export const useAccessRequestStore = createWithEqualityFn<AccessRequestStoreState>()(
  devtools((set, get) => ({
    vehicles: [],
    internalpersons: [],
    externalpersons: [],
    tools: [],

    setVehicles: (vehicles: CompleteTransport[]) => set({ vehicles }),
    setInternalPersons: (persons) => set({ internalpersons: persons }),
    setExternalPersons: (persons) => set({ externalpersons: persons }),
    setTools: (tools) => set({ tools }),

    addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
    updateVehicle: (transport_id, data) => set((state) => ({
      vehicles: state.vehicles.map(v => v.transport_id === transport_id ? { ...v, ...data } : v)
    })),
    removeVehicle: (transport_id) => set((state) => ({
      vehicles: state.vehicles.filter(v => v.transport_id !== transport_id)
    })),

    addInternalPerson: (person) => set((state) => ({ internalpersons: [...state.internalpersons, person] })),
    updateInternalPerson: (id, data) => set((state) => ({
      internalpersons: state.internalpersons.map(p => p.id === id ? { ...p, ...data } : p)
    })),
    removeInternalPerson: (id) => set((state) => ({
      internalpersons: state.internalpersons.filter(p => p.id !== id)
    })),

    addExternalPerson: (person) => set((state) => ({ externalpersons: [...state.externalpersons, person] })),
    updateExternalPerson: (id, data) => set((state) => ({
      externalpersons: state.externalpersons.map(e => e.id === id ? { ...e, ...data } : e)
    })),
    removeExternalPerson: (id) => set((state) => ({
      externalpersons: state.externalpersons.filter(e => e.id !== id)
    })),

    addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
    updateTool: (index, data) => set((state) => ({
      tools: state.tools.map((t, i) => i === index ? { ...t, ...data } : t)
    })),
    removeTool: (index) => set((state) => ({
      tools: state.tools.filter((_, i) => i !== index)
    })),

    resetVehicles: () => set({ vehicles: [] }),
    resetInternalPersons: () => set({ internalpersons: [] }),
    resetExternalPersons: () => set({ externalpersons: [] }),
    resetTools: () => set({ tools: [] }),

    reset: () => set({ vehicles: [], internalpersons: [], externalpersons: [], tools: [] }),

    getVehicleIds: () => get().vehicles.map(v => v.transport_id),
    getInternalPersonIds: () => get().internalpersons.map(p => p.id),
    getExternalPersonIds: () => get().externalpersons.map(e => e.id),
    getToolsAsString: () => JSON.stringify(get().tools)
  }))
)

export default useAccessRequestStore
