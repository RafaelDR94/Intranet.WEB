import { FieldModel } from "@/app/components/DynamicForm/types"

export type FormFieldsState = {
  fieldsByFormId: Record<string, FieldModel[]>
  setFields: (formId: string, newFields: FieldModel[]) => void
  updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void
  resetFields: (formId: string) => void
  resetAll: () => void
}