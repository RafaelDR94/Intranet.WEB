'use client';

import type { SparePart } from '@/app/mappings/inventory/inventory.types';
import type { Refaction } from '@/app/mappings/reports/reports.types';

const normalizeFingerprintValue = (value: unknown) => String(value ?? '').trim().toLowerCase();

export const mapSparePartToReportRefaction = (sparePart: SparePart): Refaction => ({
  description: String(sparePart.name ?? '').trim(),
  brand: String(sparePart.brand ?? '').trim(),
  model: String(sparePart.model ?? '').trim(),
  serialnumber: String(sparePart.serialNumber ?? '').trim(),
  partnumber: String(sparePart.sku ?? '').trim(),
});

export const mapSparePartsSelectionToReport = (spareParts: SparePart[]) => ({
  idSpareParts: spareParts
    .map((sparePart) => String(sparePart.id ?? '').trim())
    .filter(Boolean),
  refactions: spareParts.map(mapSparePartToReportRefaction),
});

export const buildRefactionFingerprint = (refaction: Refaction) =>
  [
    refaction.description,
    refaction.brand,
    refaction.model,
    refaction.serialnumber,
    refaction.partnumber,
  ]
    .map(normalizeFingerprintValue)
    .join('|');

export const buildSparePartLabel = (sparePart: SparePart | null | undefined) => {
  if (!sparePart) return 'la refacción seleccionada';

  const parts = [sparePart.name, sparePart.brand, sparePart.model, sparePart.serialNumber, sparePart.sku]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : 'la refacción seleccionada';
};

export const removeFirstMatchingRefaction = (
  refactions: Refaction[],
  fingerprint: string,
) => {
  let removed = false;

  return refactions.filter((item) => {
    if (!removed && buildRefactionFingerprint(item) === fingerprint) {
      removed = true;
      return false;
    }

    return true;
  });
};
