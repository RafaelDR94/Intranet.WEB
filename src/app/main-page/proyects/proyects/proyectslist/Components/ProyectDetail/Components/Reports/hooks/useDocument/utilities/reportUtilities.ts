import {
    chunkPicturesIntoRows,
    estimatePictureRowHeight,
    PDF_IMAGE_ROW_GAP,
    PDF_INFO_ROW_HEIGHT,
    PDF_SECTION_SPACING,
    PDF_SECTION_TITLE_HEIGHT,
    PDF_SIGNATURE_ROW_HEIGHT,
    PDF_TABLE_CELL_VERTICAL_PADDING,
    PDF_TABLE_HEADER_ROW_HEIGHT,
    PDF_TEXT_LINE_HEIGHT,
} from "@/app/utilities/PDF/layout";
import type { ImageElement, SignatureElement } from "@/app/utilities/PDF/types";

import {
    Diagnosticreturn,
    Diagnosticsolutioninterface,
    Infohelperreturninferface,
    Infointerface,
} from "../types";

const normalizeRemainingHeight = (height: number) => Math.max(0, Number(height.toFixed(2)));

const createEmptyResult = <TData>(
    remainingHeight: number,
    residualdata: TData | null,
): Infohelperreturninferface<TData> => ({
    remainingHeight: normalizeRemainingHeight(remainingHeight),
    residualdata,
    currentPageData: null,
    consumedHeight: 0,
});

const finalizeResult = <TData>(
    originalHeight: number,
    consumedHeight: number,
    currentPageData: TData | null,
    residualdata: TData | null,
): Infohelperreturninferface<TData> => ({
    remainingHeight: normalizeRemainingHeight(originalHeight - consumedHeight),
    residualdata,
    currentPageData,
    consumedHeight: Number(consumedHeight.toFixed(2)),
});

const splitLongToken = (token: string, charsPerLine: number) => {
    const chunks: string[] = [];
    for (let index = 0; index < token.length; index += charsPerLine) {
        chunks.push(token.slice(index, index + charsPerLine));
    }
    return chunks.length > 0 ? chunks : [token];
};

const wrapParagraph = (paragraph: string, charsPerLine: number) => {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) {
        return [""];
    }

    const words = trimmedParagraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return [""];
    }

    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
        if (word.length > charsPerLine) {
            if (currentLine) {
                lines.push(currentLine);
                currentLine = "";
            }
            const chunks = splitLongToken(word, charsPerLine);
            chunks.slice(0, -1).forEach((chunk) => lines.push(chunk));
            currentLine = chunks.at(-1) ?? "";
            return;
        }

        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (candidate.length <= charsPerLine) {
            currentLine = candidate;
            return;
        }

        if (currentLine) {
            lines.push(currentLine);
        }
        currentLine = word;
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [trimmedParagraph];
};

const getWrappedLines = (text: string, charsPerLine: number) => {
    const paragraphs = text.split("\n");
    return paragraphs.flatMap((paragraph) => wrapParagraph(paragraph, charsPerLine));
};

const countWrappedLines = (text: string, charsPerLine: number) =>
    getWrappedLines(text, charsPerLine).length;

const splitTextByLines = (text: string, maxLines: number, charsPerLine: number) => {
    if (maxLines <= 0) {
        return { current: null, residual: text };
    }

    const paragraphs = text.split("\n");
    let currentText = "";

    for (let index = 0; index < paragraphs.length; index++) {
        const paragraph = paragraphs[index];
        const candidateText = currentText ? `${currentText}\n${paragraph}` : paragraph;

        if (countWrappedLines(candidateText, charsPerLine) <= maxLines) {
            currentText = candidateText;
            continue;
        }

        const words = paragraph.trim().split(/\s+/).filter(Boolean);
        let paragraphChunk = "";

        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const candidateParagraph = paragraphChunk ? `${paragraphChunk} ${words[wordIndex]}` : words[wordIndex];
            const candidateChunk = currentText ? `${currentText}\n${candidateParagraph}` : candidateParagraph;

            if (countWrappedLines(candidateChunk, charsPerLine) <= maxLines) {
                paragraphChunk = candidateParagraph;
                continue;
            }

            if (!paragraphChunk) {
                paragraphChunk = words[wordIndex];
                wordIndex++;
            }

            const residualWords = words.slice(paragraphChunk === words[0] ? 1 : paragraphChunk.split(/\s+/).length);
            const residualParagraph = [residualWords.join(" "), ...paragraphs.slice(index + 1)]
                .filter((value) => value.trim().length > 0)
                .join("\n");

            currentText = currentText ? `${currentText}\n${paragraphChunk}` : paragraphChunk;
            return {
                current: currentText || null,
                residual: residualParagraph || null,
            };
        }

        if (!paragraphChunk && paragraph.trim().length === 0) {
            currentText = candidateText;
            continue;
        }

        currentText = currentText ? `${currentText}\n${paragraphChunk}` : paragraphChunk;
    }

    return {
        current: currentText || null,
        residual: null,
    };
};

const getMaxTextLines = (remainingHeight: number, reservedHeight: number) =>
    Math.floor((remainingHeight - reservedHeight) / PDF_TEXT_LINE_HEIGHT);

const estimateTableCharsPerLine = (columnCount: number) => {
    if (columnCount <= 2) return 56;
    if (columnCount === 3) return 28;
    if (columnCount === 4) return 22;
    return 18;
};

const estimateTableRowHeight = (row: any[]) => {
    const charsPerLine = estimateTableCharsPerLine(row.length || 1);
    const maxLines = row.reduce((highest, cell) => {
        const cellText = cell === null || cell === undefined ? "" : String(cell);
        return Math.max(highest, countWrappedLines(cellText, charsPerLine));
    }, 1);

    return maxLines * PDF_TEXT_LINE_HEIGHT + PDF_TABLE_CELL_VERTICAL_PADDING;
};

export const InfoHelper = ({ remainingHeight, Infodata }: Infointerface<any[]>): Infohelperreturninferface<any[]> => {
    const reservedHeight = PDF_SECTION_TITLE_HEIGHT + PDF_SECTION_SPACING;
    const availableRows = Math.floor((remainingHeight - reservedHeight) / PDF_INFO_ROW_HEIGHT);

    if (availableRows <= 0) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const maxItems = Math.max(2, availableRows * 2);
    const currentPageData = Infodata.slice(0, maxItems);
    const residualdata = Infodata.slice(maxItems);
    const rowsUsed = Math.ceil(currentPageData.length / 2);
    const consumedHeight = reservedHeight + rowsUsed * PDF_INFO_ROW_HEIGHT;

    return finalizeResult(
        remainingHeight,
        consumedHeight,
        currentPageData,
        residualdata.length > 0 ? residualdata : null,
    );
};

export const TableHelper = ({ remainingHeight, Infodata }: Infointerface<any[]>): Infohelperreturninferface<any[]> => {
    const baseHeight = PDF_SECTION_TITLE_HEIGHT + PDF_TABLE_HEADER_ROW_HEIGHT + PDF_SECTION_SPACING;
    let consumedHeight = baseHeight;
    let rowsThatFit = 0;

    for (let index = 0; index < Infodata.length; index++) {
        const rowSource = Infodata[index];
        const row = Array.isArray(rowSource) ? rowSource : Object.values(rowSource ?? {});
        const rowHeight = estimateTableRowHeight(row);

        if (consumedHeight + rowHeight > remainingHeight) {
            break;
        }

        consumedHeight += rowHeight;
        rowsThatFit++;
    }

    if (rowsThatFit === 0) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const currentPageData = Infodata.slice(0, rowsThatFit);
    const residualdata = Infodata.slice(rowsThatFit);

    return finalizeResult(
        remainingHeight,
        consumedHeight,
        currentPageData,
        residualdata.length > 0 ? residualdata : null,
    );
};

export const ActivitiesHelper = ({ remainingHeight, Infodata }: Infointerface<ImageElement[]>): Infohelperreturninferface<ImageElement[]> => {
    const baseHeight = PDF_SECTION_TITLE_HEIGHT + PDF_SECTION_SPACING;
    const pictureRows = chunkPicturesIntoRows(Infodata);
    const fittedRows: ImageElement[][] = [];
    let consumedHeight = baseHeight;

    for (const row of pictureRows) {
        const rowHeight = estimatePictureRowHeight(row) + PDF_IMAGE_ROW_GAP;
        if (consumedHeight + rowHeight > remainingHeight) {
            break;
        }

        fittedRows.push(row);
        consumedHeight += rowHeight;
    }

    if (fittedRows.length === 0) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const fittedPictures = fittedRows.flat();
    const residualPictures = Infodata.slice(fittedPictures.length);

    return finalizeResult(
        remainingHeight,
        consumedHeight,
        fittedPictures,
        residualPictures.length > 0 ? residualPictures : null,
    );
};

export const DiagnosticSolutionHelper = ({ remainingHeight, diagnostic, solution }: Diagnosticsolutioninterface): Diagnosticreturn => {
    const reservedHeight = PDF_SECTION_TITLE_HEIGHT + PDF_TABLE_HEADER_ROW_HEIGHT + PDF_SECTION_SPACING + 8;
    const maxLines = getMaxTextLines(remainingHeight, reservedHeight);

    if (maxLines <= 0) {
        return {
            remainingHeight: normalizeRemainingHeight(remainingHeight),
            residualsolution: solution,
            residualdiagnostic: diagnostic,
            currentsolution: null,
            currentdiagnostic: null,
            consumedHeight: 0,
        };
    }

    const diagnosticChunk = splitTextByLines(diagnostic, maxLines, 57);
    const solutionChunk = splitTextByLines(solution, maxLines, 57);

    if (!diagnosticChunk.current && !solutionChunk.current) {
        return {
            remainingHeight: normalizeRemainingHeight(remainingHeight),
            residualsolution: solution,
            residualdiagnostic: diagnostic,
            currentsolution: null,
            currentdiagnostic: null,
            consumedHeight: 0,
        };
    }

    const lineCount = Math.max(
        diagnosticChunk.current ? countWrappedLines(diagnosticChunk.current, 57) : 0,
        solutionChunk.current ? countWrappedLines(solutionChunk.current, 57) : 0,
        1,
    );
    const consumedHeight = reservedHeight + lineCount * PDF_TEXT_LINE_HEIGHT;

    return {
        remainingHeight: normalizeRemainingHeight(remainingHeight - consumedHeight),
        residualsolution: solutionChunk.residual,
        residualdiagnostic: diagnosticChunk.residual,
        currentsolution: solutionChunk.current,
        currentdiagnostic: diagnosticChunk.current,
        consumedHeight: Number(consumedHeight.toFixed(2)),
    };
};

export const SingleTextHelper = ({ remainingHeight, Infodata }: Infointerface<string>): Infohelperreturninferface<string> => {
    const reservedHeight = PDF_SECTION_TITLE_HEIGHT + PDF_SECTION_SPACING + 8;
    const maxLines = getMaxTextLines(remainingHeight, reservedHeight);

    if (maxLines <= 0) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const currentChunk = splitTextByLines(Infodata, maxLines, 103);

    if (!currentChunk.current) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const consumedHeight =
        reservedHeight + Math.max(1, countWrappedLines(currentChunk.current, 103)) * PDF_TEXT_LINE_HEIGHT;

    return finalizeResult(
        remainingHeight,
        consumedHeight,
        currentChunk.current,
        currentChunk.residual,
    );
};

export const SignatureHelper = ({ remainingHeight, Infodata }: Infointerface<SignatureElement[]>): Infohelperreturninferface<SignatureElement[]> => {
    const signaturesPerRow = Infodata.length <= 2 ? 2 : 4;
    const baseHeight = PDF_SECTION_TITLE_HEIGHT + PDF_SECTION_SPACING;
    const maxRows = Math.floor((remainingHeight - baseHeight) / PDF_SIGNATURE_ROW_HEIGHT);

    if (maxRows <= 0) {
        return createEmptyResult(remainingHeight, Infodata);
    }

    const maxSignatures = Math.max(1, maxRows * signaturesPerRow);
    const currentPageData = Infodata.slice(0, maxSignatures);
    const residualdata = Infodata.slice(maxSignatures);
    const rowsUsed = Math.ceil(currentPageData.length / signaturesPerRow);
    const consumedHeight = baseHeight + rowsUsed * PDF_SIGNATURE_ROW_HEIGHT;

    return finalizeResult(
        remainingHeight,
        consumedHeight,
        currentPageData,
        residualdata.length > 0 ? residualdata : null,
    );
};
