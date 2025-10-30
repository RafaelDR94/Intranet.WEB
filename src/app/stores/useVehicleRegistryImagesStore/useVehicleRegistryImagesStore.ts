'use client';

import { createWithEqualityFn } from 'zustand/traditional';

import type {
  VehicleImageSlot,
  VehicleImageSlotBase,
  VehicleRegistryImagesState,
} from './types';

export const defaultVehicleImageSlots: VehicleImageSlotBase[] = [
  {
    id: 'front',
    title: 'Frontal',
    uploadLabel: 'Subir imagen frontal de vehiculo',
  },
  {
    id: 'left-side',
    title: 'Lateral Izquierda',
    uploadLabel: 'Subir imagen lateral izquierda de vehiculo',
  },
  {
    id: 'right-side',
    title: 'Lateral Derecha',
    uploadLabel: 'Subir imagen lateral derecha de vehiculo',
  },
  {
    id: 'rear',
    title: 'Trasera',
    uploadLabel: 'Subir imagen trasera de vehiculo',
  },
  {
    id: 'license',
    title: 'Licencia de conducir',
    uploadLabel: 'Subir imagen de licencia del operador',
  },
];

const buildInitialSlots = (
  baseSlots: VehicleImageSlotBase[] = defaultVehicleImageSlots
): VehicleImageSlot[] =>
  baseSlots.map((slot) => ({
    ...slot,
    imageSrc: '',
    file: null,
  }));

/**
 * Store global para gestionar las imagenes del registro de vehiculos.
 */
export const useVehicleRegistryImagesStore =
  createWithEqualityFn<VehicleRegistryImagesState>()((set) => ({
    slots: buildInitialSlots(),
    signature: '',
    signatureResponsibleId: '',
    setSlotImage: (slotId, { file, imageSrc }) =>
      set((state) => ({
        slots: state.slots.map((slot) =>
          slot.id === slotId ? { ...slot, file, imageSrc } : slot
        ),
      })),
    resetSlot: (slotId) =>
      set((state) => ({
        slots: state.slots.map((slot) =>
          slot.id === slotId ? { ...slot, file: null, imageSrc: '' } : slot
        ),
      })),
    setSignature: (signature, responsibleId) =>
      set({
        signature,
        signatureResponsibleId: responsibleId,
      }),
    resetSignature: () =>
      set({
        signature: '',
        signatureResponsibleId: '',
      }),
    resetAll: () =>
      set({
        slots: buildInitialSlots(),
        signature: '',
        signatureResponsibleId: '',
      }),
    initializeSlots: (slots) =>
      set({
        slots: buildInitialSlots(slots ?? defaultVehicleImageSlots),
      }),
  }));
