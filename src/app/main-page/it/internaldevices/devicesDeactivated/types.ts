/**
 * Row shape for the deactivated devices inventory table.
 */
export type DeactivatedDeviceRow = {
  id: string;
  display_id: string;
  device: string;
  brand: string;
  model: string;
  serial_number: string;
  name: string;
  conditions: string;
  created_at?: string;
  deactivated_at?: string;
  search_content?: string;
  actions?: string;
};
