import { describe, expect, it } from "vitest";

import { getUsablePageHeight } from "@/app/utilities/PDF/layout";

import { ActivitiesHelper } from "./reportUtilities";

const buildPicture = (index: number, overrides: Record<string, unknown> = {}) => ({
    title: `Actividad ${index}`,
    description: "Descripcion breve de evidencia",
    urlimage: "",
    ...overrides,
});

describe("ActivitiesHelper", () => {
    it("mantiene una fila completa cuando cabe en la pagina", () => {
        const result = ActivitiesHelper({
            remainingHeight: 320,
            Infodata: [buildPicture(1), buildPicture(2)],
        });

        expect(result.currentPageData).toHaveLength(2);
        expect(result.residualdata).toBeNull();
        expect(result.remainingHeight).toBeGreaterThan(0);
    });

    it("mueve la siguiente fila completa cuando ya no cabe", () => {
        const result = ActivitiesHelper({
            remainingHeight: 320,
            Infodata: [buildPicture(1), buildPicture(2), buildPicture(3)],
        });

        expect(result.currentPageData?.map((picture) => picture.title)).toEqual([
            "Actividad 1",
            "Actividad 2",
        ]);
        expect(result.residualdata?.map((picture) => picture.title)).toEqual([
            "Actividad 3",
        ]);
    });

    it("maneja cantidades impares sin partir la ultima tarjeta", () => {
        const result = ActivitiesHelper({
            remainingHeight: getUsablePageHeight(false),
            Infodata: [buildPicture(1), buildPicture(2), buildPicture(3)],
        });

        expect(result.currentPageData).toHaveLength(3);
        expect(result.residualdata).toBeNull();
    });

    it("respeta el alto mayor de mapas y los pagina por filas de un elemento", () => {
        const result = ActivitiesHelper({
            remainingHeight: 340,
            Infodata: [
                buildPicture(1, { width: 500, height: 220 }),
                buildPicture(2, { width: 500, height: 220 }),
            ],
        });

        expect(result.currentPageData?.map((picture) => picture.title)).toEqual([
            "Actividad 1",
        ]);
        expect(result.residualdata?.map((picture) => picture.title)).toEqual([
            "Actividad 2",
        ]);
    });
});
