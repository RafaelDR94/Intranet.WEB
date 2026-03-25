import React from "react";

import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { BillingImages } from "@/app/mappings/billingimages/billingimages.types";

import DocumentsPanel from "./components/DocumentsPanel";
import ImagesPanel from "./components/ImagesPanel";
import { DetailsPanelProps, DetailsPanelSelected } from "./types";

const isBillingImage = (selected: DetailsPanelSelected): selected is BillingImages =>
  Boolean(selected && "billing_image_id" in selected && !("billingdocument_id" in selected));

const isBillingDocument = (
  selected: DetailsPanelSelected,
): selected is BillingDocuments | BillingDocumentsSatTable =>
  Boolean(selected && "billingdocument_id" in selected);

const DetailsPanel: React.FC<DetailsPanelProps> = (props) => {
  const { selected } = props;

  if (isBillingImage(selected)) {
    return <ImagesPanel {...props} selected={selected} />;
  }

  if (isBillingDocument(selected)) {
    return <DocumentsPanel {...props} selected={selected} />;
  }

  return <DocumentsPanel {...props} selected={null} />;
};

export default DetailsPanel;
