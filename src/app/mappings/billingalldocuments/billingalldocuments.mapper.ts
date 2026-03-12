import { mapAuthorization } from "../authorizations/authorizations.mapper"
import { BillingDocumentFullMap, BillingDocumentMap } from "../billingdocuments/billingdocuments.mapper"
import { RequisitionMap } from "../requisitions/requisitions.mapp"
import { BillingImageMap } from "../billingimages/billingimages.mapper"
import type {
  BillingAllDocumentsByEmployee,
  BillingAllDocumentsByRequisition,
} from "./billingalldocuments.types"
import { BillingDocuments } from "../billingdocuments/billingdocuments.types"
import { BillingImages } from "../billingimages/billingimages.types"

/**
 * BillingAllDocumentsByEmployeeMap
 * Mapea un registro crudo de la API a un objeto tipado BillingAllDocumentsByEmployee.
 */



export const BillingAllDocumentsByEmployeeListMap = (
  list: any,
): BillingAllDocumentsByEmployee[] => {
  console.log("list[0]", list[0]);
  const DocumentsMap:BillingDocuments[] = list[0].billingdocument_id.map(BillingDocumentMap);
  const ImagesMap:BillingImages[]  = list[0].billingimages_id.map(BillingImageMap);
  const combined: BillingAllDocumentsByEmployee[] = [];
  DocumentsMap.forEach(element => {
      combined.push({
        id: element.billingdocument_id || element.id,
        billingdocument: element,
        billingimage:null,
        dateCreated: element?.date_created,
        category: element?.category?.name?? "",
        status: element?.status?? "",
        comments: element?.user_comments?? "",
        proyect: element?.requisition?.projectname ?? "",
        xml: element?.xml,
        pdf: element?.pdf,
        image: element?.image,
        requisitonkey:element?.requisition?.requisitionkey ?? null
      });
  });
   ImagesMap.forEach(element => {
      combined.push({
        requisitonkey:null,
        id: element.billing_image_id ,
        billingdocument: null,
        billingimage:element,
        dateCreated: element?.dateCreate,
        category: element?.category?.name?? "",
        status: element?.status?? "",
        comments: element?.user_comments?? "",
        proyect: element?.requisition?.projectname ?? "",
        xml: null,
        pdf: null,
        image: element?.images[0]?.image ?? null
      });
  });
  return Array.isArray(combined) ? combined : []
}


/**
 * BillingAllDocumentsByRequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado BillingAllDocumentsByRequisition.
 */
export const BillingAllDocumentsByRequisitionMap = (
  raw: unknown,
): BillingAllDocumentsByRequisition => {
  const record = raw as Record<string, unknown> | null
  const base = BillingDocumentFullMap(record ?? {})

  return {
    ...base,
    requisition: RequisitionMap(record?.requisition ?? record?.Requisition ?? {}),
    authorization: record?.authorization
      ? mapAuthorization(record.authorization)
      : null,
  }
}

/**
 * BillingAllDocumentsByRequisitionListMap
 * Mapea una coleccion cruda de la API a un arreglo tipado.
 */
export const BillingAllDocumentsByRequisitionListMap = (
  list: unknown[],
): BillingAllDocumentsByRequisition[] =>
  Array.isArray(list) ? list.map(BillingAllDocumentsByRequisitionMap) : []
