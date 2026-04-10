"use client";

import Image from "next/image";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import ImageUploaderExpanded from "@/app/components/ImageUploaderExpanded/ImageUploaderExpanded";
import Pagination from "@/app/components/Pagination/Pagination";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

import { companiesStyles } from "./styles";
import useCompaniesPage from "./hooks/useCompaniesPage";
import {
  getEnterpriseLogo,
  getEnterpriseLogoAlt,
} from "./utilities/enterpriseLogos";

const CompaniesPage = () => {
  const {
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
    setLogo,
    logoUrl,
    loadingEnterprises,
    paginatedEnterprises,
    currentPage,
    totalPages,
    setCurrentPage,
    showPagination,
    error,
    handleEditClick,
    handleNewClick,
    enterprises,
  } = useCompaniesPage();

  if (isCreateView || isEditView) {
    return (
      <FormsLayout
        title={title}
        primaryLabel={primaryLabel}
        onPrimaryClick={handlePrimaryClick}
        primaryDisabled={!isReady || creating || updating}
        enableCollapse={false}
        primaryButtonDataTour="companies-create-submit"
      >
        <div className={companiesStyles.formCard}>
          <div className={companiesStyles.formGrid}>
            <div>
              <ImageUploaderExpanded
                placeholder="arrastra/selecciona el logotipo de la empresa"
                buttonLabel="Subir Imagen"
                onImage={setLogo}
                preview
                initialFile={
                  isEditView && logoUrl
                    ? { name: "enterprise-logo", url: logoUrl }
                    : undefined
                }
                className="min-h-[220px]"
                dataTestId="companies-create-logo"
              />
            </div>

            <DynamicForm
              fields={formFields}
              onSubmit={handleSubmit}
              externalSubmitRef={submitRef}
              showSubmitIf={() => false}
              responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10]],
                md: [
                  [5, 5],
                  [5, 5],
                ],
              }}
              onValidChange={setIsFormValid}
              onValuesChange={handleFormValuesChange}
              dataTestId="companies-create-form"
            />
          </div>
        </div>
      </FormsLayout>
    );
  }

  return (
    <FormsLayout
      title="Catálogo de empresas de la familia DR Security"
      primaryLabel="Nueva Empresa"
      onPrimaryClick={handleNewClick}
      enableCollapse={false}
      primaryButtonDataTour="companies-new"
      showBackground={false}
    >
      <div className="flex min-h-[calc(100vh-180px)] w-full flex-col">
        <div className="flex w-full flex-1 flex-col gap-6">
          {loadingEnterprises ? (
            <div className={companiesStyles.emptyState}>
              Cargando empresas...
            </div>
          ) : null}

          {!loadingEnterprises && error ? (
            <div className={companiesStyles.errorState}>{error}</div>
          ) : null}

          {!loadingEnterprises && !error && enterprises.length === 0 ? (
            <div className={companiesStyles.emptyState}>
              No hay empresas registradas.
            </div>
          ) : null}

          {!loadingEnterprises && !error && enterprises.length > 0 ? (
            <div className={`${companiesStyles.listGrid} w-full`}>
              {paginatedEnterprises.map((enterprise) => (
                <article
                  key={enterprise.enterprise_id}
                  className={companiesStyles.card}
                >
                  <div className={`${companiesStyles.cardLogoWrapper} relative`}>
                    <Image
                      src={enterprise.imgurl || getEnterpriseLogo(enterprise.name)}
                      alt={
                        enterprise.imgurl
                          ? `Logo ${enterprise.name}`
                          : getEnterpriseLogoAlt(enterprise.name)
                      }
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-c2 text-gray-60">Empresa</p>
                    <p className="text-b2 text-blue-60 font-semibold">
                      {enterprise.name}
                    </p>
                  </div>
                  <Button
                    variant="solid"
                    size="small"
                    hideIcon
                    className="w-full"
                    onClick={() => handleEditClick(enterprise.enterprise_id)}
                  >
                    Ver detalles
                  </Button>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {showPagination ? (
          <div className="mt-auto flex w-full justify-center pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : null}
      </div>
    </FormsLayout>
  );
};

export default CompaniesPage;
