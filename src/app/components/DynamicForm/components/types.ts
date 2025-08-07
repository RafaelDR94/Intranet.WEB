import { FieldModel } from "../types";
export interface FieldRendererProps {
  field: FieldModel;
  value: any;
  allValues: Record<string, any>;
  onChange: (value: any) => void;
  onBlur?: (e: React.FocusEvent<Element>) => void;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  helperText?: string;
}
