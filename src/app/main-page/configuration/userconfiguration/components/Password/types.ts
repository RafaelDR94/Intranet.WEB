import type { FieldModel } from "@/app/components/DynamicForm/types";

export type PasswordProps = {
  className?: string;
};

export type PasswordFormValues = {
  newPassword?: string;
  confirmPassword?: string;
};

export type UsePasswordReturn = {
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  displayPassword: string;
  fields: FieldModel[];
  valuesVersion: number;
  handleSubmit: (values: PasswordFormValues) => Promise<void>;
};
