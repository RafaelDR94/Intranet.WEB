"use client";

import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";
import { useInternalDevicesStore } from "@/app/stores/useInternalDevicesStore/useInternalDevicesStore";
import HammerIcon from "@/assets/icons/tools/tools/hammer.svg";

type DeactivatedDeviceReviewsProps = {
  device: InternalDevice;
};

type ReviewRow = {
  id: string;
  dateLabel: string;
  description: string;
  responsible: string;
};

const formatReviewDate = (rawDate?: string): string => {
  if (!rawDate) return "-";

  const onlyDate = rawDate.split("T")[0];
  const [year, month, day] = onlyDate.split("-");
  if (!year || !month || !day) return "-";

  return `${day}/${month}/${year}`;
};

const DeactivatedDeviceReviews = ({
  device,
}: DeactivatedDeviceReviewsProps) => {
  const { reviews, loading, fetchDeviceReviewsByDeviceId } =
    useInternalDevicesStore(
      (state) => ({
        reviews: state.deviceReviewsByDevice,
        loading: state.loadingDeviceReviewsByDevice,
        fetchDeviceReviewsByDeviceId: state.fetchDeviceReviewsByDeviceId,
      }),
      shallow,
    );

  useEffect(() => {
    if (!device.device_id) return;
    void fetchDeviceReviewsByDeviceId(device.device_id, true);
  }, [device.device_id, fetchDeviceReviewsByDeviceId]);

  const rows = useMemo<ReviewRow[]>(
    () =>
      reviews.map((review) => ({
        id: review.device_review_id,
        dateLabel: formatReviewDate(review.date ?? review.created_at),
        description: review.description || "-",
        responsible: review.responsible || review.user_name || "-",
      })),
    [reviews],
  );

  if (loading) {
    return (
      <div className="text-gray-70 text-center">Cargando revisiones...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="small" variant="ghost" icon={HammerIcon}>
          Nueva revision
        </Button>
      </div>

      <div className="bg-white-100 overflow-hidden rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead className="border-gray-30 border-b">
            <tr className="text-green-100">
              <th className="text-c2 px-4 py-3 font-semibold">FECHA</th>
              <th className="text-c2 px-4 py-3 font-semibold">DIAGNOSTICO</th>
              <th className="text-c2 px-4 py-3 font-semibold">RESPONSABLE</th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {rows.length === 0 && (
              <tr>
                <td className="text-c2 px-4 py-5 text-center" colSpan={3}>
                  Sin revisiones registradas.
                </td>
              </tr>
            )}
            {rows.map((review) => (
              <tr key={review.id}>
                <td className="text-c2 px-4 py-3">{review.dateLabel}</td>
                <td className="text-c2 px-4 py-3">
                  <span className="block max-w-[150px] truncate">
                    {review.description}
                  </span>
                </td>
                <td className="text-c2 px-4 py-3">{review.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeactivatedDeviceReviews;
