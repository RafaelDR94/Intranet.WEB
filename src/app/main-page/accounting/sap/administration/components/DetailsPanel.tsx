import React from "react";

import SharedDetailsPanel from "../../../invoices/validateinvoices/components/DetailsPanel/DetailsPanel";
import type { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import { useSAPDetailsPanel } from "../../common/hooks/useSAPDetailsPanel";



const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  onlyText = false,
  validInvoice = true,
  rejectInvoice = true,
  sendInvoiceToSap = false,
  operations = false,
  rejectType = true,
  reqisition,
  closeButtonDataTour,
  documentLabel = "Factura",
  onJsonSapUpdated,
}) => {
  const { currentPagePermissions, handleSendToSap } = useSAPDetailsPanel({
    selected,
  });

  return (
    <SharedDetailsPanel
      panelOpen={panelOpen}
      setPanelOpen={setPanelOpen}
      selected={selected}
      onlyText={onlyText}
      validInvoice={validInvoice}
      rejectInvoice={rejectInvoice}
      sendInvoiceToSap={sendInvoiceToSap}
      operations={operations}
      rejectType={rejectType}
      reqisition={reqisition}
      onSendToSap={handleSendToSap}
      allowSendToSapAction={!currentPagePermissions?.canSendToSap}
      closeButtonDataTour={closeButtonDataTour}
      documentLabel={documentLabel}
      onJsonSapUpdated={onJsonSapUpdated}
    />
  );
};

export default DetailsPanel;
