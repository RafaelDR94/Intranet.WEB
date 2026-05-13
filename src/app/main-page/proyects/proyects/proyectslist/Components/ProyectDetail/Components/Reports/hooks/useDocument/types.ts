export interface Infohelperreturninferface<TData = any> {
    remainingHeight: number;
    residualdata: TData | null;
    currentPageData: TData | null;
    consumedHeight: number;
}

export interface LineObject {
    txt: string;
    length: number;
    lines: number;
}

export interface Infointerface<TData = any> {
    remainingHeight: number;
    Infodata: TData;
    LinePoints?: number;
}

export interface Diagnosticsolutioninterface {
    remainingHeight: number;
    diagnostic: string;
    solution: string;
}

export interface Diagnosticreturn {
    remainingHeight: number;
    residualsolution: string | null;
    residualdiagnostic: string | null;
    currentsolution: string | null;
    currentdiagnostic: string | null;
    consumedHeight: number;
}
