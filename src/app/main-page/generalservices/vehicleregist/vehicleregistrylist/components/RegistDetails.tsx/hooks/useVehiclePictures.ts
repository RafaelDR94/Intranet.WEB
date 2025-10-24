import { useCallback, useEffect } from "react";

import type { ActivitiesViewerItem } from "@/app/components/ActivitiesViewer/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import type { FirebaseStorageHelper } from "@/app/context/FirebaseContext/hooks/useFirebaseStorageHelper";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import useVehicleMediaStore from "@/app/stores/useVehicleMediaStore/useVehicleMediaStore";
import { shallow } from "zustand/shallow";

export type PictureTemplate = {
  title: string;
  description: string;
};

export const PicturesModel: readonly PictureTemplate[] = [
  { title: "Frontal", description: "Foto frontal del vehiculo" },
  { title: "Lateral Derecha", description: "Foto lateral derecha del vehiculo" },
  { title: "Lateral Izquierda", description: "Foto lateral izquierda del vehiculo" },
  { title: "Trasera", description: "Foto trasera del vehiculo" },
  { title: "Licencia de conducir", description: "Licencia de conducir del conductor" },
] as const;

export type UseVehiclePicturesResult = {
  items: ActivitiesViewerItem[];
  loading: boolean;
  error?: string;
  hasAssignment: boolean;
  refresh: () => Promise<void>;
};

type LoadOptions = {
  signal?: AbortSignal;
};

const VEHICLE_REQUEST_PREFIX = "VehicleRequest";

export const buildVehiclePicturesErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Error cargando imagenes";
};

export const fetchVehiclePictures = async (
  firebasestorage: FirebaseStorageHelper | null | undefined,
  assignmentId: string,
  folder: "arrive" | "departure"
): Promise<ActivitiesViewerItem[]> => {
  if (!firebasestorage?.storage || !assignmentId) return [];

  const results = await Promise.all(
    PicturesModel.map(async (template) => {
      const path = `${VEHICLE_REQUEST_PREFIX}/${assignmentId}/${folder}/${template.title}`;
      try {
        const image = await firebasestorage.downloadFile(path);
        return {
          title: template.title,
          description: template.description,
          image: image || undefined,
        };
      } catch (err) {
        console.warn(`[vehicle-pictures] No se pudo obtener ${path}`, err);
        return {
          title: template.title,
          description: template.description,
          image: undefined,
        };
      }
    })
  );

  return results;
};

export const createVehiclePicturesHook = (folder: "arrive" | "departure") => {
  const useVehiclePictures = (): UseVehiclePicturesResult => {
    const { firebasestorage } = useFirebase();
    const { currentAssignment } = useTransportStore();

    const assignmentId = currentAssignment?.vehicleassignments_id ?? "";
    const hasAssignment = assignmentId.length > 0;

    const { cachedItems, loading, error, errorSet } = useVehicleMediaStore(
      (state) => {
        if (!assignmentId) {
          return {
            cachedItems: undefined,
            loading: false,
            error: undefined,
            errorSet: false,
          };
        }
        const entry = state.mediaByAssignment[assignmentId];
        return {
          cachedItems: entry?.pictures?.[folder],
          loading: entry?.loading?.[folder] ?? false,
          error: entry?.errors?.[folder],
          errorSet: entry?.errors?.[folder] !== undefined,
        };
      },
      shallow
    );

    const { setPictures, setLoading, setError } = useVehicleMediaStore(
      (state) => ({
        setPictures: state.setPictures,
        setLoading: state.setLoading,
        setError: state.setError,
      }),
      shallow
    );

    const hasCachedItems = cachedItems !== undefined;

    const load = useCallback(
      async (options: LoadOptions = {}, force = false): Promise<void> => {
        if (!hasAssignment || !firebasestorage?.storage) {
          if (force) {
            setPictures(assignmentId, folder, []);
            setError(assignmentId, folder, undefined);
          }
          return;
        }

        if (!force && (hasCachedItems || errorSet)) {
          return;
        }

        const { signal } = options;
        setLoading(assignmentId, folder, true);
        setError(assignmentId, folder, undefined);

        try {
          const items = await fetchVehiclePictures(
            firebasestorage,
            assignmentId,
            folder
          );

          if (signal?.aborted) return;

          setPictures(assignmentId, folder, items);
        } catch (err) {
          if (signal?.aborted) return;
          setError(
            assignmentId,
            folder,
            buildVehiclePicturesErrorMessage(err)
          );
        } finally {
          if (!signal?.aborted) {
            setLoading(assignmentId, folder, false);
          }
        }
      },
      [
        assignmentId,
        hasCachedItems,
        errorSet,
        firebasestorage,
        folder,
        hasAssignment,
        setError,
        setLoading,
        setPictures,
      ]
    );

    useEffect(() => {
      const controller = new AbortController();
      void load({ signal: controller.signal });
      return () => controller.abort();
    }, [load]);

    return {
      items: cachedItems ?? [],
      loading,
      error,
      hasAssignment,
      refresh: () => load({}, true),
    };
  };

  return useVehiclePictures;
};
