import React from "react";

import ActivitiesViewer from "@/app/components/ActivitiesViewer/ActivitiesViewer";

import useArrivePictures from "./hooks/useArrivePictures";

const ArrivePictures: React.FC = () => {
  const { items, loading, error, hasAssignment } = useArrivePictures();

  if (!hasAssignment) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Selecciona un registro para ver las fotografias de llegada.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Cargando fotografias de llegada...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No fue posible cargar las fotografias de llegada. {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        No se encontraron fotografias de llegada.
      </div>
    );
  }

  return (
    <ActivitiesViewer
      items={items.filter(item=>item.title!="Licencia de conducir")}
      dataTestId="arrival-pictures-viewer"
      maxWidthClassName="max-w-4xl"
    />
  );
};

export default ArrivePictures;
