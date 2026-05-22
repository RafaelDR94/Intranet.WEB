import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../testUtils/reportFixtures";

import useDocument from "./useDocument";

import type { ReportView } from "@/app/mappings/reports/reports.types";

let currentReportRef: ReportView | null = null;

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
    useReportsStore: () => ({
        currentReport: currentReportRef,
    }),
}));

vi.mock("@/app/utilities/PicturesHelper/PictureHelper", () => ({
    urlToBase64: vi.fn(async () => ""),
}));

vi.mock("@/app/utilities/PicturesHelper/recoverRemoteImage", () => ({
    resolveImageWithFallback: vi.fn(),
}));

const buildActivity = (index: number) => ({
    title: `Actividad ${index}`,
    date: "2024-05-01",
    description: "Descripcion breve",
    urlimage: "",
});

const collectPictureTitles = (pages: { elements: any[] }[]) =>
    pages.flatMap((page) =>
        page.elements.flatMap((element) =>
            "pictures" in element ? element.pictures.map((picture: { title: string }) => picture.title) : []
        )
    );

describe("useDocument.makePictureDocument", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        currentReportRef = null;
    });

    it("mueve las evidencias a la siguiente pagina cuando el diagnostico ocupa la primera", async () => {
        const longParagraph = Array.from({ length: 70 }, (_, index) =>
            `Linea ${index} ${"texto ".repeat(18)}`
        ).join("\n");

        currentReportRef = createSampleReport({
            diagnostic: longParagraph,
            solution: longParagraph,
            remarks: "",
            activities: [buildActivity(1), buildActivity(2)],
            maps: [],
            employeesignurl: "",
            clientsign: { url: "" },
        });

        const { result } = renderHook(() => useDocument());
        const pdf = await result.current.makePictureDocument();

        expect(pdf?.pages.length).toBeGreaterThan(1);
        expect(pdf?.pages[0].elements.some((element) => "pictures" in element)).toBe(false);
        expect(pdf?.pages.slice(1).some((page) => page.elements.some((element) => "pictures" in element))).toBe(true);
        expect(collectPictureTitles(pdf?.pages ?? [])).toEqual(["Actividad 1", "Actividad 2"]);
    });

    it("sigue paginando actividades aunque no existan mapas", async () => {
        currentReportRef = createSampleReport({
            model: {
                maps: false,
                diagnostic: false,
                solution: false,
                refactions: false,
                clientsign: false,
                ticket: true,
            },
            diagnostic: "",
            solution: "",
            remarks: "",
            activities: [
                buildActivity(1),
                buildActivity(2),
                buildActivity(3),
                buildActivity(4),
                buildActivity(5),
            ],
            maps: [],
            refactions: [],
            reportDeviceView: [],
            employeesignurl: "",
            clientsign: { url: "" },
        });

        const { result } = renderHook(() => useDocument());
        const pdf = await result.current.makePictureDocument();

        expect(pdf?.pages.length).toBeGreaterThan(1);
        expect(collectPictureTitles(pdf?.pages ?? [])).toEqual([
            "Actividad 1",
            "Actividad 2",
            "Actividad 3",
            "Actividad 4",
            "Actividad 5",
        ]);
    });
});
