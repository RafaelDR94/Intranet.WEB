"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import type { SelectedImage } from "@/app/components/ImageUploaderExpanded/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";

import type { CompanyFormValues, CompanyViewMode } from "../types";

const PAGE_SIZE = 8;

const defaultFormValues: CompanyFormValues = {
  name: "",
  companytype: "",
  rfc: "",
  businessindustry: "",
};

export const useCompaniesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") ?? "list") as CompanyViewMode;
  const editId = searchParams.get("id");

  const isCreateView = view === "new";
  const isEditView = view === "edit";

  const hasAskedEnterprises = useRef(false);
  const hasHydratedEdit = useRef(false);
  const editIsExternal = useRef(false);
  const submitRef = useRef<() => void | Promise<void>>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [logo, setLogo] = useState<File | SelectedImage[] | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CompanyFormValues>(defaultFormValues);
  const [isFormValid, setIsFormValid] = useState(false);

  const { firebasestorage } = useFirebase();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const {
    enterprises,
    fetchEnterprises,
    loadingEnterprises,
    error,
    createEnterprise,
    updateEnterprise,
    creating,
    updating,
    successPost,
    successPut,
    resetFlags,
  } = useEnterprisesStore(
    (state) => ({
      enterprises: state.enterprises,
      fetchEnterprises: state.fetchEnterprises,
      loadingEnterprises: state.loadingEnterprises,
      error: state.error,
      createEnterprise: state.createEnterprise,
      updateEnterprise: state.updateEnterprise,
      creating: state.creating,
      updating: state.updating,
      successPost: state.successPost,
      successPut: state.successPut,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const totalPages = useMemo(() => {
    if (!enterprises.length) return 1;
    return Math.ceil(enterprises.length / PAGE_SIZE);
  }, [enterprises.length]);

  useEffect(() => {
    if (hasAskedEnterprises.current) return;
    hasAskedEnterprises.current = true;
    fetchEnterprises(true);
  }, [fetchEnterprises]);

  useEffect(() => {
    if (creating || updating) {
      showSpinner({
        message: updating ? "Actualizando empresa" : "Registrando empresa",
      });
      return;
    }
    hideSpinner();
  }, [creating, hideSpinner, showSpinner, updating]);

  useEffect(() => {
    if (successPost || successPut) {
      showAlert({
        type: "success",
        title: "Registro exitoso",
        description: isEditView
          ? "La empresa se actualizo correctamente."
          : "La empresa se registro correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1000,
      });
      resetFlags();
      router.push("/main-page/humanresources/companies");
      return;
    }

    if (error && (isCreateView || isEditView)) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      resetFlags();
    }
  }, [
    error,
    isCreateView,
    isEditView,
    resetFlags,
    router,
    showAlert,
    successPost,
    successPut,
  ]);

  useEffect(() => {
    if (!isEditView || !editId) return;
    if (hasHydratedEdit.current) return;
    const target = enterprises.find((item) => item.enterprise_id === editId);
    if (!target) return;
    hasHydratedEdit.current = true;
    editIsExternal.current = Boolean(target.is_external);
    setFormValues({
      name: target.name ?? "",
      companytype: target.companytype ?? "",
      rfc: target.rfc ?? "",
      businessindustry: target.businessindustry ?? "",
    });
    setLogoUrl(target.imgurl ?? null);
  }, [editId, enterprises, isEditView]);

  useEffect(() => {
    if (isEditView) return;
    hasHydratedEdit.current = false;
    editIsExternal.current = false;
    setFormValues(defaultFormValues);
    setLogo(null);
    setLogoUrl(null);
  }, [isEditView, isCreateView]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return enterprises.slice(start, start + PAGE_SIZE);
  }, [enterprises, currentPage]);
  const showPagination = enterprises.length > PAGE_SIZE;

  const hasLogo = Boolean(logo) || Boolean(logoUrl);
  const isReady = useMemo(
    () => isFormValid && hasLogo,
    [hasLogo, isFormValid],
  );

  const formFields: FieldModel[] = [
    {
      type: "input",
      name: "name",
      label: "Nombre de la empresa",
      placeholder: "Nombre",
      value: formValues.name,
      className: "w-full",
      validations: [{ type: "required" }],
    },
    {
      type: "input",
      name: "companytype",
      label: "Tipo de empresa",
      placeholder: "Tipo",
      value: formValues.companytype,
      className: "w-full",
      validations: [{ type: "required" }],
    },
    {
      type: "input",
      name: "rfc",
      label: "RFC Empresarial",
      placeholder: "RFC",
      value: formValues.rfc,
      className: "w-full",
      validations: [{ type: "required" }],
    },
    {
      type: "input",
      name: "businessindustry",
      label: "Giro de la empresa",
      placeholder: "Giro empresarial",
      value: formValues.businessindustry,
      className: "w-full",
      validations: [{ type: "required" }],
    },
  ];

  const toSlug = (value: string) =>
    value
      .toLocaleLowerCase("es-MX")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const resolveLogoUrl = async (
    fileOrSelection: File | SelectedImage[] | null,
    fallbackUrl: string | null,
    name: string,
  ): Promise<string> => {
    if (fileOrSelection instanceof File) {
      const pathId = (editId ?? toSlug(name)) || "enterprise";
      const url = await firebasestorage.uploadImage(
        fileOrSelection,
        `Enterprises/Logos/${pathId}-${Date.now()}`
      );
      if (!url) throw new Error("No se pudo subir el logotipo.");
      return url;
    }

    if (Array.isArray(fileOrSelection)) {
      const selected = fileOrSelection.find((item) => item.selected !== false);
      if (selected?.url) return selected.url;
      if (selected?.file) {
        const pathId = (editId ?? toSlug(name)) || "enterprise";
        const url = await firebasestorage.uploadImage(
          selected.file,
          `Enterprises/Logos/${pathId}-${Date.now()}`
        );
        if (!url) throw new Error("No se pudo subir el logotipo.");
        return url;
      }
    }

    if (fallbackUrl) return fallbackUrl;
    throw new Error("Selecciona el logotipo de la empresa.");
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const payload = {
      name: String(values.name ?? "").trim(),
      companytype: String(values.companytype ?? "").trim(),
      rfc: String(values.rfc ?? "").trim(),
      businessindustry: String(values.businessindustry ?? "").trim(),
    };
    if (!payload.name) return;
    showSpinner({
      message: isEditView ? "Actualizando empresa" : "Registrando empresa",
    });
    let imgurl: string;
    try {
      imgurl = await resolveLogoUrl(logo, logoUrl, payload.name);
    } catch (err) {
      hideSpinner();
      showAlert({
        type: "error",
        title: "No se pudo cargar el logotipo",
        description: err instanceof Error ? err.message : "Ocurrió un error.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      return;
    }
    if (isEditView && editId) {
      await updateEnterprise({
        enterprise_id: editId,
        ...payload,
        is_external: editIsExternal.current,
        imgurl,
      });
      return;
    }
    await createEnterprise({ ...payload, imgurl });
  };

  const handleFormValuesChange = (values: Record<string, any>) => {
    setFormValues({
      name: String(values.name ?? ""),
      companytype: String(values.companytype ?? ""),
      rfc: String(values.rfc ?? ""),
      businessindustry: String(values.businessindustry ?? ""),
    });
  };

  const handleEditClick = (enterpriseId: string) => {
    router.push(
      `/main-page/humanresources/companies?view=edit&id=${enterpriseId}`,
    );
  };

  const handleNewClick = () => {
    router.push("/main-page/humanresources/companies?view=new");
  };

  const handlePrimaryClick = () => submitRef.current?.();

  const title = isEditView
    ? "Edita aqui la empresa en la intranet"
    : "Registra aqui una empresa en la intranet";
  const primaryLabel = isEditView ? "Guardar cambios" : "Activar Empresa";

  return {
    view,
    editId,
    isCreateView,
    isEditView,
    submitRef,
    title,
    primaryLabel,
    formFields,
    isReady,
    creating,
    updating,
    handleSubmit,
    handleFormValuesChange,
    handlePrimaryClick,
    setIsFormValid,
    logo,
    setLogo,
    logoUrl,
    loadingEnterprises,
    enterprises,
    paginatedEnterprises,
    currentPage,
    totalPages,
    setCurrentPage,
    showPagination,
    error,
    handleEditClick,
    handleNewClick,
  };
};

export default useCompaniesPage;
