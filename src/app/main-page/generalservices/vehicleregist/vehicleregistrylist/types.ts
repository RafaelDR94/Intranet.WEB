import type { TransportAssignament } from '@/app/mappings/transport/transport.types';

export type VehicleRegistryRow = {
  id: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  vehicle: string;
  plates: string;
  driver: string;
  status: string;
  destination: string;
  departureSort: number;
  statusVariant: 'inTransit' | 'other';
  assignment: TransportAssignament;
};


