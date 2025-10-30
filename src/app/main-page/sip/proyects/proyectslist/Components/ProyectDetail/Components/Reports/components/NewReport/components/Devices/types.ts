
import { initialFormState } from "./utilities/DevicesUtilities";


export type FormValues = typeof initialFormState;

export type ActionMeta = {
  type: 'create' | 'update' | 'delete';
  label: string;
};