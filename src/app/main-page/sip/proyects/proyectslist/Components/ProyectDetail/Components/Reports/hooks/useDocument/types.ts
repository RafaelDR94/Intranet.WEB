export interface Infohelperreturninferface {
    newPagePoints: number;
    residualdata: any;
    currentPageData: any
}
export interface LineObject {
    txt: string;
    length: number;
    points: number;
    lines: number;
}
export interface Infointerface {
    PagePoints: number;
    Infodata: any;
    LinePoints?: number;
}
export interface Diagnosticsolutioninterface {
    PagePoints: number;
    diagnostic: string;
    solution: string;
}
export interface Diagnosticreturn {
    newPagePoints: number;
    residualsolution: any;
    residualdiagnostic: any;
    currentsolution: any;
    currentdiagnostic: any;
}