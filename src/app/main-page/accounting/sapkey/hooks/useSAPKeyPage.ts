"use client";

import { useCallback, useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import type {
  SAPKey,
  SAPKeyPost,
  SAPKeyPut,
} from "@/app/mappings/sapkeys/sapkeys.types";
import { useSAPKeysStore } from "@/app/stores/useSAPKeysStore/useSAPKeysStore";

const getSingleQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === "string" && value.trim()) return value;
  return null;
};

const useSAPKeyPage = () => {
  const { all, updateQuery } = useQuery();
  const normalizedId = useMemo(() => getSingleQueryValue(all.id), [all.id]);
  const normalizedView = useMemo(
    () => getSingleQueryValue(all.view),
    [all.view],
  );

  const isCreateView = normalizedView === "new";
  const isEditView = normalizedView === "edit";
  const isListView = !isCreateView && !isEditView;

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const {
    sapKeys,
    sapKey,
    fetchSAPKeys,
    fetchSAPKeyById,
    createSAPKey,
    updateSAPKey,
    deleteSAPKey,
    loadingSAPKeys,
    loadingSAPKey,
    creatingSAPKey,
    updatingSAPKey,
    deletingSAPKey,
    successCreateSAPKey,
    successUpdateSAPKey,
    successDeleteSAPKey,
    error,
    resetFlags,
  } = useSAPKeysStore(
    (state) => ({
      sapKeys: state.sapKeys,
      sapKey: state.sapKey,
      fetchSAPKeys: state.fetchSAPKeys,
      fetchSAPKeyById: state.fetchSAPKeyById,
      createSAPKey: state.createSAPKey,
      updateSAPKey: state.updateSAPKey,
      deleteSAPKey: state.deleteSAPKey,
      loadingSAPKeys: state.loadingSAPKeys,
      loadingSAPKey: state.loadingSAPKey,
      creatingSAPKey: state.creatingSAPKey,
      updatingSAPKey: state.updatingSAPKey,
      deletingSAPKey: state.deletingSAPKey,
      successCreateSAPKey: state.successCreateSAPKey,
      successUpdateSAPKey: state.successUpdateSAPKey,
      successDeleteSAPKey: state.successDeleteSAPKey,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  useEffect(() => {
    void fetchSAPKeys();
  }, [fetchSAPKeys]);

  useEffect(() => {
    if (!isEditView || !normalizedId) return;
    void fetchSAPKeyById(normalizedId, true);
  }, [fetchSAPKeyById, isEditView, normalizedId]);

  useEffect(() => {
    if (loadingSAPKeys) {
      showSpinner({ message: "Cargando claves SAP..." });
      return;
    }

    if (loadingSAPKey) {
      showSpinner({ message: "Cargando detalle de la clave..." });
      return;
    }

    if (creatingSAPKey) {
      showSpinner({ message: "Registrando clave SAP..." });
      return;
    }

    if (updatingSAPKey) {
      showSpinner({ message: "Actualizando clave SAP..." });
      return;
    }

    if (deletingSAPKey) {
      showSpinner({ message: "Eliminando clave SAP..." });
      return;
    }

    hideSpinner();

    if (error) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      resetFlags();
      return;
    }

    if (successCreateSAPKey) {
      showAlert({
        type: "success",
        title: "Clave registrada",
        description: "La clave SAP se registro correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFlags();
      return;
    }

    if (successUpdateSAPKey) {
      showAlert({
        type: "success",
        title: "Clave actualizada",
        description: "La clave SAP se actualizo correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFlags();
      return;
    }

    if (successDeleteSAPKey) {
      showAlert({
        type: "success",
        title: "Clave eliminada",
        description: "La clave SAP se elimino correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFlags();
    }
  }, [
    creatingSAPKey,
    deletingSAPKey,
    error,
    hideSpinner,
    loadingSAPKey,
    loadingSAPKeys,
    resetFlags,
    showAlert,
    showSpinner,
    successCreateSAPKey,
    successDeleteSAPKey,
    successUpdateSAPKey,
    updatingSAPKey,
  ]);

  const activeSAPKeys = useMemo(
    () => sapKeys.filter((item) => item.isActive),
    [sapKeys],
  );

  const selectedSAPKey = useMemo<SAPKey | null>(() => {
    if (!normalizedId) return null;

    return (
      activeSAPKeys.find((item) => item.id === normalizedId) ??
      (sapKey?.id === normalizedId ? sapKey : null)
    );
  }, [activeSAPKeys, normalizedId, sapKey]);

  const loadingFormInfo = isEditView && loadingSAPKey && !selectedSAPKey;
  const submitting = creatingSAPKey || updatingSAPKey;

  const handleRefresh = useCallback(() => {
    void fetchSAPKeys(true);
  }, [fetchSAPKeys]);

  const handleOpenCreate = useCallback(() => {
    updateQuery({ id: null, view: "new" });
  }, [updateQuery]);

  const handleOpenEdit = useCallback(
    (item: SAPKey) => {
      updateQuery({ id: item.id, view: "edit" });
    },
    [updateQuery],
  );

  const handleBackToList = useCallback(() => {
    updateQuery({ id: null, view: null });
  }, [updateQuery]);

  const handleDeleteSAPKey = useCallback(
    async (item: SAPKey) => {
      await deleteSAPKey(item.id);
    },
    [deleteSAPKey],
  );

  const handleSubmit = useCallback(
    async (payload: SAPKeyPost | SAPKeyPut) => {
      if (isEditView && normalizedId) {
        const updatePayload: SAPKeyPut = {
          ...(payload as SAPKeyPut),
          id: normalizedId,
        };
        const updated = await updateSAPKey(updatePayload);
        if (updated) {
          handleBackToList();
        }
        return updated;
      }

      const created = await createSAPKey(payload as SAPKeyPost);
      if (created) {
        handleBackToList();
      }
      return created;
    },
    [createSAPKey, handleBackToList, isEditView, normalizedId, updateSAPKey],
  );

  return {
    sapKeys: activeSAPKeys,
    selectedSAPKey,
    isCreateView,
    isEditView,
    isListView,
    loadingFormInfo,
    submitting,
    handleRefresh,
    handleOpenCreate,
    handleOpenEdit,
    handleBackToList,
    handleDeleteSAPKey,
    handleSubmit,
  };
};

export default useSAPKeyPage;
