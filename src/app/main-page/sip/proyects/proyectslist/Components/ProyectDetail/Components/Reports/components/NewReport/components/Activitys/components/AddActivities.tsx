'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { shallow } from 'zustand/shallow';

import { Button } from '@/app/components/Button/Button';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import type { FieldModel } from '@/app/components/DynamicForm/types';
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded';
import ActivitiesViewer from '@/app/components/ActivitiesViewer/ActivitiesViewer';
import type { Activities as ActivityModel } from '@/app/mappings/reports/reports.types';
import { useActivitiesStore } from '@/app/stores/useActivitiesStore/useActivitiesStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';

const FORM_ID = 'add-activity-form';

const buildFields = (): FieldModel[] => [
  {
    type: 'input',
    name: 'title',
    label: 'Titulo*',
    placeholder: 'Titulo',
    value: '',
    validations: [{ type: 'required' }],
  },
  {
    type: 'date',
    name: 'date',
    label: 'Fecha*',
    value: '',
    validations: [{ type: 'required' }],
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Descripcion*',
    placeholder: 'Describe la actividad realizada',
    rows: 3,
    value: '',
    validations: [{ type: 'required' }],
  },
];

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });

const AddActivities: React.FC = () => {
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);
  const readTokenRef = useRef(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldsVersion, setFieldsVersion] = useState(0);
  const [uploaderVersion, setUploaderVersion] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const { activities, addActivity } = useActivitiesStore(
    (state) => ({
      activities: state.activities,
      addActivity: state.addActivity,
    }),
    shallow
  );

  const updateActivities = useReportBuilderStore((state) => state.updateActivities);

  useEffect(() => {
    updateActivities(activities);
  }, [activities, updateActivities]);

  const formFields = useMemo<FieldModel[]>(() => buildFields(), [fieldsVersion]);

  const resetForm = useCallback(() => {
    setImagePreview(null);
    setIsFormValid(false);
    setFieldsVersion((prev) => prev + 1);
    setUploaderVersion((prev) => prev + 1);
  }, []);

  const handleImage = useCallback((file: File | null) => {
    if (!file) {
      resetForm();
      return;
    }

    const requestId = ++readTokenRef.current;
    void fileToDataUrl(file)
      .then((url) => {
        if (readTokenRef.current !== requestId) return;
        setImagePreview(url);
      })
      .catch(() => {
        if (readTokenRef.current !== requestId) return;
        setImagePreview(null);
      });
  }, [resetForm]);

  const handleFormSubmit = useCallback((values: Record<string, any>) => {
    if (!imagePreview) return;

    const activity: ActivityModel = {
      title: String(values.title ?? ''),
      date: String(values.date ?? ''),
      description: String(values.description ?? ''),
      urlimage: imagePreview,
    };

    addActivity(activity);
    resetForm();
  }, [addActivity, imagePreview, resetForm]);

  const handleSaveClick = useCallback(() => {
    submitRef.current?.();
  }, []);

  const hasSelection = Boolean(imagePreview);

  const viewerItems = useMemo(
    () =>
      activities.map((activity) => ({
        title: activity.title,
        description: activity.description,
        image: activity.urlimage,
      })),
    [activities]
  );

  const viewerVisible = viewerItems.length > 0 && !hasSelection;

  const uploaderWrapperClasses = 'mx-auto w-[281px] min-h-[360px] flex items-center justify-center';

  return (
    <section className='flex flex-col gap-6'>
      <h3 className='text-lg font-semibold text-slate-700'>Agregar Imagenes</h3>

      {!hasSelection ? (
        <div
          className={clsx(
            'flex w-full gap-6',
            viewerVisible ? 'flex-col lg:flex-row lg:items-start' : 'flex-col items-center'
          )}
        >
          {viewerVisible && (
            <div className='flex-1 w-full'>
              <ActivitiesViewer items={viewerItems} dataTestId='activities-viewer' />
            </div>
          )}

          <div
            className={clsx(
              'flex w-full justify-center lg:justify-end',
              viewerVisible && 'lg:w-auto'
            )}
          >
            <div className={uploaderWrapperClasses}>
              <ImageUploaderExpanded
                key={`activity-uploader-${uploaderVersion}`}
                placeholder='arrastra/selecciona la imagen que deseas subir'
                buttonLabel='Agregar Imagen'
                onImage={handleImage}
                dataTestId='add-activity-uploader'
                className='h-full w-full'
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>

          <div className='flex items-center gap-3 ml-auto'>
            <Button variant='outline' type='button' onClick={resetForm}>
              Cancelar
            </Button>
            <Button type='button' onClick={handleSaveClick} disabled={!isFormValid}>
              Guardar Actividad
            </Button>
          </div>
          <div className='flex flex-wrap items-start justify-between '>
            <div className='w-[281px] h-[281px] rounded-lg overflow-hidden '>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Actividad seleccionada'
                  className='h-full w-full object-cover'
                />
              )}
            </div>


            <div className='w-[281px] min-h-[360px]'>
              <ImageUploaderExpanded
                key={`change-activity-uploader-${uploaderVersion}`}
                placeholder='arrastra/selecciona la imagen que deseas subir'
                buttonLabel='Cambiar Imagen'
                onImage={handleImage}
                dataTestId='change-activity-uploader'
                initialFile={{ name: 'actividad', base64: imagePreview ?? undefined }}
                className='h-full w-full'
              />
            </div>
          </div>

          <div className='w-full max-w-4xl'>
            <DynamicForm
              key={`activity-form-${fieldsVersion}`}
              fields={formFields}
              onSubmit={handleFormSubmit}
              showSubmitIf={() => false}
              externalSubmitRef={submitRef}
              onValidChange={setIsFormValid}
              dataTestId={FORM_ID}
              responsiveLayoutMatrix={{
                sm: [[10], [10], [10]],
                md: [[3, 3, 4]],
                lg: [[3, 3, 4]],
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default AddActivities;
