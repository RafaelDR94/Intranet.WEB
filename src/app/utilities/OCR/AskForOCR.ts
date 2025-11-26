import { fileToDataUrl } from "@/app/utilities/FilesHelper/FilesHelper";

export type AskForOCRResult = {
    rawResponse: unknown;
    text: string;
};

const DEFAULT_ENDPOINT = "https://apivisitax-image-mkl7dnf6va-uc.a.run.app/Google/OCR";



export const askForOCR = async (file: File): Promise<AskForOCRResult> => {
    const endpoint = process.env.NEXT_PUBLIC_VISITAX_OCR_ENDPOINT ?? DEFAULT_ENDPOINT;
    const token = process.env.NEXT_PUBLIC_VISITAX_OCR_TOKEN;

    const dataUrl = await fileToDataUrl(file);
    const [, base64Payload = dataUrl] = dataUrl.split(",");

    const imageData = {
        rawDocument: {
            content: base64Payload,
            mimeType: file.type || "image/jpeg",
        },
    };

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(imageData),
    });

    if (!response.ok) {
        throw new Error(`Error al procesar la imagen (status ${response.status})`);
    }

    const result = await response.json();
    return {
        rawResponse: result,
        text: result?.data?.document?.text ||"",
    };
};
