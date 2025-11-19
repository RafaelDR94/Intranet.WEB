import { CreatePDF } from "@/app/utilities/PDF/PDF";
import { buildAccessRequirementDocument } from "./utilities/AccesDocumentUtil";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import {
  buildManifestDocumentFromAccess,
  ManifestConfig,
} from "./utilities/manifestDocumentUtilitie";
import {
  DetentarLetterConfig,
  buildDetentarDocumentFromAccess,
} from "./utilities/detentarDocumentUrtil";
import {
  exportExcelPro,
  type SheetInput,
  type ColumnDef,
} from "@/app/utilities/Excel/ExportExcel";

const useAccessPdf = () => {
  const generateAccessPdf = async (
    access: AccesRequirmentGet,
    setPdfUrl: (url: string) => void,
    membret: "DR" | "DISITREK" = "DR",
  ) => {
    const doc = buildAccessRequirementDocument(access);
    await CreatePDF(doc, setPdfUrl, membret);
  };

  const generateManifestPdf = async (
    access: AccesRequirmentGet,
    cfg: ManifestConfig,
    onReadyUrl: (url: string) => void,
    membret: "DR" | "DISITREK" = "DR",
  ) => {
    const doc = buildManifestDocumentFromAccess(access, cfg);
    await CreatePDF(doc, onReadyUrl, membret);
  };

  const generateDetentarLetterPdf = async (
    access: AccesRequirmentGet,
    cfg: DetentarLetterConfig,
    onReadyUrl: (url: string) => void,
    membret: "DR" | "DISITREK" = "DR",
  ) => {
    const doc = buildDetentarDocumentFromAccess(access, cfg);
    await CreatePDF(doc, onReadyUrl, membret);
  };

  /**
   * Genera un Excel con el listado de herramientas (tools) del acceso.
   * Devuelve un Blob listo para agregarse a un ZIP o descargarse.
   */
  const generateToolsExcel = async (
    access: AccesRequirmentGet,
  ): Promise<Blob | null> => {
    if (!access.tools || access.tools.length === 0) return null;

    const columns: ColumnDef[] = [
      { key: "quantity", header: "Cantidad", type: "string", align: "right" },
      { key: "description", header: "Descripción", type: "string", width: 40 },
      { key: "brand", header: "Marca", type: "string" },
      { key: "model", header: "Modelo", type: "string" },
      { key: "materialtype", header: "Tipo de material", type: "string" },
      { key: "meditiontype", header: "Unidad de medida", type: "string" },
    ];

    const rows: Record<string, unknown>[] = access.tools.map((t) => ({
      quantity: t.quantity,
      description: t.description,
      brand: t.brand,
      model: t.model,
      materialtype: t.materialtype,
      meditiontype: t.meditiontype,
    }));

    const sheets: SheetInput[] = [
      {
        name: "Herramientas",
        columns,
        rows,
      },
    ];

    const { buffer } = await exportExcelPro({
      fileName: `acceso_${access.id}_herramientas`,
      sheets,
      // meta: {
      //   title: "Herramientas de acceso",
      //   cliente: access.external_enterprise?.name,
      //   proyecto: access.location?.name,
      //   semana:
      //     access.start_date && access.end_date
      //       ? `${access.start_date} - ${access.end_date}`
      //       : undefined,
      // },
      zebra: true,
      autoFilter: true,
    });

    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  return {
    generateAccessPdf,
    generateManifestPdf,
    generateDetentarLetterPdf,
    generateToolsExcel,
  };
};

export default useAccessPdf;
