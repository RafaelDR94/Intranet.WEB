import { useCallback, useEffect, useMemo } from "react";

import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import type { FirebaseStorageHelper } from "@/app/context/FirebaseContext/hooks/useFirebaseStorageHelper";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import useVehicleMediaStore from "@/app/stores/useVehicleMediaStore/useVehicleMediaStore";
import { shallow } from "zustand/shallow";

export type UseSignaturesResult = {
  loading: boolean;
  error?: string;
  hasAssignment: boolean;
  signatureUrl?: string;
  driverName?: string;
  arrivalDateLabel?: string;
  refresh: () => Promise<void>;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const buildSignatureErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Error cargando firma";
};

const normalizeDate = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return DATE_FORMATTER.format(date);
};

export const fetchVehicleSignature = async (
  firebasestorage: FirebaseStorageHelper | null | undefined,
  assignmentId: string,
  folder: "arrive" | "departure" = "departure"
): Promise<string | null> => {
  if (!firebasestorage?.storage || !assignmentId) return null;
  return firebasestorage.downloadFile(
    `VehicleRequest/${assignmentId}/${folder}/signature`
  );
};

const useSignatures = (): UseSignaturesResult => {
  const { firebasestorage } = useFirebase();
  const { currentAssignment } = useTransportStore();

  const assignmentId = currentAssignment?.vehicleassignments_id ?? "";
  const hasAssignment = assignmentId.length > 0;

  const driverName = currentAssignment?.name ?? undefined;
  const arrivalDateLabel = useMemo(
    () => normalizeDate(currentAssignment?.arrival_date),
    [currentAssignment?.arrival_date]
  );

  const { signatureValue, loading, error, errorSet } = useVehicleMediaStore(
    (state) => {
      if (!assignmentId) {
        return {
          signatureValue: undefined,
          loading: false,
          error: undefined,
          errorSet: false,
        };
      }
      const entry = state.mediaByAssignment[assignmentId];
      return {
        signatureValue: entry?.signature,
        loading: entry?.loading?.signature ?? false,
        error: entry?.errors?.signature,
        errorSet: entry?.errors?.signature !== undefined,
      };
    },
    shallow
  );

  const { setSignature, setLoading, setError } = useVehicleMediaStore(
    (state) => ({
      setSignature: state.setSignature,
      setLoading: state.setLoading,
      setError: state.setError,
    }),
    shallow
  );

  const loadSignature = useCallback(
    async (force = false): Promise<void> => {
      if (!hasAssignment || !firebasestorage?.storage) {
        if (force) {
          setSignature(assignmentId, null);
          setError(assignmentId, "signature", undefined);
        }
        return;
      }

      if (!force && (signatureValue !== undefined || errorSet)) {
        return;
      }

      setLoading(assignmentId, "signature", true);
      setError(assignmentId, "signature", undefined);

      try {
        const image = await fetchVehicleSignature(
          firebasestorage,
          assignmentId,
          "departure"
        );
        setSignature(assignmentId, image);
      } catch (err) {
        console.warn(
          `[vehicle-signature] No se pudo obtener firma de ${assignmentId}`,
          err
        );
        setSignature(assignmentId, null);
        setError(assignmentId, "signature", buildSignatureErrorMessage(err));
      } finally {
        setLoading(assignmentId, "signature", false);
      }
    },
    [
      assignmentId,
      errorSet,
      firebasestorage,
      hasAssignment,
      setError,
      setLoading,
      setSignature,
      signatureValue,
    ]
  );

  useEffect(() => {
    void loadSignature();
  }, [loadSignature]);

  return {
    loading,
    error,
    hasAssignment,
    signatureUrl: signatureValue ?? undefined,
    driverName,
    arrivalDateLabel,
    refresh: () => loadSignature(true),
  };
};

export default useSignatures;
