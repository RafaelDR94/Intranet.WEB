"use client"
import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react'
import { shallow } from 'zustand/shallow'

import { PettyCashContextType } from './types'

import { FieldModel } from '@/app/components/DynamicForm/types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useBillingPettyCash } from '@/app/stores/useBillingPettyCash/useBillingPettyCash'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore'
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore'

const initialValue: PettyCashContextType = {
  employees: [],
  proyects: [],
  pettyCashFunds: [],
  pinkFields: [],
  blueFields: [],
  formIdPink: 'petty-cash-voucher-form-create',
  formIdBlue: 'petty-cash-voucher-blue-form-create',
  setFields: () => {},
  updateField: () => {},
  resetFields: () => {},
  user: null,
}

const PettyCashContext = createContext<PettyCashContextType>(initialValue)

export const PettyCashProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert, hideAlert } = usePrincipalAlert

  const formIdPink = 'petty-cash-voucher-form-create'
  const formIdBlue = 'petty-cash-voucher-blue-form-create'

  const { employees, employeesError, fetchEmployees, reset: resetEmployees } = useEmployeesStore(
    (s) => ({ employees: s.employees, employeesError: s.error, fetchEmployees: s.fetchEmployees, reset: s.reset }),
    shallow,
  )

  const { proyects, proyectsError, fetchProyects, reset: resetProyects } = useProyectsStore(
    (s) => ({ proyects: s.proyects, proyectsError: s.error, fetchProyects: s.fetchProyects, reset: s.reset }),
    shallow,
  )

  const { pettyCashFunds, error: pettyError, warning, fetchPettyCashFunds, resetFlags } = useBillingPettyCash(
    (s) => ({
      pettyCashFunds: s.pettyCashFunds,
      error: s.error,
      warning: s.warning,
      fetchPettyCashFunds: s.fetchPettyCashFunds,
      resetFlags: s.resetFlags,
    }),
    shallow,
  )

  const { setFields, updateField, resetFields } = useFormFieldsStore.getState()

  const empty: FieldModel[] = []
  const pinkFields = useFormFieldsStore((s) => s.fieldsByFormId[formIdPink]) ?? empty
  const blueFields = useFormFieldsStore((s) => s.fieldsByFormId[formIdBlue]) ?? empty

  useEffect(() => {
    fetchEmployees()
    fetchProyects()
    fetchPettyCashFunds()
  }, [fetchEmployees, fetchProyects, fetchPettyCashFunds])

  useEffect(() => {
    if (!employeesError) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de empleados',
      description: String(employeesError) || 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => {
        hideAlert()
        fetchEmployees(true)
      },
    })
    resetEmployees()
  }, [employeesError, showAlert, hideAlert, fetchEmployees, resetEmployees])

  useEffect(() => {
    if (!proyectsError) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de proyectos',
      description: String(proyectsError) || 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => {
        hideAlert()
        fetchProyects(true)
      },
    })
    resetProyects()
  }, [proyectsError, showAlert, hideAlert, fetchProyects, resetProyects])

  useEffect(() => {
    if (!pettyError && !warning) return
    showAlert({
      type: pettyError ? 'error' : 'warning',
      variant: 'filled',
      title: pettyError ? 'No se pudieron cargar los fondos de caja chica' : 'Sin fondos disponibles',
      description: String(pettyError || warning) || 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => {
        hideAlert()
        fetchPettyCashFunds(true)
      },
    })
    resetFlags()
  }, [pettyError, warning, showAlert, hideAlert, fetchPettyCashFunds, resetFlags])

  const value = useMemo(
    () => ({
      employees,
      proyects,
      pettyCashFunds,
      pinkFields,
      blueFields,
      formIdPink,
      formIdBlue,
      setFields,
      updateField,
      resetFields,
      user,
    }),
    [
      employees,
      proyects,
      pettyCashFunds,
      pinkFields,
      blueFields,
      formIdPink,
      formIdBlue,
      setFields,
      updateField,
      resetFields,
      user,
    ],
  )

  return <PettyCashContext.Provider value={value}>{children}</PettyCashContext.Provider>
}

export const usePettyCash = () => {
  const context = useContext(PettyCashContext)
  if (!context) {
    throw new Error('usePettyCash debe usarse dentro de un PettyCashProvider')
  }
  return context
}

