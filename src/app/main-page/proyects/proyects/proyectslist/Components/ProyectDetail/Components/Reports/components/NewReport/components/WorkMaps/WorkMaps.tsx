"use client"
'use client';

import React from 'react';
import { Button } from '@/app/components/Button/Button';
import { Input } from '@/app/components/Input/Input';
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded';
import useWorkMaps from './hooks/useWorkMaps';
import { dropzoneBaseClasses } from '@/app/components/ImageUploaderExpanded/styles';
import {
  sectionCls,
  headerRowCls,
  inputWrapperCls,
  actionsWrapperCls,
  mapContainerCls,
  dashedUploaderWrapperCls,
} from './styles';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
const WorkMaps: React.FC = () => {
  const {
    handleImageSelection,
    handleSave,
    handleCancel,
    setDirection,
    handleEdit,
    isEditing,
    imagePreview,
    currentMap,
    direction,
    submitTokenRef,
    report
  } = useWorkMaps();

  const showActionButtons = isEditing && Boolean(imagePreview);
  const showEditButton = !isEditing && Boolean(currentMap);
  const canSave = Boolean(imagePreview) && direction.trim().length > 0;
  const isMobile = useIsMobile();
  const helperText = 'Lugar de la instalacion o proyecto';

  const renderContent = () => {
    if (isEditing) {
      if (imagePreview) {
        return (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
              <div className={mapContainerCls}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Mapa seleccionado"
                  className="h-[20vh] w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className={dashedUploaderWrapperCls}>
                <ImageUploaderExpanded
                  key={`work-map-edit-uploader-${submitTokenRef.current}`}
                  placeholder="arrastra/selecciona la imagen que deseas subir"
                  buttonLabel="Cambiar Imagen"
                  onImage={handleImageSelection}
                  dataTestId="work-map-edit-uploader"
              className={"h-full w-full "+dropzoneBaseClasses}
                />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={dashedUploaderWrapperCls}>
          <ImageUploaderExpanded
            key={`work-map-uploader-${submitTokenRef.current}`}
            placeholder="arrastra/selecciona la imagen que deseas subir"
            buttonLabel="Seleccionar Imagen"
            onImage={handleImageSelection}
            dataTestId="work-map-uploader"
            className={"h-full w-full "+dropzoneBaseClasses}
          />
        </div>
      );
    }

    if (currentMap && currentMap.urlimage) {
      return (
        <div className={mapContainerCls}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentMap.urlimage}
            alt="Mapa guardado"
            className="h-[35vh] w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className={mapContainerCls}>
        <span className="text-sm text-slate-500">Sin mapa registrado</span>
      </div>
    );
  };

  return (
    <section className={sectionCls}>
      {!report?.clientsign?.url && <div className={headerRowCls}>
        <div className={inputWrapperCls}>
          <Input
            label="Ubicación de trabajo"
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            placeholder="Introduce la ubicación"
            helperText={helperText}
            disabled={!isEditing && Boolean(currentMap)}
            dataTestId="work-map-address"
          />
        </div>

        <div className={actionsWrapperCls}>
          {showActionButtons && (
            <>
              <Button className={isMobile ? "" : "mt-5"} variant="outline" type="button" onClick={handleCancel} hideIcon>
                Cancelar
              </Button>
              <Button className={isMobile ? "" : "mt-5"} type="button" onClick={handleSave} disabled={!canSave} hideIcon>
                Guardar Mapa
              </Button>
            </>
          )}


        </div>
        {showEditButton && (
          <Button className={isMobile ? "w-full" : "mt-5"} variant="outline" type="button" hideIcon onClick={handleEdit}>
            Editar Informacion
          </Button>
        )}
      </div>}


      {renderContent()}
    </section>
  );
};

export default WorkMaps;
