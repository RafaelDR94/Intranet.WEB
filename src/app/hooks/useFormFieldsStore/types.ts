import { FieldModel } from "@/app/components/DynamicForm/types"
export interface FormFieldsState {
  fields: FieldModel[]
  setFields: (newFields: FieldModel[]) => void
  updateField: (name: string, changes: Partial<FieldModel>) => void
  resetFields: () => void
}