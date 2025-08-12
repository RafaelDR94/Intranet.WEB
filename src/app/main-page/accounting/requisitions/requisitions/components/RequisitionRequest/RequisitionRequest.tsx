// src/app/main-page/accounting/requisitions/requisitions/components/RequisitionRequest/RequisitionRequest.tsx
'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import { FieldModel } from '@/app/components/DynamicForm/types'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore'

// 👇 stores directos (nuevo patrón)
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'

import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { Proyect } from '@/app/mappings/proyects/proyects.types'
import type { RequitionPost } from '@/app/mappings/requisitions/requisitions.types'

const RequisitionsRequest = () => {
  const formId = 'requisitions-request'
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert
  const submitRef = useRef<() => void | Promise<void>>(null)
  const [formReady, setFormReady] = useState(false)

  // --- Form fields (store multi-instancia)
  const fields = useFormFieldsStore(s => s.fieldsByFormId[formId] ?? [])
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState()

  // --- Employees (store directo + prefetch)
  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    s => ({
      employees: s.employees,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow // ← si tu store NO usa createWithEqualityFn, elimina este segundo argumento
  )
  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  // --- Proyects (store directo + prefetch)
  const { proyects, proyectsError, fetchProyects } = useProyectsStore(
    s => ({
      proyects: s.proyects,
      proyectsError: s.error,
      fetchProyects: s.fetchProyects,
    }),
    shallow
  )
  useEffect(() => { fetchProyects() }, [fetchProyects])

  // --- Requisitions (store directo)
  const {
    createRequisition,
    resetFlags,
    creating,
    successPost,
    error,
  } = useRequisitionsStore(s => ({
    createRequisition: s.createRequisition,
    resetFlags: s.resetFlags,
    creating: s.creating,
    successPost: s.successPost,
    error: s.error,
  })/* , shallow */) // ← usa shallow aquí solo si el store se creó con createWithEqualityFn

  // Error contextual como en el hook antiguo
  const requisitionError = useMemo(
    () => (!creating && !successPost ? error : undefined),
    [creating, successPost, error]
  )

  // Monta y limpia initialFields
  useEffect(() => {
    const initialFields: FieldModel[] = [
      {
        type: 'select',
        name: 'employees',
        label: 'Nombre del Deudor',
        placeholder: 'Seleccione el Deudor',
        value: '',
        className: 'max-w-[400px]',
        validations: [{ type: 'required' }],
        showIf: (_v, all) => {
          const f = all.find(x => x.name === 'employees')
          return Array.isArray(f?.options) && f.options.length > 0
        },
      },
      {
        type: 'select',
        name: 'project',
        label: 'Seleccionar Proyecto',
        placeholder: 'Proyecto',
        value: '',
        className: 'max-w-[400px]',
        validations: [{ type: 'required' }],
        showIf: (_v, all) => {
          const f = all.find(x => x.name === 'project')
          return Array.isArray(f?.options) && f.options.length > 0
        },
      },
      {
        type: 'input',
        name: 'expenseType',
        label: 'Código de Requisición',
        placeholder: 'Escribe el Código de Requisición',
        value: '',
        className: 'max-w-[400px]',
        validations: [{ type: 'required' }],
      },
    ]
    setFields(formId, initialFields)
    return () => {
      resetFields(formId)
      resetFlags()
    }
  }, [formId, setFields, resetFields, resetFlags])

  // Popular opciones: empleados
  useEffect(() => {
    if (employees?.length) {
      updateField(formId, 'employees', {
        options: employees.map((e: EmployeeType) => ({ label: e.fullname, value: e.employee_id })),
      })
    }
  }, [employees, formId, updateField])

  // Popular opciones: proyectos
  useEffect(() => {
    if (proyects?.length) {
      updateField(formId, 'project', {
        options: proyects.map((p: Proyect) => ({ label: p.proyectKey, value: p.id })),
      })
    }
  }, [proyects, formId, updateField])

  // Loading de catálogos
  const loadingFormInfo = useMemo(() => {
    const emp = fields.find(f => f.name === 'employees')
    const prj = fields.find(f => f.name === 'project')
    const employeesReady = Array.isArray(emp?.options) && (emp?.options?.length ?? 0) > 0
    const projectsReady = Array.isArray(prj?.options) && (prj?.options?.length ?? 0) > 0
    return !(employeesReady && projectsReady)
  }, [fields])

  // Errores catálogos
  useEffect(() => {
    if (!employeesError) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de empleados',
      description: String(employeesError) ?? 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => { hideAlert(); fetchEmployees() },
    })
  }, [employeesError, fetchEmployees, hideAlert, showAlert])

  useEffect(() => {
    if (!proyectsError) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de proyectos',
      description: String(proyectsError) ?? 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => { hideAlert(); fetchProyects() },
    })
  }, [proyectsError, fetchProyects, hideAlert, showAlert])

  // Spinner + alert creación
  useEffect(() => {
    if (creating) {
      showSpinner({ message: 'Espera un momento, tu información se está guardando' })
      return
    }
    hideSpinner()

    if (successPost) {
      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Requisición creada',
        description: 'Se registró la requisición.',
        showPrimaryButton: true,
        primaryLabel: 'Cerrar',
        onPrimaryClick: () => { hideAlert(); resetFlags() },
      })
    }

    if (requisitionError) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo crear la requisición',
        description: String(requisitionError) ?? 'Ocurrió un error. Intenta de nuevo.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => { hideAlert(); resetFlags() },
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => { hideAlert(); submitRef.current?.() },
      })
    }
  }, [creating, successPost, requisitionError, hideAlert, resetFlags, showAlert, showSpinner, hideSpinner])

  const handleSubmit = useCallback(async (values: Record<string, any>) => {
    const getOptionLabel = (fieldName: string, value: any): string | undefined => {
      const f = fields.find(x => x.name === fieldName)
      const opt = (f?.options as Array<{ label: string; value: any }> | undefined)?.find(o => o.value === value)
      return opt?.label
    }

    const employeeId = values.employees
    const projectId = values.project
    const requisitionkey = values.expenseType

    const employeeName =
      employees.find(e => e.employee_id === employeeId)?.fullname
      ?? getOptionLabel('employees', employeeId)
      ?? String(employeeId)

    const projectName =
      proyects.find(p => p.id === projectId)?.proyectKey
      ?? getOptionLabel('project', projectId)
      ?? String(projectId)

    const payload: RequitionPost = { requisitionkey, employeename: employeeName, projectname: projectName }
    await createRequisition(payload)
  }, [fields, employees, proyects, createRequisition])

  return (
    <FormsLayout
      title="Si ya cuentas con la factura, sube aquí tus archivos XML y PDF"
      buttonLabel="Subir Archivos"
      onButtonClick={() => submitRef.current?.()}
      buttonDisabled={!formReady}
      enableCollapse={false}
    >
      <DynamicForm
        loadingFormInfo={loadingFormInfo}
        fields={fields}
        layoutMatrix={[[10], [5, 5]]}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    </FormsLayout>
  )
}

export default RequisitionsRequest
