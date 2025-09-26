import { Infohelperreturninferface, Infointerface, Diagnosticsolutioninterface, Diagnosticreturn, LineObject } from "../types";



export const InfoHelper = ({ PagePoints, Infodata }: Infointerface): Infohelperreturninferface => {
    const InfoSize = Infodata.length;
    const InfoPoints = Math.ceil(InfoSize / 2) / 2 + 0.5;
    const newPagePoints = PagePoints - InfoPoints;
    const returnobj: Infohelperreturninferface = {
        newPagePoints: newPagePoints,
        residualdata: null,
        currentPageData: Infodata
    };

    return returnobj;
};

export const TableHelper = ({ PagePoints, Infodata }: Infointerface): Infohelperreturninferface => {
    const MinimalTablePoints = 1.5;
    let returnobj: Infohelperreturninferface = {
        newPagePoints: PagePoints,
        residualdata: null,
        currentPageData: Infodata
    };
    let newPagePoints = PagePoints;

    if (PagePoints >= MinimalTablePoints) {
        const TableSize = Infodata.length;
        const TablePoints = (TableSize / 2) + 1.5;
        let currentPageData = Infodata;
        let residualdata = null;

        if (TablePoints > PagePoints) {
            const LessPoints = (PagePoints - TablePoints) * -1;
            const LastDeviceInCurrenP = TableSize - LessPoints * 0.5;
            currentPageData = Infodata.slice(0, LastDeviceInCurrenP);
            residualdata = Infodata.slice(LastDeviceInCurrenP);
            newPagePoints = 0;
        } else {

            currentPageData = Infodata;
            newPagePoints = PagePoints - TablePoints;
        }
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: residualdata,
            currentPageData: currentPageData
        }

    }
    else {
        newPagePoints = 0;
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: Infodata,
            currentPageData: null
        }
    }

    return returnobj;
}
export const ActivitiesHelper = ({ PagePoints, Infodata, LinePoints = 3 }: Infointerface): Infohelperreturninferface => {
    const ComposePoints = 1.0;
    const LinePoint = LinePoints;
    const MinimalPoints = ComposePoints + LinePoint;
    const InfoSize = Infodata.length;
    const Lines = Math.ceil(InfoSize / 2);
    const ActivitiesPoints = (Lines * MinimalPoints) ;

    let newPagePoints = PagePoints;
    let returnobj: Infohelperreturninferface = {
        newPagePoints: PagePoints,
        residualdata: null,
        currentPageData: Infodata
    };
   
    if (PagePoints > MinimalPoints) {
        if (ActivitiesPoints < PagePoints) {
    
            newPagePoints = PagePoints - ActivitiesPoints
            returnobj = {
                newPagePoints: newPagePoints,
                residualdata: null,
                currentPageData: Infodata
            }
        } else {
  
            newPagePoints = 0;
            //const LinesinPage = Math.floor(ActivitiesPoints / PagePoints);
            const LinesinPage = Math.floor(PagePoints / MinimalPoints);
    
            const PicturesinPage = LinesinPage * 2;
         
            const currentPageData = Infodata.slice(0, PicturesinPage); // Máximo 4 imágenes en la primera página
            const residualdata = Infodata.slice(PicturesinPage);
            returnobj = {
                newPagePoints: newPagePoints,
                residualdata: residualdata,
                currentPageData: currentPageData
            }
        }
    }
    else {

        newPagePoints = 0;
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: Infodata,
            currentPageData: null
        }
    }


    return returnobj;
}

export const DiagnosticSolutionHelper = ({ PagePoints, diagnostic, solution }: Diagnosticsolutioninterface): Diagnosticreturn => {
    const MinimalPoints = 1.5;
    let returnobj: Diagnosticreturn = {
        newPagePoints: PagePoints,
        residualsolution: null,
        residualdiagnostic: null,
        currentsolution: solution,
        currentdiagnostic: diagnostic
    };
    let newPagePoints = PagePoints;
    if (PagePoints >= MinimalPoints) {
        const limitperline = 57;
        const diagnisticlines: string[] = diagnostic.split('\n');
        const solutionlines: string[] = solution.split('\n');
        const jsonArray: LineObject[] = [];
        const jsonArray2: LineObject[] = [];
        let diagnosticPoints = 0
        let solutionPoints = 0

        diagnisticlines.forEach(line => {
            const length: number = line.length;
            const lines: number = Math.ceil(length / limitperline);
            const points: number = lines / 6;
            diagnosticPoints = diagnosticPoints + points;
            const jsonObj: LineObject = {
                txt: line,
                length: length,
                points: points,
                lines: lines
            };
            jsonArray.push(jsonObj);
        });

        solutionlines.forEach(line => {
            const length: number = line.length;
            const lines: number = Math.ceil(length / limitperline);
            const points: number = lines / 6;
            solutionPoints = solutionPoints + points;
            const jsonObj: LineObject = {
                txt: line,
                length: length,
                points: points,
                lines: lines
            };
            jsonArray2.push(jsonObj);
        });

        const tablePoints = ((diagnosticPoints > solutionPoints) ? diagnosticPoints : solutionPoints) + 1
        if (tablePoints < PagePoints) {
            newPagePoints = PagePoints - tablePoints;
            returnobj = {
                newPagePoints: newPagePoints,
                residualsolution: null,
                residualdiagnostic: null,
                currentsolution: solution,
                currentdiagnostic: diagnostic
            };

        }
        else {
            returnobj = {
                newPagePoints: newPagePoints,
                residualsolution: solution,
                residualdiagnostic: diagnostic,
                currentsolution: null,
                currentdiagnostic: null
            };
            newPagePoints = 0;
        }
    }
    else {
        newPagePoints = 0;
        returnobj = {
            newPagePoints: newPagePoints,
            residualsolution: solution,
            residualdiagnostic: diagnostic,
            currentsolution: null,
            currentdiagnostic: null
        };
    }

    return returnobj;
}


export const SingleTextHelper = ({ PagePoints, Infodata }: Infointerface): Infohelperreturninferface => {
    const MinimalPoints = 1.5;
    let returnobj: Infohelperreturninferface = {
        newPagePoints: PagePoints,
        residualdata: null,
        currentPageData: null,
    };
    let newPagePoints = PagePoints;
    if (PagePoints >= MinimalPoints) {
        const limitperline = 103;
        const singletextlines: string[] = Infodata.split('\n');

        const jsonArray: LineObject[] = [];

        let singletextPoints = 1.5
        singletextlines.forEach(line => {
            const length: number = line.length;
           
            const lines: number = Math.ceil(length / limitperline);
           
            const points: number = lines / 6;
        
            singletextPoints = singletextPoints +points;
     
            const jsonObj: LineObject = {
                txt: line,
                length: length,
                points: points,
                lines: lines
            };
            jsonArray.push(jsonObj);
        });
  


        if (singletextPoints < PagePoints) {
            newPagePoints = PagePoints - singletextPoints;
            returnobj = {
                newPagePoints: newPagePoints,
                residualdata: null,
                currentPageData: Infodata
            };

        }
        else {
            newPagePoints = 0;
            returnobj = {
                newPagePoints: newPagePoints,
                residualdata: Infodata,
                currentPageData: null
            };
           
        }
    }
    else {
        newPagePoints = 0;
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: Infodata,
            currentPageData: null
        };
    }
    return returnobj;
}

export const SignatureHelper =({ PagePoints, Infodata }: Infointerface): Infohelperreturninferface => {
    const MinimalPoints = 3;
    let returnobj: Infohelperreturninferface = {
        newPagePoints: PagePoints,
        residualdata: null,
        currentPageData: null,
    };
    let newPagePoints = PagePoints;
    if (PagePoints >= MinimalPoints) {
        newPagePoints = PagePoints - MinimalPoints
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: null,
            currentPageData: Infodata
        };
    }
    else {
        newPagePoints = 0;
        returnobj = {
            newPagePoints: newPagePoints,
            residualdata: Infodata,
            currentPageData: null
        };
    }
    return returnobj;
}






