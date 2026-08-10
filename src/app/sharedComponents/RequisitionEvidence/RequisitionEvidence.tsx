"use client";

import React, { useEffect, useState } from "react";

import { ImageUploaderExpanded } from "@/app/components/ImageUploaderExpanded/ImageUploaderExpanded";
import type { SelectedImage } from "@/app/components/ImageUploaderExpanded/types";
import { Label } from "@/app/components/Label/Label";
import { normalizeStatusType } from "@/app/main-page/operations/expenserequisitions/travelexpenserequest/utilities/travelExpenseRequestHelpers";

type RequisitionEvidenceProps = {
  comment?: string;
  imageUrls: string[];
  mode?: "view" | "edit";
  status?: string;
  /** @deprecated Use comment instead. */
  rejectionComment?: string;
  onImagesChange?: (images: SelectedImage[]) => void;
};

const toImages = (imageUrls: string[]): SelectedImage[] =>
  imageUrls.filter(Boolean).map((url, index) => ({
    id: `evidence-${index}-${url}`,
    name: `Evidencia ${index + 1}`,
    url,
    selected: false,
  }));

/** Shared gallery for requisition evidence, with optional Treasury editing. */
export const RequisitionEvidence = ({
  imageUrls,
  mode = "view",
  comment,
  status,
  rejectionComment,
  onImagesChange,
}: RequisitionEvidenceProps) => {
  const [images, setImages] = useState<SelectedImage[]>(() =>
    toImages(imageUrls),
  );

  useEffect(() => setImages(toImages(imageUrls)), [imageUrls]);

  const handleImagesChange = (nextImages: SelectedImage[]) => {
    setImages(nextImages);
    onImagesChange?.(nextImages);
  };

  const displayComment = comment?.trim() || rejectionComment?.trim();
  const displayStatus = status?.trim();
  const evidenceHeader =
    displayComment || displayStatus ? (
      <div className="mb-3 flex items-start justify-between gap-3">
        {displayComment ? (
          <p className="text-b4 text-gray-70">{displayComment}</p>
        ) : (
          <span />
        )}
        {displayStatus ? (
          <Label
            type={normalizeStatusType(displayStatus)}
            text={displayStatus}
            className="m-0 shrink-0"
          />
        ) : null}
      </div>
    ) : null;

  if (mode === "view") {
    const validImageUrls = imageUrls.filter((imageUrl) => imageUrl.trim());
    if (!validImageUrls.length && !evidenceHeader) return null;
    return (
      <section
        aria-label="Evidencia de Broxel"
        className="bg-white-100 rounded-lg p-4 shadow-sm"
      >
        {evidenceHeader ?? (
          <h2 className="text-c1 text-blue-60 mb-3">Evidencia de Broxel</h2>
        )}
        {validImageUrls.length ? (
          <div className="flex gap-[14px] overflow-x-auto pb-1">
            {validImageUrls.map((imageUrl, index) => (
              <a
                className="ring-gray-20 h-36 w-[177px] shrink-0 overflow-hidden rounded-lg ring-1"
                href={imageUrl}
                key={imageUrl}
                rel="noreferrer"
                target="_blank"
              >
                <img
                  alt={`Evidencia de Broxel ${index + 1}`}
                  className="size-full object-cover"
                  src={imageUrl}
                />
              </a>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="bg-white-100 rounded-lg p-4 shadow-sm">
      {evidenceHeader ?? (
        <h2 className="text-c1 text-blue-60 mb-3">Evidencia de Broxel</h2>
      )}
      <ImageUploaderExpanded
        accept="image/*"
        buttonLabel="Seleccionar imagen"
        className="border-gray-20 flex h-32 min-h-0 w-full flex-col items-center justify-center border border-dashed p-2 text-center"
        galleryLayout="integrated"
        initialFiles={images}
        multiple
        onImage={() => undefined}
        onImagesChange={handleImagesChange}
        placeholder="Arrastra o selecciona las imágenes que deseas subir"
        showCamera={false}
      />
    </section>
  );
};
