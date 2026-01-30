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
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const searchParams = useSearchParams();
  const urlRequisitionId = searchParams.get("id");
  const urlView = searchParams.get("view");
  const lockRequisitionFields =
    urlView === "billablefiles" &&
    normalizedPath === "/main-page/accounting/personalInvoices/requisitions";
  const submitRef = useRef<() => void | Promise<void>>(null);
  const prefilledRequisitionIdRef = useRef<string | null>(null);
  const [formReady, setFormReady] = useState(false);
  const fieldsReady = field.length > 0;

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
            value: r.id_billingdescription,
          }),
        ),
        onChange: (value) => {
          updateField(formId, "description", { value });
          syncNumnightsWithDescription(value);
        },
      });
    const currentDescription = field.find((f) => f.name === "description")
      ?.value as string | undefined;
    syncNumnightsWithDescription(currentDescription ?? null);
  };
  const SetCategories = () => {
    if (billingCategories)
      updateField(formId, "category", {
        options: billingCategories.map((r: BillingDocumentCategory) => ({
          label: r.name,
          value: r.id_billingcategory,
        })),
      });
  };
  const SetInitRequisitions = () => {
    updateField(formId, "requisition", {
      options: requisitions.map((r: Requisition) => ({
        label: r.requisitionkey + " - " + r.projectname,
        value: r.billingrequisition_id,
      })),
      onChange: (value) => {
        const employeeName = requisitions.find(
          (r) => r.billingrequisition_id === value,
        )?.employeename;
        const proyect = requisitions.find(
          (r) => r.billingrequisition_id === value,
        )?.projectname;
        const debtorName = field.find((f) => f.name === "personName");
        updateField(formId, "proyect", {
          value: proyect,
          onlyText: lockRequisitionFields,
        });
        updateField(formId, "requisition", { value: value });
        if (debtorName) {
          updateField(formId, "personName", {
            value: employeeName,
            onlyText: lockRequisitionFields,
          });
        }
        const debtorNameAlt = field.find((f) => f.name === "debtorName");
        if (debtorNameAlt) {
          updateField(formId, "debtorName", {
            value: employeeName,
            onlyText: lockRequisitionFields,
          });
        }
      },
    });
  };

  const prefillFromRequisition = (requisitionId: string) => {
    const requisition = requisitions.find(
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
  }, [requisitions]);

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
    SetDescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingDocumentDescription]);
  useEffect(() => {
    SetCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingCategories]);

  useEffect(() => {
    const requisitionId = dataEdit
      ? requisitions.find((r) => r.requisitionkey === dataEdit?.requisitionkey)
          ?.billingrequisition_id
      : billingImages?.requisition_id;
    const categoryId = dataEdit
      ? dataEdit.category.id_billingcategory
      : billingImages?.category?.id_billingcategory;
    const descriptionId = dataEdit
      ? dataEdit.description.id_billingdescription
      : billingImages?.description?.id_billingdescription;
    if (requisitions.length > 0)
      updateField(formId, "requisition", {
        value: requisitionId,
      });
    if (billingCategories.length > 0)
      updateField(formId, "category", {
        value: categoryId,
      });
    if (billingDocumentDescription.length > 0)
      updateField(formId, "description", {
        value: descriptionId,
      });
    syncNumnightsWithDescription(descriptionId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataEdit,
    requisitions,
    billingImages,
    billingCategories,
    billingDocumentDescription,
  ]);

  function syncNumnightsWithDescription(descriptionId?: string | null) {
    const normalizedId = descriptionId ? String(descriptionId) : "";
    const description = billingDocumentDescription.find(
      (item) => String(item.id_billingdescription) === normalizedId,
    );
    const name = String(description?.name ?? "").trim().toLowerCase();
    const isHospedaje = name === "hospedaje" || name.includes("hospedaje");
    const currentField = field.find((item) => item.name === "numnights");
    const shouldDisable = !isHospedaje;
    const hasRequired = currentField?.validations?.some((v) => v.type === "required");

    if (
      currentField &&
      currentField.disabled === shouldDisable &&
      hasRequired === isHospedaje &&
      (shouldDisable ? currentField.value === 0 : true)
    ) {
      return;
    }

    updateField(formId, "numnights", {
      disabled: shouldDisable,
      validations: isHospedaje ? [{ type: "required" }] : [],
      ...(isHospedaje ? {} : { value: 0 }),
    });
  }

  useEffect(() => {
    const descriptionValue = field.find((item) => item.name === "description")
      ?.value as string | undefined;
    syncNumnightsWithDescription(descriptionValue ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, billingDocumentDescription]);

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
