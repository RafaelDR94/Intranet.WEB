import type { ImageElement } from "./types";

export const PDF_PAGE_WIDTH = 612;
export const PDF_PAGE_HEIGHT = 792;

export const PDF_CONTENT_PADDING_TOP = 20;
export const PDF_CONTENT_PADDING_RIGHT = 30;
export const PDF_CONTENT_PADDING_BOTTOM = 30;
export const PDF_CONTENT_PADDING_LEFT = 30;

export const PDF_FIRST_PAGE_HEADER_HEIGHT = 178;
export const PDF_NEXT_PAGE_HEADER_HEIGHT = 118;
export const PDF_SAFE_BOTTOM_SPACE = 56;

export const PDF_SECTION_TITLE_HEIGHT = 26;
export const PDF_SECTION_SPACING = 10;
export const PDF_TEXT_LINE_HEIGHT = 10;

export const PDF_INFO_ROW_HEIGHT = 28;

export const PDF_TABLE_HEADER_ROW_HEIGHT = 22;
export const PDF_TABLE_CELL_VERTICAL_PADDING = 10;

export const PDF_IMAGE_CARD_WIDTH = 240;
export const PDF_IMAGE_CARD_HEIGHT = 130;
export const PDF_IMAGE_CARD_MARGIN_X = 20;
export const PDF_IMAGE_CARD_BORDER_ALLOWANCE = 8;
export const PDF_IMAGE_TITLE_HEIGHT = 18;
export const PDF_IMAGE_TITLE_MARGIN_BOTTOM = 5;
export const PDF_IMAGE_DESCRIPTION_MIN_HEIGHT = 30;
export const PDF_IMAGE_DESCRIPTION_MAX_HEIGHT = 50;
export const PDF_IMAGE_DESCRIPTION_LINE_HEIGHT = 9;
export const PDF_IMAGE_DESCRIPTION_PADDING = 4;
export const PDF_IMAGE_ROW_GAP = 18;
export const PDF_MAX_IMAGES_PER_ROW = 2;

export const PDF_SIGNATURE_ROW_HEIGHT = 112;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const toNumericSize = (value: string | number | undefined, fallback: number) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return fallback;
};

export const getPdfContentWidth = () =>
    PDF_PAGE_WIDTH - PDF_CONTENT_PADDING_LEFT - PDF_CONTENT_PADDING_RIGHT;

export const getUsablePageHeight = (isFirstPage: boolean) =>
    PDF_PAGE_HEIGHT -
    (isFirstPage ? PDF_FIRST_PAGE_HEADER_HEIGHT : PDF_NEXT_PAGE_HEADER_HEIGHT) -
    PDF_CONTENT_PADDING_BOTTOM -
    PDF_SAFE_BOTTOM_SPACE;

export const getPictureDimensions = (picture: ImageElement) => {
    const width = toNumericSize(picture.width, PDF_IMAGE_CARD_WIDTH);
    const maxImageHeight = getUsablePageHeight(false) - PDF_SECTION_TITLE_HEIGHT - 70;
    const height = clamp(
        toNumericSize(picture.height, PDF_IMAGE_CARD_HEIGHT),
        80,
        Math.max(80, maxImageHeight)
    );

    return { width, height };
};

export const estimateDescriptionHeight = (description?: string) => {
    if (!description) {
        return 0;
    }

    const charsPerLine = 42;
    const lineCount = Math.max(1, Math.ceil(description.trim().length / charsPerLine));
    const estimatedHeight =
        lineCount * PDF_IMAGE_DESCRIPTION_LINE_HEIGHT + PDF_IMAGE_DESCRIPTION_PADDING * 2;

    return clamp(
        estimatedHeight,
        PDF_IMAGE_DESCRIPTION_MIN_HEIGHT,
        PDF_IMAGE_DESCRIPTION_MAX_HEIGHT
    );
};

export const estimatePictureCardHeight = (picture: ImageElement) => {
    const { height } = getPictureDimensions(picture);
    return (
        PDF_IMAGE_TITLE_HEIGHT +
        PDF_IMAGE_TITLE_MARGIN_BOTTOM +
        height +
        estimateDescriptionHeight(picture.description) +
        PDF_IMAGE_CARD_BORDER_ALLOWANCE
    );
};

export const chunkPicturesIntoRows = (pictures: ImageElement[]) => {
    const rows: ImageElement[][] = [];
    const maxRowWidth = getPdfContentWidth();

    let currentRow: ImageElement[] = [];
    let currentWidth = 0;

    pictures.forEach((picture) => {
        const { width } = getPictureDimensions(picture);
        const cardWidth = width + PDF_IMAGE_CARD_MARGIN_X;
        const reachesLimit = currentRow.length >= PDF_MAX_IMAGES_PER_ROW;
        const exceedsWidth = currentRow.length > 0 && currentWidth + cardWidth > maxRowWidth;

        if (reachesLimit || exceedsWidth) {
            rows.push(currentRow);
            currentRow = [];
            currentWidth = 0;
        }

        currentRow.push(picture);
        currentWidth += cardWidth;
    });

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
};

export const estimatePictureRowHeight = (row: ImageElement[]) =>
    row.reduce((maxHeight, picture) => {
        return Math.max(maxHeight, estimatePictureCardHeight(picture));
    }, 0);
