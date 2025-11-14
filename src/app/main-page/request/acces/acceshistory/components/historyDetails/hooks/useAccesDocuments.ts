import { CreatePDF } from "@/app/utilities/PDF/PDF";
import { buildAccessRequirementDocument } from "./utilities/AccesDocumentUtil";
// import { useDocuments } from '@/app/hooks/useDocuments/useDocuments'; // si lo tienes
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
const useAccessPdf = () => {
  // Ejemplo simple: puedes inyectar esto en tu hook useDocuments
  const generateAccessPdf = async (
    access: AccesRequirmentGet,
    setPdfUrl: (url: string) => void,
    membret: 'DR' | 'DISITREK' = 'DR',
  ) => {
    const doc = buildAccessRequirementDocument(access);
    await CreatePDF(doc, setPdfUrl, membret);
  };

  return { generateAccessPdf };
};

export default useAccessPdf;
