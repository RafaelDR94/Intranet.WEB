'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Button } from '@/app/components/Button/Button';
import { Input } from '@/app/components/Input/Input';
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded';
import type { Activities as ActivityModel } from '@/app/mappings/reports/reports.types';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper';

const MAP_TITLE = 'Mapa de trabajo';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });

const WorkMaps: React.FC = () => {
  const submitTokenRef = useRef(0);
  const savedMapRef = useRef<ActivityModel | null>(null);

  const [direction, setDirection] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  const { report, isReportHydrated, updateMaps } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      isReportHydrated: state.isReportHydrated,
      updateMaps: state.updateMaps,
    }),
    shallow
  );

  useEffect(() => {
    if (!isReportHydrated) return;

    const map = (report.maps ?? [])[0] ?? null;
    savedMapRef.current = map;

    if (map) {
      setDirection(map.description ?? '');
      setImagePreview(map.urlimage ?? null);
      setIsEditing(false);
    } else {
      setDirection('');
      setImagePreview(null);
      setIsEditing(true);
    }
  }, [isReportHydrated, report.maps]);

  const currentMap = savedMapRef.current;

  const handleImageSelection = useCallback(
    (file: File | null) => {
      if (!file) {
        setImagePreview(null);
        return;
      }

      const requestId = ++submitTokenRef.current;
      void fileToDataUrl(file)
        .then((url) => {
          if (submitTokenRef.current !== requestId) return;
          setImagePreview(url);
          setIsEditing(true);
        })
        .catch(() => {
          if (submitTokenRef.current !== requestId) return;
          setImagePreview(null);
        });
    },
    []
  );

  const handleCancel = useCallback(() => {
    const stored = savedMapRef.current;

    if (stored) {
      setDirection(stored.description ?? '');
      setImagePreview(stored.urlimage ?? null);
      setIsEditing(false);
      return;
    }

    setImagePreview(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!imagePreview) return;

    const trimmedDirection = direction.trim();
    const map: ActivityModel = {
      title: MAP_TITLE,
      date: currentDate(),
      description: trimmedDirection,
      urlimage: imagePreview,
    };

    savedMapRef.current = map;
    updateMaps([map]);
    setDirection(trimmedDirection);
    setIsEditing(false);
  }, [direction, imagePreview, updateMaps]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setImagePreview(savedMapRef.current?.urlimage ?? null);
  }, []);

  const showActionButtons = isEditing && Boolean(imagePreview);
  const showEditButton = !isEditing && Boolean(currentMap);
  const canSave = Boolean(imagePreview) && direction.trim().length > 0;

  const mapContainerClasses = 'w-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center';

  const helperText = 'Lugar de la instalacion o proyecto';

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex-1 min-w-[260px]'>
          <Input
            label='Direccion'
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            placeholder='Introduce la direccion'
            helperText={helperText}
            disabled={!isEditing && Boolean(currentMap)}
            dataTestId='work-map-address'
          />
        </div>

        <div className='flex items-center gap-3 self-start'>
          {showActionButtons && (
            <>
              <Button variant='outline' type='button' onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type='button' onClick={handleSave} disabled={!canSave}>
                Guardar Mapa
              </Button>
            </>
          )}

          {showEditButton && (
            <Button variant='outline' type='button' onClick={handleEdit}>
              Editar Informacion
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        imagePreview ? (
          <div className='flex flex-col lg:flex-row gap-6 items-start'>
            <div className='flex-1 w-full'>
              <div className={mapContainerClasses}>
                <img src={imagePreview} alt='Mapa seleccionado' className='h-full w-full object-cover' />
              </div>
            </div>

            <div className='flex-1 w-full'>
              <div className='w-full min-h-[260px] rounded-xl border border-dashed border-slate-200 flex items-center justify-center'>
                <ImageUploaderExpanded
                  key={`work-map-edit-uploader-${submitTokenRef.current}`}
                  placeholder='arrastra/selecciona la imagen que deseas subir'
                  buttonLabel='Cambiar Imagen'
                  onImage={handleImageSelection}
                  dataTestId='work-map-edit-uploader'
                  className='h-full w-full'
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full min-h-[260px] rounded-xl border border-dashed border-slate-200'>
            <ImageUploaderExpanded
              key={`work-map-uploader-${submitTokenRef.current}`}
              placeholder='arrastra/selecciona la imagen que deseas subir'
              buttonLabel='Seleccionar Imagen'
              onImage={handleImageSelection}
              dataTestId='work-map-uploader'
              className='h-full w-full'
            />
          </div>
        )
      ) : (
        currentMap && currentMap.urlimage ? (
          <div className={mapContainerClasses}>
            <img src={currentMap.urlimage} alt='Mapa guardado' className='h-full w-full object-cover' />
          </div>
        ) : (
          <div className={mapContainerClasses}>
            <span className='text-sm text-slate-500'>Sin mapa registrado</span>
          </div>
        )
      )}
    </section>
  );
};

export default WorkMaps;
