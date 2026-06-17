import type {
  Activities,
  ClientSignatureinterface,
  Model,
  Refaction,
  ReportDeviceView,
  ReportView,
  CategoriesType,
} from '@/app/mappings/reports/reports.types';
import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';
import type { WorkPositionType } from '@/app/mappings/workposition/workposition.types';
import type { ReportDocument } from './utilities/helpers';


export type ReportBuilderState = {
  report: ReportView;
  currentReportfrontguid?: string;
  currentReportbackguid?: string;
  isReportHydrated: boolean;
  creatingDB: boolean;
  deletingDB: boolean;
  updatingDB: boolean;
  readingDB: boolean;

  succescreatingDB: boolean;
  succesdeletingDB: boolean;
  succesupdatingDB: boolean;
  succesreadingDB: boolean;

  error?: string;

  updateAdvance: (payload: {
    ticket?: string;
    location?: ProyectLocationType;
    employee?: EmployeeType;
    workposition?: WorkPositionType;
    remarks?: string;
    progress?: string | number;
    diagnostic?: string;
    solution?: string;
    startdate?: string;
    enddate?: string;
    reportcategory?: CategoriesType;

  }) => void;
  startNewReport: (idProyect: string, employee: string, workposition: string) => void;
  updateModel: (payload: { model?: Model; type?: string; }) => void;
  updateActivities: (activities: Activities[]) => void;
  updateMaps: (maps: Activities[]) => void;
  updateRefactions: (refactions: Refaction[], idSpareParts?: string[]) => void;
  updateClientsign: (client: ClientSignatureinterface) => void;
  updateSignature: (signatureUrl: string) => void;
  updateReportDevices: (devices: ReportDeviceView[]) => void;
  setCurrentReportfrontguid: (frontId: string) => void;
  createReportInDB: (force?: boolean) => Promise<ReportDocument | null>;
  readReportByFrontId: (frontId: string) => Promise<ReportDocument | null>;
  updateReportInDB: () => Promise<ReportDocument | null>;
  deleteReportByFrontId: (frontId?: string) => Promise<boolean>;
  reset: () => void;
  resetflags: () => void;
  setReport: (report: ReportView) => void
  readReportOnline: (idreport: string) => Promise<void>;
  updateBackId: (reportid: string) => void;
};

export type SetReportState = (
  partial: Partial<ReportBuilderState> | ((state: ReportBuilderState) => Partial<ReportBuilderState>)
) => void;
export type GetReportState = () => ReportBuilderState;
