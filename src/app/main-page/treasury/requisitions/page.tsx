"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import type { SelectedImage } from "@/app/components/ImageUploaderExpanded/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import {
  getFirstProgressItemValues,
  mapCalculationConceptsJsonToViaticsRows,
  toDateInputValue,
} from "@/app/main-page/accounting/requisitions/requisitionRequest/utilities/requisitionRequestHelpers";
import { RequisitionEvidence } from "@/app/sharedComponents/RequisitionEvidence/RequisitionEvidence";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";
import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";

import { TreasuryRequisitionRequestsTable } from "./components/TreasuryRequisitionRequestsTable";
import { useTreasuryRequisitionRequests } from "./hooks/useTreasuryRequisitionRequests";
import { isEvidenceEditable } from "./utilities";

const normalizeStatus = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const isHttpsUrl = (url: string) =>
  /^https:\/\//i.test(url) && url.length <= 4096;
const toEvidenceImages = (imageUrls: string[]): SelectedImage[] =>
  imageUrls.filter(Boolean).map((url, index) => ({
    id: `evidence-${index}-${url}`,
    name: `Evidencia ${index + 1}`,
    url,
    selected: false,
  }));

const TreasuryRequisitionsPage = () => {
  const { error, fetchRequests, loading, rows } =
    useTreasuryRequisitionRequests();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const { firebasestorage } = useFirebase();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const current = useTravelExpensesStore(
    (state) => state.currentRequisitionRequest,
  );
  const loadingDetail = useTravelExpensesStore(
    (state) => state.loadingRequisitionRequestDetail,
  );
  const fetchById = useTravelExpensesStore(
    (state) => state.fetchRequisitionRequestById,
  );
  const updateImages = useTravelExpensesStore(
    (state) => state.updateRequisitionRequestImages,
  );
  const savingImages = useTravelExpensesStore(
    (state) => state.updatingRequisitionRequestImages,
  );
  const [editing, setEditing] = useState(true);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isSendingEvidence, setIsSendingEvidence] = useState(false);

  useEffect(() => {
    if (detailId) void fetchById(detailId);
  }, [detailId, fetchById]);
  useEffect(() => {
    if (!current) return;
    setEditing(isEvidenceEditable(current.treasury_status_name));
  }, [current]);
  useEffect(() => {
    const currentUrls =
      current?.requisition_requests[0]?.image_urls ?? current?.image_urls ?? [];
    setImages(toEvidenceImages(currentUrls));
  }, [current]);

  const fields = useMemo<FieldModel[]>(() => {
    if (!current) return [];
    const progress = getFirstProgressItemValues(current);
    return [
      {
        type: "input",
        name: "company",
        label: "Empresa",
        value: current.company,
        disabled: true,
      },
      {
        type: "input",
        name: "project",
        label: "Código de proyecto",
        value: current.proyectkey || current.projectname,
        disabled: true,
      },
      {
        type: "input",
        name: "state",
        label: "Estado",
        value: current.state,
        disabled: true,
      },
      {
        type: "input",
        name: "motive",
        label: "Motivo",
        value: progress.motive || current.motive,
        disabled: true,
      },
      {
        type: "date",
        name: "start",
        label: "Fecha inicio",
        value: toDateInputValue(progress.startDate || current.assignmentdate),
        disabled: true,
      },
      {
        type: "date",
        name: "end",
        label: "Fecha termino",
        value: toDateInputValue(progress.endDate || current.enddate),
        disabled: true,
      },
      {
        type: "input",
        name: "employee",
        label: "Personal asignado",
        value: current.employeename,
        disabled: true,
      },
    ];
  }, [current]);
  const companionNames = useMemo(
    () =>
      current?.companions
        .map((companion) => companion.employee_name.trim())
        .filter(Boolean) ?? [],
    [current],
  );

  const saveEvidence = async (selected: SelectedImage[]) => {
    if (!isEvidenceEditable(current?.treasury_status_name)) return;
    const requestId = current?.requisition_requests[0]?.id || detailId;
    if (!requestId) return;
    if (selected.length > 50) {
      showAlert({
        type: "error",
        title: "Máximo de imágenes excedido",
        description: "Puedes enviar hasta 50 imágenes.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }
    setIsSendingEvidence(true);
    showSpinner({ message: "Subiendo evidencia..." });
    try {
      const urls = await Promise.all(
        selected.map(async (image, index) => {
          if (image.url?.startsWith("https://")) return image.url;
          if (!image.file || !firebasestorage)
            throw new Error("No se pudo preparar la evidencia.");
          const extension = image.file.name.includes(".")
            ? image.file.name.slice(image.file.name.lastIndexOf("."))
            : ".jpg";
          return firebasestorage.uploadImage(
            image.file,
            `Billings/RequisitionRequests/${requestId}/evidence-${index}${extension}`,
          );
        }),
      );
      if (urls.some((url) => !isHttpsUrl(url)))
        throw new Error("Las URLs de evidencia no son válidas.");
      const success = await updateImages({
        idRequisitionRequest: requestId,
        imageUrls: urls,
      });
      if (success) {
        await fetchRequests();
        showAlert({
          type: "success",
          title: "Evidencia enviada",
          description: "Las imágenes fueron actualizadas correctamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1800,
        });
        router.push(pathname);
      } else {
        showAlert({
          type: "error",
          title: "No se pudo enviar la evidencia",
          description:
            useTravelExpensesStore.getState().error || "Intenta nuevamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2500,
        });
      }
    } catch (error) {
      showAlert({
        type: "error",
        title: "No se pudo enviar la evidencia",
        description: String(error),
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
    } finally {
      hideSpinner();
      setIsSendingEvidence(false);
    }
  };

  if (detailId) {
    const currentUrls =
      current?.requisition_requests[0]?.image_urls ?? current?.image_urls ?? [];
    const status = current?.treasury_status_name || "Pendiente";
    const rejected = normalizeStatus(status).includes("rechaz");
    const approved = !isEvidenceEditable(status);
    const evidenceEditable = editing && isEvidenceEditable(status);
    return (
      <FormsLayout
        title={`Presupuesto de requisición ${current?.requisitionkey ?? ""}`}
        primaryLabel={
          isSendingEvidence || savingImages ? "Enviando..." : "Enviar evidencia"
        }
        primaryDisabled={isSendingEvidence || savingImages}
        showPrimaryButton={Boolean(current && evidenceEditable)}
        onPrimaryClick={() => void saveEvidence(images)}
        enableCollapse={false}
        showBackground={false}
        cardClassName="!block !p-0"
      >
        {current ? (
          <div className="flex flex-col gap-4">
            {evidenceEditable ? (
              <RequisitionEvidence
                imageUrls={currentUrls}
                mode="edit"
                status={status}
                comment={current.comments}
                onImagesChange={setImages}
              />
            ) : (
              <div>
                <RequisitionEvidence
                  imageUrls={currentUrls}
                  status={status}
                  comment={current.comments}
                />
                {rejected && !approved ? (
                  <button
                    className="text-blue-60 text-c1 mt-3"
                    onClick={() => setEditing(true)}
                    type="button"
                  >
                    Editar evidencia
                  </button>
                ) : null}
              </div>
            )}
            <section className="bg-white-100 rounded-lg p-6 shadow-sm">
              <DynamicForm
                fields={fields}
                onSubmit={() => undefined}
                showSubmitIf={() => false}
                responsiveLayoutMatrix={{
                  sm: [[10], [10], [10], [10], [10], [10], [10]],
                  md: [
                    [2.5, 2.5, 2.5, 2.5],
                    [3.33, 3.33, 3.34],
                  ],
                  lg: [
                    [2.5, 2.5, 2.5, 2.5],
                    [3.33, 3.33, 3.34],
                  ],
                }}
              />
              {companionNames.length > 0 ? (
                <p className="text-c1 text-blue-60 mb-4">
                  Colaboradores: {companionNames.join(", ")}
                </p>
              ) : null}
              <EditableViaticsTable
                value={mapCalculationConceptsJsonToViaticsRows(current)}
                onChange={() => undefined}
                readOnly
                allowAddConcept={false}
              />
            </section>
          </div>
        ) : (
          <p className="p-4">
            {loadingDetail
              ? "Cargando solicitud..."
              : "No se encontró la solicitud."}
          </p>
        )}
      </FormsLayout>
    );
  }
  return (
    <FormsLayout
      title="Estatus Aprobación de requisiciones"
      primaryLabel=""
      showPrimaryButton={false}
      onPrimaryClick={() => undefined}
      showBackground={false}
      cardClassName="!block !p-0"
    >
      {error ? <p className="text-alert-red-100 text-b3 p-4">{error}</p> : null}
      {loading && rows.length === 0 ? (
        <p className="text-gray-80 text-b3 p-4">Cargando solicitudes...</p>
      ) : (
        <TreasuryRequisitionRequestsTable
          rows={rows}
          onRefresh={() => void fetchRequests()}
          onViewDetails={(row) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("id", row.requisition_requests[0]?.id || row.id);
            router.push(`${pathname}?${params}`);
          }}
        />
      )}
    </FormsLayout>
  );
};
export default TreasuryRequisitionsPage;
