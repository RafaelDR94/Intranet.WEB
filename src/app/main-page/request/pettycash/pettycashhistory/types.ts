import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { PettyCashVoucherFull } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import type { LabelType } from "@/app/components/Label/types";

/**
 * Props para el componente {@link PictureTable}.
 */
export interface PicturesTableProps {
  /** Callback ejecutado cuando se selecciona una imagen. */
  setSelectedPictures: (picture: BillingImagesTable | null) => void;
}

/**
 * Fila utilizada para representar un vale de caja chica dentro del historial.
 * Extiende las propiedades del historial de facturas con los campos necesarios
 * para la vista de la tabla.
 */
export type PettyCashHistoryRow = HistoryRow & {
  /** Importe mostrado en la tabla. */
  amount: number;
  /** Tipo de vale. */
  voucherType: string;
    voucherLabelType: LabelType;
  /** Fecha normalizada para la tabla. */
  date: string;
  /** Total del vale. */
  total: number;
  /** Subtotal del vale. */
  subtotal: number;
  /** IVA del vale. */
  iva: number;
  /** Nombre del empleado asociado. */
  employeeName: string;
};

/**
 * Propiedades compartidas con el panel lateral del historial.
 */
export type PettyCashHistoryDetail = PettyCashVoucherFull;
