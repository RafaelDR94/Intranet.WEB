import type { ColumnDefinition } from '@/app/components/DataTable/types';
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';

export type CrudScope = 'project' | 'inventory';
export type CrudView = 'list' | 'form' | 'detail';
export type CrudMode = 'create' | 'edit';

export type CrudRecord = {
  id: string;
  actions?: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
  description: string;
  projectCode?: string;
  mapLink?: string;
  stock?: string;
  model?: string;
  serialOrPart?: string;
  provider?: string;
  website?: string;
  phone?: string;
};

export type CrudDetailItem = {
  label: string;
  value: string;
};

export type CrudConfig = {
  entityLabel: string;
  entityLabelPlural: string;
  projectTitle: string;
  inventoryTitle: string;
  createLabel: string;
  updateLabel: string;
  primaryColumnLabel: string;
  secondaryColumnLabel: string;
  tertiaryColumnLabel: string;
  detailTitle: string;
};

export type CrudModuleDefinition = {
  config: CrudConfig;
  rows: CrudRecord[];
  fields: (scope: CrudScope, mode: CrudMode, current: CrudRecord | null) => FieldModel[];
  details: (row: CrudRecord | null) => CrudDetailItem[];
  columns: (
    handlers: {
      onDetail: (row: CrudRecord) => void;
      onEdit: (row: CrudRecord) => void;
      onDelete: (row: CrudRecord) => void;
    }
  ) => ColumnDefinition<CrudRecord>[];
  responsiveLayout: ResponsiveLayoutMatrix;
};
