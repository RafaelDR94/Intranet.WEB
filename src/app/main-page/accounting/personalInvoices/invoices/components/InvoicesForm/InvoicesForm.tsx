'use client'
import { useRef, useState, useEffect, useMemo } from 'react'
import { FieldModel } from '@/app/components/DynamicForm/types'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import FormsLayout from '@/app/components/FormsLayout/FormsLayout'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore'
import { shallow } from 'zustand/shallow';
import { Proyect } from '@/app/mappings/proyects/proyects.types'
import { Requisition } from '@/app/mappings/requisitions/requisitions.types'

const InvoicesForm = () => {
  const initialformFields: FieldModel[] = [
    {
      type: 'input',
      name: 'debtorName',
      label: 'Nombre del Deudor',
      placeholder: 'Ingrese el nombre completo',
      value: "",
      className: 'max-w-[400px]',
      onlyText: true,
      showIf: (value) => value.debtorName
    },
    {
      type: 'select',
      name: 'project',
      label: 'Seleccionar Proyecto',
      placeholder: 'Proyecto',
      value: '',
      options: [
      ], className: 'max-w-[400px]', onlyText: false,
      showIf: (_v, all) => {
        const f = all.find(x => x.name === 'project');
        return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
      },
    },
    {
      type: 'select',
      name: 'requisition',
      label: 'Código de Requisición',
      placeholder: 'Seleccione el código',
      value: '',
      options: [],
      className: 'max-w-[400px]',
      showIf: (_v, all) => {
        const f = all.find(x => x.name === 'requisition');
        return Array.isArray(f?.options) && (f.options?.length ?? 0) > 0;
      },
    },
    { type: 'file', name: 'xml', label: 'Documento XML', value: null, accept: '.xml', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
    { type: 'file', name: 'pdf', label: 'Documento PDF', value: null, accept: '.pdf', validations: [{ type: 'required' }], className: 'max-w-[300px]' },
  ]
  const { user } = useAuth();
  const formId = "invoices-form";
  const { proyects, proyectsError, fetchProyects } = useProyectsStore(
    (s) => ({
      proyects: s.proyects,
      proyectsError: s.error,
      fetchProyects: s.fetchProyects,
    }),
    shallow
  );
  const { requisitions, requisitionsError, fetchRequisitions } = useRequisitionsStore(
    (s) => ({
      requisitions: s.requisitions,
      requisitionsError: s.error,
      fetchRequisitions: s.fetchRequisitions,
    }),
    shallow
  );
  const fields = useFormFieldsStore((s) => s.fieldsByFormId[formId] ?? []);
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  useEffect(() => {
    fetchProyects();
    fetchRequisitions();
  }, [])
const fieldsReady = fields.length > 0;

useEffect(() => {
  if (user && fieldsReady) {
    updateField(formId, 'debtorName', { value: user.fullName });
  }
}, [user?.fullName, fieldsReady, formId]);

  useEffect(() => {
    const initialFields: FieldModel[] = initialformFields;
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      //resetFlags();
    };
  }, [formId]);

  useEffect(() => {
    if (proyects?.length) {
      updateField(formId, 'project', {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
      });
    }
  }, [proyects, formId]);

  useEffect(() => {
    if (requisitions?.length) {
      updateField(formId, 'requisition', {
        options: requisitions.map((r: Requisition) => ({
          label: r.requisitionkey,
          value: r.billingrequisition_id,
        })),
      });
    }
  }, [requisitions, formId]);
  const computeLoadingFormInfo = (fields: FieldModel[]) => {
    console.log("fields", fields);
    const req = fields.find(f => f.name === 'requisition');
    const prj = fields.find(f => f.name === 'project');
    const debtorName = fields.find(f => f.name === 'debtorName');
    const reqReady = Array.isArray(req?.options) && (req?.options?.length ?? 0) > 0;
    const projectsReady = Array.isArray(prj?.options) && (prj?.options?.length ?? 0) > 0;
    return !(reqReady && projectsReady && debtorName?.value);
  };
  const loadingFormInfo = useMemo(() => computeLoadingFormInfo(fields), [fields]);
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { withLoading } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const submitRef = useRef<() => void | Promise<void>>(null)
  const [formReady, setFormReady] = useState(false)



  const uploadInvoice = async (values: Record<string, any>) => {
    const form = new FormData()
    form.append('debtorName', values.debtorName ?? '')
    form.append('project', values.project ?? '')
    form.append('expenseType', values.expenseType ?? '')
    const xmlFile: File | null = Array.isArray(values.xml) ? values.xml[0] : values.xml ?? null
    const pdfFile: File | null = Array.isArray(values.pdf) ? values.pdf[0] : values.pdf ?? null
    if (xmlFile) form.append('xml', xmlFile)
    if (pdfFile) form.append('pdf', pdfFile)
    // await fetch('/api/invoices/upload', { method: 'POST', body: form })
    await new Promise(r => setTimeout(r, 1200))
  }

  return (
    <FormsLayout
      title="Si ya cuentas con la factura, sube aquí tus archivos XML y PDF"
      primaryLabel="Subir Archivos"
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={false}

    >
      <DynamicForm
        fields={fields}
        layoutMatrix={[[10], [5, 5], [5, 5]]}
        loadingFormInfo={loadingFormInfo}
        onSubmit={async (values) => {
          try {
            await withLoading(() => uploadInvoice(values), {
              message: 'Subiendo tus archivos…',
              spinnerSize: 'large',
            })
            showAlert({
              type: 'success',
              variant: 'filled',
              title: '¡Archivos enviados!',
              description: 'Tu XML y PDF fueron cargados correctamente.',
              showPrimaryButton: true,
              showSecondaryButton: false,
              primaryLabel: 'Cerrar',
              onPrimaryClick: hideAlert,
            })
          } catch (err: any) {
            showAlert({
              type: 'error',
              variant: 'filled',
              title: 'No se pudo enviar',
              description: err?.message ?? 'Ocurrió un error al subir los archivos. Intenta de nuevo.',
              showPrimaryButton: true,
              primaryLabel: 'Entendido',
              onPrimaryClick: hideAlert,
              showSecondaryButton: true,
              secondaryLabel: 'Reintentar',
              onSecondaryClick: () => {
                hideAlert()
                submitRef.current?.()
              },
            })
          }
        }}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    </FormsLayout>
  )
}

export default InvoicesForm
