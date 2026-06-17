"use client";

import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import Pagination from "@/app/components/Pagination/Pagination";
import { Card } from "@/app/components/Card/Card";
import { Input } from "@/app/components/Input/Input";
import { Select } from "@/app/components/Select/Select";

import PlusIcon from "@/assets/icons/acciones/plus.svg";
import SearchIcon from "@/assets/icons/organization/search.svg";

import { departmentsStyles } from "./styles";
import useDepartmentsPage from "./hooks/useDepartmentsPage";

const DepartmentsPage = () => {
  const {
    isCreateView,
    isEditView,
    title,
    primaryLabel,
    isReady,
    creating,
    departments,
    filteredDepartments,
    paginatedDepartments,
    currentPage,
    totalPages,
    showPagination,
    searchValue,
    setCurrentPage,
    setSearchValue,
    loading,
    error,
    resolveImageSrc,
    enterpriseOptions,
    formState,
    handleFieldChange,
    handlePositionChange,
    handleAddPosition,
    handleNewClick,
    handleViewDepartment,
    handleSubmit,
  } = useDepartmentsPage();

  if (isCreateView || isEditView) {
    return (
      <FormsLayout
        title={title}
        primaryLabel={primaryLabel}
        primaryDisabled={!isReady || creating}
        enableCollapse={false}
        onPrimaryClick={handleSubmit}
      >
        <div className={departmentsStyles.formCard}>
          <div className={departmentsStyles.formGrid}>
            <Input
              label="Nombre del departamento"
              placeholder="Nombre"
              value={formState.name}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
            />

            <Select
              label="Empresa con actividad del departamento"
              placeholder="Selecciona una empresa"
              options={enterpriseOptions}
              selected={formState.enterpriseId ? [formState.enterpriseId] : []}
              onChange={(values) =>
                handleFieldChange("enterpriseId", values[0] ?? "")
              }
            />

            <div className={departmentsStyles.descriptionField}>
              <Input
                label="Breve descripción del departamento"
                placeholder="Agregar descripción"
                as="textarea"
                rows={3}
                value={formState.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
              />
            </div>
          </div>

          <div className={departmentsStyles.positionsSection}>
            <div className={departmentsStyles.positionsHeader}>
              <p className="text-b2 text-gray-80 font-semibold">
                Creación de puestos dentro del departamento
              </p>
              <button
                type="button"
                className={departmentsStyles.addPositionButton}
                onClick={handleAddPosition}
              >
                <PlusIcon className={departmentsStyles.addPositionIcon} />
                Agregar puesto dentro del departamento
              </button>
            </div>

            <div className={departmentsStyles.positionsGrid}>
              {formState.positions.map((position) => (
                <Input
                  key={position.id}
                  label="Nombre del puesto"
                  placeholder="Nombre"
                  value={position.name}
                  onChange={(event) =>
                    handlePositionChange(position.id, event.target.value)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </FormsLayout>
    );
  }

  return (
    <FormsLayout
      title="Departamentos dentro de la empresa"
      primaryLabel="Nuevo departamento"
      onPrimaryClick={handleNewClick}
      enableCollapse={false}
      showBackground={false}
    >
      <div className="flex min-h-[calc(100vh-180px)] w-full flex-col">
        <div className="flex w-full flex-1 flex-col gap-6">
          <div className={departmentsStyles.searchRow}>
            <div className={departmentsStyles.searchWrapper}>
              <div className={departmentsStyles.searchInputWrapper}>
                <Input
                  placeholder="Buscar departamento"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  icon={SearchIcon}
                  className={departmentsStyles.searchInput}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className={departmentsStyles.emptyState}>
              Cargando departamentos...
            </div>
          ) : null}

          {!loading && error ? (
            <div className={departmentsStyles.errorState}>{error}</div>
          ) : null}

          {!loading && !error && departments.length === 0 ? (
            <div className={departmentsStyles.emptyState}>
              No hay departamentos registrados.
            </div>
          ) : null}

          {!loading &&
          !error &&
          departments.length > 0 &&
          filteredDepartments.length === 0 ? (
            <div className={departmentsStyles.emptyState}>
              No se encontraron departamentos con esa b&uacute;squeda.
            </div>
          ) : null}

          {!loading && !error && filteredDepartments.length > 0 ? (
            <div className={departmentsStyles.listGrid}>
              {paginatedDepartments.map((department) => (
                <Card
                  key={department.department_id}
                  orientation="vertical"
                  imageSrc={resolveImageSrc(department)}
                  label="Departamento"
                  title={department.name || "Sin nombre"}
                  description={
                    department.enterprice_name
                      ? `Empresa: ${department.enterprice_name}`
                      : ""
                  }
                  primaryLabel="Ver Departamento"
                  onAccept={() => handleViewDepartment(department)}
                />
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

export default DepartmentsPage;
