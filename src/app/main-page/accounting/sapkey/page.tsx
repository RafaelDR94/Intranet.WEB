"use client";

import React from "react";

import SAPForm from "./components/SAPForm/SAPForm";
import SAPTable from "./components/SAPTable/SAPTable";
import useSAPKeyPage from "./hooks/useSAPKeyPage";

const SAPKeyPage = () => {
  const {
    sapKeys,
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
  } = useSAPKeyPage();

  if (isCreateView || isEditView) {
    return (
      <SAPForm
        mode={isCreateView ? "create" : "edit"}
        sapKey={isCreateView ? null : selectedSAPKey}
        loadingFormInfo={loadingFormInfo}
        submitting={submitting}
        onBack={handleBackToList}
        onSubmit={handleSubmit}
      />
    );
  }

  if (!isListView) return null;

  return (
    <SAPTable
      sapKeys={sapKeys}
      onCreate={handleOpenCreate}
      onEdit={handleOpenEdit}
      onDelete={handleDeleteSAPKey}
      onRefresh={handleRefresh}
    />
  );
};

export default SAPKeyPage;
