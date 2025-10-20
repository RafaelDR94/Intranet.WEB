// src/app/stores/employees/useEmployeesStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { EmployeesState } from "./types";
import { fetchEmployeeById } from "./utilities/fetchEmployeeById";
import { fetchEmployees } from "./utilities/fetchEmployees";

/**
 * Global Zustand store for employee catalog.
 *
 * Mantiene una lista de empleados obtenidos del API y expone utilidades
 * para refetch y limpieza de estado.
 */
export const useEmployeesStore = createWithEqualityFn<EmployeesState>()(
  devtools((set, get) => ({
    /** Lista de empleados mapeados */
    employees: [],
    /** Empleado obtenido puntualmente por id */
    employee: undefined,
    /** Indica peticion en curso (listado) */
    loading: false,
    /** Indica peticion en curso para detalle */
    loadingById: false,
    /** Mensaje de error si la peticion falla */
    error: undefined,

    /**
     * Obtiene empleados del backend.
     * @param force si `true` ignora el cache local
     */
    fetchEmployees: (force = false) => fetchEmployees(set, get, force),
    /**
     * Obtiene un empleado especifico por identificador.
     * @param id identificador del empleado
     * @param force si `true` ignora el cache local del empleado actual
     */
    fetchEmployeeById: (id: string, force = false) =>
      fetchEmployeeById(id, set, get, force),
    /** Forza un refetch sin considerar cache */
    forceFetchEmployees: async () => {
      await fetchEmployees(set, get, true);
    },

    /** Restablece el estado a su valor inicial */
    reset: () =>
      set({
        employees: [],
        employee: undefined,
        loading: false,
        loadingById: false,
        error: undefined,
      }),
  }))
);

