import type { CompleteTransport } from "@/app/mappings/transport/transport.types";

export interface AddVehicleFormProps {
  formId: string;
  currentTransport?: CompleteTransport | undefined;
  onCancel?: () => void;
  canUpdateForm?: boolean;
}
