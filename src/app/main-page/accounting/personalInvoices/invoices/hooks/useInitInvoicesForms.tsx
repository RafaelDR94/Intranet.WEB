import { useMemo, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { useInvoices } from "../context/InvoicesContext";

import { InitInvoicesForms } from "./types";

import { FieldModel } from "@/app/components/DynamicForm/types";
import {
  BillingDocumentCategory,
  BillingDocumentDescription,
} from "@/app/mappings/billingdocuments/billingdocuments.types";
import { Requisition } from "@/app/mappings/requisitions/requisitions.types";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";
import { useBillingRequisitionWithEmployeesStore } from "@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore";

const useInitInvoicesForms = ({
  initialformFields,
  field,
  formId,
  dataEdit,
  billingImages,
}: InitInvoicesForms) => {
  const {
    user,
    requisitions,
    billingDocumentDescription,
    billingCategories,
    setFields,
    updateField,
    resetFields,
  } = useInvoices();
  const { currentRequisition } = useRequisitionsStore(
    (s) => ({
      currentRequisition: s.currentRequisition,
    }),
    shallow,
  );
  const { pendingBillingDocuments, fetchBillingDocumentsPendingByEmployee } =
    useBillingRequisitionWithEmployeesStore(
    (s) => ({
      pendingBillingDocuments: s.pendingBillingDocuments,
      fetchBillingDocumentsPendingByEmployee: s.fetchBillingDocumentsPendingByEmployee,
    }),
    shallow,
  );
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const searchParams = useSearchParams();
  const urlRequisitionId =
    searchParams.get("idRequisition") ?? searchParams.get("id");
  const urlView = searchParams.get("view");
  const urlEmployeeId = searchParams.get("idEmployee");
  const lockRequisitionFields =
    urlView === "billablefiles" &&
    normalizedPath === "/main-page/accounting/personalInvoices/requisitions";
  const lockEmployeeFields =
    lockRequisitionFields ||
    normalizedPath === "/main-page/request/ownrequisitions/uploadbillablefiles";
  const submitRef = useRef<() => void | Promise<void>>(null);
  const prefilledRequisitionIdRef = useRef<string | null>(null);
  const lastPrefillKeyRef = useRef<string | null>(null);
  const [formReady, setFormReady] = useState(false);
  const fieldsReady = field.length > 0;
  const filteredRequisitions = useMemo(() => {
    const employeeId = urlEmployeeId ?? user?.idEmployee;
    if (!employeeId) return requisitions;
    return requisitions.filter(
      (r) => String(r.id_Employee) === String(employeeId),
    );
  }, [requisitions, urlEmployeeId, user?.idEmployee]);

  const requisitionOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    filteredRequisitions.forEach((item) => {
      const value = item.billingrequisition_id;
      if (!value) return;
      const label = `${item.requisitionkey} - ${item.projectname}`.trim();
      if (!map.has(value)) map.set(value, { label, value });
    });

    pendingBillingDocuments.forEach((doc) => {
      const value =
        doc.requisition?.billingrequisition_id ??
        (doc as any)?.billingrequisition_id ??
        (doc as any)?.requisition_id ??
        (doc as any)?.requisitionId ??
        "";
      if (!value || map.has(value)) return;
      const requisitionKey =
        doc.requisition?.requisitionkey ?? (doc as any)?.requisitionkey ?? "";
      const projectName =
        doc.requisition?.projectname ?? (doc as any)?.projectname ?? "";
      const label = `${requisitionKey || value} - ${projectName}`.trim();
      map.set(value, { label, value });
    });

    return Array.from(map.values());
  }, [filteredRequisitions, pendingBillingDocuments]);

  const ResetForm = () => {
    const initialFields: FieldModel[] = initialformFields;
    setFields(formId, initialFields);
    setTimeout(() => {
      setUser();
      SetInitRequisitions();
      SetDescriptions();
      SetCategories();
    }, 500);
  };
  const setUser = () => {
    if (user && fieldsReady) {
      updateField(formId, "debtorName", { value: user.fullName });
    }
  };
  const SetDescriptions = () => {
    if (billingDocumentDescription)
      updateField(formId, "description", {
        options: billingDocumentDescription.map(
          (r: BillingDocumentDescription) => ({
            label: r.name,
            value: String(r.id_billingdescription),
          }),
        ),
        onChange: (value) => {
          updateField(formId, "description", { value });
        },
      });
  };
  const SetCategories = () => {
    if (billingCategories)
      updateField(formId, "category", {
        options: billingCategories.map((r: BillingDocumentCategory) => ({
          label: r.name,
          value: String(r.id_billingcategory),
        })),
        onChange: (value) => {
          updateField(formId, "category", { value });
          syncFieldsWithCategory(value);
        },
      });
  };
  const SetInitRequisitions = () => {
    updateField(formId, "requisition", {
      options: requisitionOptions,
      onChange: (value) => {
        const requisition = filteredRequisitions.find(
          (r) => r.billingrequisition_id === value,
        );
        const employeeName = requisition?.employeename;
        const proyect = requisition?.projectname;
        const debtorName = field.find((f) => f.name === "personName");
        updateField(formId, "proyect", {
          value: proyect,
          onlyText: lockEmployeeFields,
        });
        updateField(formId, "requisition", { value: value });
        if (debtorName) {
          updateField(formId, "personName", {
            value: employeeName,
            onlyText: lockEmployeeFields,
          });
        }
        const debtorNameAlt = field.find((f) => f.name === "debtorName");
        if (debtorNameAlt) {
          updateField(formId, "debtorName", {
            value: employeeName,
            onlyText: lockEmployeeFields,
          });
        }
      },
    });
  };

  const prefillFromRequisition = (requisitionId: string) => {
    const requisition = filteredRequisitions.find(
      (r) => r.billingrequisition_id === requisitionId,
    );
    if (!requisition) return;

    updateField(formId, "requisition", { value: requisitionId });
    updateField(formId, "proyect", {
      value: requisition.projectname ?? "",
      onlyText: true,
    });

    const personName = field.find((f) => f.name === "personName");
    if (personName) {
      updateField(formId, "personName", {
        value: requisition.employeename ?? "",
        onlyText: true,
      });
    }

    const debtorName = field.find((f) => f.name === "debtorName");
    if (debtorName) {
      updateField(formId, "debtorName", {
        value: requisition.employeename ?? "",
        onlyText: true,
      });
    }
  };

  const prefillFromCurrentRequisition = (requisition: Requisition) => {
    updateField(formId, "requisition", {
      value: requisition.billingrequisition_id,
    });
    updateField(formId, "proyect", {
      value: requisition.projectname ?? "",
      onlyText: true,
    });

    const personName = field.find((f) => f.name === "personName");
    if (personName) {
      updateField(formId, "personName", {
        value: requisition.employeename ?? "",
        onlyText: true,
      });
    }

    const debtorName = field.find((f) => f.name === "debtorName");
    if (debtorName) {
      updateField(formId, "debtorName", {
        value: requisition.employeename ?? "",
        onlyText: true,
      });
    }
  };

  useEffect(() => {
    setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.fullName, fieldsReady, formId]);

  useEffect(() => {
    const initialFields: FieldModel[] = initialformFields;
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      SetInitRequisitions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  useEffect(() => {
    SetInitRequisitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRequisitions, requisitionOptions.length]);

  useEffect(() => {
    if (!lockRequisitionFields) {
      return;
    }

    const targetId =
      urlRequisitionId ?? currentRequisition?.billingrequisition_id ?? null;
    if (!targetId) return;
    if (prefilledRequisitionIdRef.current === targetId) return;

    if (currentRequisition?.billingrequisition_id === targetId) {
      prefillFromCurrentRequisition(currentRequisition);
    } else {
      prefillFromRequisition(targetId);
    }

    prefilledRequisitionIdRef.current = targetId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    urlRequisitionId,
    urlView,
    pathname,
    requisitions,
    field,
    currentRequisition,
  ]);

  useEffect(() => {
    if (!urlEmployeeId) return;
    fetchBillingDocumentsPendingByEmployee(urlEmployeeId, true);
  }, [fetchBillingDocumentsPendingByEmployee, urlEmployeeId]);

  useEffect(() => {
    SetDescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingDocumentDescription]);
  useEffect(() => {
    SetCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingCategories]);

  useEffect(() => {
    const requisitionId = dataEdit
      ? filteredRequisitions.find(
          (r) => r.requisitionkey === dataEdit?.requisitionkey,
        )
          ?.billingrequisition_id
      : billingImages?.requisition_id;
    const categoryId = dataEdit
      ? dataEdit.category.id_billingcategory
      : billingImages?.category?.id_billingcategory;
    const descriptionId = dataEdit
      ? dataEdit.description.id_billingdescription
      : billingImages?.description?.id_billingdescription;
    const prefillKey =
      dataEdit?.billingdocument_id ?? billingImages?.billing_image_id ?? null;
    const prefillSourceChanged = prefillKey !== lastPrefillKeyRef.current;
    const currentDescriptionValue = field.find((f) => f.name === "description")
      ?.value as string | undefined;
    if (filteredRequisitions.length > 0)
      updateField(formId, "requisition", {
        value: requisitionId,
      });
    if (billingCategories.length > 0 && categoryId)
      updateField(formId, "category", {
        value: String(categoryId),
      });
    if (
      billingDocumentDescription.length > 0 &&
      descriptionId &&
      (prefillSourceChanged ||
        currentDescriptionValue === undefined ||
        currentDescriptionValue === "")
    )
      updateField(formId, "description", {
        value: String(descriptionId),
      });
    syncFieldsWithCategory(categoryId ?? null);
    if (billingImages?.proyect)
      updateField(formId, "proyect", {
        value: billingImages?.proyect,
        onlyText: true,
      });
    if (billingImages?.numnights)
      updateField(formId, "numnights", {
        value: billingImages?.numnights,
        label: "No. de Noches",
      });
    if (billingImages?.numpersons)
      updateField(formId, "numpersons", {
        value: billingImages?.numpersons,
        label: "No. de Personas",
      });
    const debtorName = field.find((f) => f.name === "personName");
    if (debtorName)
      updateField(formId, "personName", {
        value: billingImages?.deudor ?? "",
        onlyText: true,
      });
    if (prefillSourceChanged) {
      lastPrefillKeyRef.current = prefillKey;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataEdit,
    filteredRequisitions,
    billingImages,
    billingCategories,
    billingDocumentDescription,
  ]);

  function syncFieldsWithCategory(categoryId?: string | null) {
    const normalizedId = categoryId ? String(categoryId) : "";
    const category = billingCategories.find(
      (item) => String(item.id_billingcategory) === normalizedId,
    );
    const fallbackLabel =
      field
        .find((item) => item.name === "category")
        ?.options?.find((opt) => String(opt.value) === normalizedId)?.label ?? "";
    const rawName = String(category?.name ?? fallbackLabel).trim().toLowerCase();
    const name = rawName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isHospedaje = name.includes("hospedaje");
    const isTransport =
      name.includes("traslado") ||
      name.includes("autobuses");
    const isFood =
      name.includes("alimento") ||
      name.includes("alimentacion") ||
      name.includes("desayuno") ||
      name.includes("comida") ||
      name.includes("cena") ||
      name.includes("almuerzo");
    const currentField = field.find((item) => item.name === "numnights");
    const shouldDisable = !isHospedaje;
    const hasRequired = currentField?.validations?.some((v) => v.type === "required");

    const currentPersons = field.find((item) => item.name === "numpersons");
    const shouldRequirePersons = isHospedaje || isFood || isTransport;
    const shouldDisablePersons = !shouldRequirePersons;
    const personsHasRequired = currentPersons?.validations?.some(
      (v) => v.type === "required",
    );

    if (
      currentField &&
      currentField.disabled === shouldDisable &&
      hasRequired === isHospedaje &&
      (shouldDisable ? currentField.value === 0 : true) &&
      currentPersons &&
      currentPersons.disabled === shouldDisablePersons &&
      personsHasRequired === shouldRequirePersons &&
      (shouldDisablePersons ? currentPersons.value === 0 : true)
    ) {
      return;
    }

    updateField(formId, "numnights", {
      disabled: shouldDisable,
      validations: isHospedaje ? [{ type: "required" }] : [],
      ...(isHospedaje ? {} : { value: 0 }),
    });

    updateField(formId, "numpersons", {
      disabled: shouldDisablePersons,
      validations: shouldRequirePersons ? [{ type: "required" }] : [],
      ...(shouldDisablePersons ? { value: 0 } : {}),
    });
  }

  useEffect(() => {
    const categoryValue = field.find((item) => item.name === "category")
      ?.value as string | undefined;
    syncFieldsWithCategory(categoryValue ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, billingCategories]);

  const computeLoadingFormInfo = (fields: FieldModel[]) => {
    const req = fields.find((f) => f.name === "requisition");
    const description = fields.find((f) => f.name === "description");
    const category = fields.find((f) => f.name === "category");
    const debtorName = fields.find((f) => f.name === "debtorName");
    const hasDebtor = Boolean(debtorName);
    const reqReady =
      !req || (Array.isArray(req?.options) && (req?.options?.length ?? 0) > 0);
    const descReady =
      !description ||
      (Array.isArray(description?.options) &&
        (description?.options?.length ?? 0) > 0);
    const catReady =
      !category ||
      (Array.isArray(category?.options) && (category?.options?.length ?? 0) > 0);
    return !(reqReady && descReady && catReady && (debtorName?.value || !hasDebtor));
  };

  const loadingFormInfo = useMemo(() => computeLoadingFormInfo(field), [field]);

  return {
    requisitions,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    ResetForm,
    updateField,
  };
};
export default useInitInvoicesForms;
