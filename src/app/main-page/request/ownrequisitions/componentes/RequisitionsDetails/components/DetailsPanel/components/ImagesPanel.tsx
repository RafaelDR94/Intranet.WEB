import React from "react";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { Proyect } from "@/app/mappings/proyects/proyects.types";

import { ImagesPanelProps } from "../types";

const ImagesPanel: React.FC<ImagesPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
}) => {
  const isMobile = useIsMobile();
  const submitRef = React.useRef<(() => void | Promise<void>) | null>(null);
  const [isFormValid, setIsFormValid] = React.useState(false);
  const resendDisabled = !selected.status?.toLowerCase().includes("rechaz");
  const comments = selected.user_comments || selected.comments || "";
  const projectFallback: Proyect = {
    id: selected?.requisition?.idProject ?? "",
    name: selected?.requisition?.projectname ?? "",
    proyectKey: selected?.requisition?.projectname ?? "",
    client: "",
    manager: {} as any,
    collaborators: [],
  };
  const dataEdit: HistoryRow = {
    id: selected.billing_image_id,
    billing_image_id: selected.billing_image_id,
    billingdocument_id: "",
    billingrequisition_id: selected.requisition?.billingrequisition_id ?? "",
    project: projectFallback,
    requisitionkey: selected.requisition?.requisitionkey ?? "",
    status: (selected.status?.toLowerCase() as HistoryRow["status"]) ?? "pendiente",
    xml: "",
    pdf: "",
    image: selected.images?.[0]?.image ?? "",
    comments: selected.comments ?? "",
    dateCreate: selected.dateCreate ?? "",
    certificationDate: selected.dateCreate ?? "",
    uuid: "",
    description: selected.description,
    category: selected.category,
    numpersons: selected.numpersons ?? null,
    numnights: selected.numnights ?? null,
  };

  React.useEffect(() => {
    setIsFormValid(false);
  }, [selected?.billing_image_id]);

  React.useEffect(() => {
    const url = selected?.images?.[0]?.image;
    if (!url) return;
    if (typeof window === "undefined") return;
    if (typeof Image === "undefined") return;
    const img = new Image();
    img.src = url;
  }, [selected?.billing_image_id, selected?.images]);

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      closeButtonDataTour="ownrequisitions-billablefiles-panel-close"
      leftLabel={
        isMobile
          ? ""
          : `Nombre: ${selected?.requisition?.employeename ?? ""}`
      }
      rightLabel={
        isMobile
          ? ""
          : `Código de solicitud: ${selected?.requisition?.requisitionkey ?? ""}`
      }
      actionButton={
        <div className={isMobile ? "flex w-full flex-col gap-2" : "flex flex-row items-center gap-3"}>
          <Button
            size="medium"
            variant="solid"
            hideIcon
            onClick={() => submitRef.current?.()}
            disabled={resendDisabled || !isFormValid}
          >
            Reenviar
          </Button>
        </div>
      }
      renderActions={() => (
        <Label
          type={selected.status?.toLocaleLowerCase() as any}
          text={(selected?.status ?? "").toUpperCase()}
        />
      )}
    >
      <div className="space-y-4 p-4">
        <div>
          <div className="text-gray-90 text-b4 font-medium">Comentarios:</div>
          {comments ? (
            <div className="space-y-1">
              <p className="text-b4 p-0 font-medium text-gray-50">{comments}</p>
            </div>
          ) : (
            <p className="text-b4 p-0 font-medium text-gray-50">-</p>
          )}
        </div>

        <InvoicesProvider>
          <TicketForm
            dataEdit={dataEdit}
            externalSubmitRef={submitRef}
            disabled={resendDisabled}
            onValidChange={setIsFormValid}
            responsiveLayoutMatrix={{
              sm: [[10], [10]],
              md: [[10], [10]],
              lg: [[10], [10]],
            }}
          />
        </InvoicesProvider>
      </div>
    </DetailsPanelLayout>
  );
};

export default ImagesPanel;
