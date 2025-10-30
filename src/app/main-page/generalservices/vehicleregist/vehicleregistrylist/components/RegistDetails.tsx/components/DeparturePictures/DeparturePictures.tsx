import React from "react";

import ActivitiesViewer from "@/app/components/ActivitiesViewer/ActivitiesViewer";

import useDeparturePictures from "./hooks/useDeparturePictures";

const DeparturePictures: React.FC = () => {
  const { items, loading, error, hasAssignment } = useDeparturePictures();

  if (!hasAssignment) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Selecciona un registro para ver las fotografias de salida.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Cargando fotografias de salida...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No fue posible cargar las fotografias de salida. {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No se encontraron fotografias de salida.
      </div>
    );
  }

  return (
    <ActivitiesViewer
      items={items}
      dataTestId="departure-pictures-viewer"
      maxWidthClassName="max-w-4xl"
    />
  );
};

export default DeparturePictures;
