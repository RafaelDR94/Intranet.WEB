import type { FieldModel } from "@/app/components/DynamicForm/types";

/**
 * Props supported by the NIP configuration card.
 */
export type NipProps = {
  /**
   * Optional class name to extend or override the base card styles.
   */
  className?: string;
};

/**
 * Shape of the values emitted by the DynamicForm component when updating the NIP.
 */
export type NipFormValues = {
  nip?: string;
};

/**
 * Contract returned by {@link useNip} with all the state and handlers required by the UI component.
 */
export type UseNipReturn = {
  fields: FieldModel[];
  valuesVersion: number;
  handleSubmit: (values: NipFormValues) => Promise<void>;
};
