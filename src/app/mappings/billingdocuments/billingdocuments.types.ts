import { Requisition } from "../requisitions/requisitions.types"
export type Concepto = {
  "clave_sat": string,
  "clavesat_description": string
}

export type BillingDocumentCategory = {
  id_billingcategory: string,
  name: string,
}
export type BillingDocumentDescription = {
  id_billingdescription: string,
  name: string
}

export type BillingAcuse = {
  "id": string,
  "statusCode": string,
  "isCancellable": string,
  "status": string,
  "cancelationStatus": string,
  "validationEFOS": string,
  "dateCreated": string,
  "billingDocuments": null
}
export type BillingDocuments = {
  "id": string,
  "billingdocument_id": string,
  "requisition": Requisition,
  "billingimages_id": string,
  "xml": string,
  "pdf": string,
  "image": string
  "status": string,
  "comments": string
  "rfc_emisor": string,
  "rfc_receptor": string,
  "conceptos": Concepto[],
  "uuid": string,
  "fecha": string,
  "xmlinformation": string,
  "date_created": string,
  "user_comments": string,
  "forbidden_code": boolean,
  "sat_validation": boolean,
  "billingAcuse": BillingAcuse | null
  "description": BillingDocumentDescription,
  "numpersons": number,
  "numnights": number,
  "total": number,
  "subtotal": number,
  "iva": number,
  "otherinvoices": number,
  "category": BillingDocumentCategory,
  "validatedbyoperations":boolean


}
export type BillingDocumentDetailsTable = {
  "id": string;                    // id del documento
  "billingdocument_id": string,
  "fecha": string;          // FECHA CONSUMO (raw?.fecha)
  "rfc_emisor": string;             // PROVEEDOR (RFC emisor)
  "description": string;           // DESCRIPCIÓN (description o concepto)
  "numpersons": number | null;     // No. PERS.
  "numnights": number | null;      // No. NOCHES
  "uuid": string;                 // No. FACTURA/TICKET/REMISIÓN (uuid)
  "subtotal": number;              // SUBTOTAL
  "iva": number;                   // IVA (solo IVA, no otros impuestos)
  "total": number;                 // TOTAL
  "otherinvoices": number;          // Otros Impuestos
  "status": string;                // "Valido" / "Rechazado" / etc.
  "xmlUrl"?: string;
  "pdfUrl"?: string;
  "imageUrl"?: string;
};

export type BillingDocumentsSatTable = {
  "id": string,
  "billingdocument_id": string,
  "requisition": Requisition,
  "billingimages_id": string,
  "xml": string,
  "pdf": string,
  "image": string,
  "status": string,
  "comments": string
  "rfc_emisor": string,
  "rfc_receptor": string,
  "conceptos": Concepto[],
  "uuid": string,
  "fecha": string,
  "xmlinformation": string,
  "date_created": string,
  "sat_status": string,
  "sat_efos": string,
  "forbidden_code": boolean,
  "user_comments": string,
  "sat_codigoEstatus": string,
  "sat_esCancelable": string,
  "sat_estatusCancelacion": string
  "sat_validation": boolean,
  "total": number,
  "subtotal": number,
  "iva": number,
  "otherinvoices": number;
  "category": BillingDocumentCategory
  "description": BillingDocumentDescription,
  "numpersons": number | null;     // No. PERS.
  "numnights": number | null;      // No. NOCHES
  "billingAcuse": BillingAcuse | null
  "validatedbyoperations":boolean
}


export type BillingDocumentsPost = {
  "requisition_id": string,
  "billingimages_id": string | null,
  "xml": string,
  "pdf": string,
  "description_id": string,
  "numpersons": number,
  "numnights": number,
  "category_id": string,

}
export type BillingDocumentsPut = {
  "billingdocument_id": string,
  "requisition_id": string,
  "billingimages_id": string | null,
  "xml": string,
  "pdf": string,
  "comments": string
  "description_id": string,
  "category_id": string,
  "numpersons": number,
  "numnights": number,
  "user_comments": string
}
export type BillingDocumentReject = {
  "id": string,
  "comment": string
  /** true: rechazado false: restringido  */
  "type": boolean
}