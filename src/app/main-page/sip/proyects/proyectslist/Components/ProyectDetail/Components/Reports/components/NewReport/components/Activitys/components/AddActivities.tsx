'use client'

import React from 'react';
import clsx from 'clsx'
import { Button } from '@/app/components/Button/Button'
import DynamicForm from '@/app/components/DynamicForm/DynamicForm'
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded'
import ActivitiesViewer from '@/app/components/ActivitiesViewer/ActivitiesViewer'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import useAddActivities from './hooks/useAddActivities'

const FORM_ID = 'add-activity-form'

const AddActivities: React.FC<{ hideAdd: boolean }> = ({ hideAdd }) => {
  const isMobile = useIsMobile()

  const {
    imagePreview,
    formFields,
    viewerItems,
    isFormValid,
    hasSelection,
    resetForm,
    handleImage,
    handleFormSubmit,
    handleSaveClick,
    submitRef,
    fieldsVersion,
    uploaderVersion,
    setIsFormValid,
    pendingDelete,
    confirmActivityDelete,
    cancelActivityDelete
  } = useAddActivities()

  const deleteContentMessage = pendingDelete
    ? `Deseas eliminar la actividad "${pendingDelete.activity.title}"? Esta accion no se puede deshacer.`
    : ''

  const viewerVisible = viewerItems.length > 0 && !hasSelection
  const uploaderWrapperClasses = 'mx-auto min-h-[222px] lg:w-[300px] flex items-center justify-center'

  return (
    <section className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between w-full'>
        {!isMobile && <h3 className='text-label font-medium text-gray-70'>Agregar Imágenes</h3>}

        {hasSelection && (
          <div
            className={clsx(
              'flex items-center gap-3',
              !isMobile && 'mr-[40vh]',
              isMobile && 'justify-between w-full'
            )}
          >
            <Button variant='outline' type='button' onClick={resetForm} hideIcon size='small'>
              Cancelar
            </Button>
            <Button type='button' onClick={handleSaveClick} disabled={!isFormValid} size='small' hideIcon>
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* Body */}
      {!hasSelection ? (
        <div
          className={clsx(
            'flex w-full gap-6',
            viewerVisible ? 'flex-col lg:flex-row lg:items-start' : 'flex-col items-center'
          )}
        >
          {/* Lista de actividades */}
          {viewerVisible && (
            <div className='flex-1 w-full'>
              <ActivitiesViewer items={viewerItems} dataTestId='activities-viewer' forcevertical />
            </div>
          )}

          {/* Uploader */}
          <div className={clsx('flex w-full justify-center lg:justify-end', viewerVisible && 'lg:w-auto')}>
            {!hideAdd && (
              <div className={uploaderWrapperClasses}>
                <ImageUploaderExpanded
                  key={`activity-uploader-${uploaderVersion}`}
                  placeholder='arrastra/selecciona la imagen que deseas subir'
                  buttonLabel='Agregar Imagen'
                  onImage={handleImage}
                  dataTestId='add-activity-uploader'
                  className={clsx(isMobile ? 'h-[230px] mb-3 w-full' : 'h-full w-full')}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {/* Fila superior: Imagen + Uploader */}
          <div className='md:ml-70 flex flex-col lg:flex-row lg:items-start justify-between gap-10'>
            {/* Imagen actual */}
            <div className='w-[281px] h-[281px] rounded-lg overflow-hidden'>

              {imagePreview && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt='Actividad seleccionada'
                    className='h-full w-full object-cover'
                  />
                </>

              )}
            </div>

            {/* Uploader o formulario según dispositivo */}
            {isMobile ? (
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
            ) : (
              <div className='min-h-[222px] lg:w-[300px]'>
                <ImageUploaderExpanded
                  key={`change-activity-uploader-${uploaderVersion}`}
                  placeholder='arrastra/selecciona la imagen que deseas subir'
                  buttonLabel='Cambiar Imagen'
                  onImage={handleImage}
                  dataTestId='change-activity-uploader'
                  initialFile={{ name: 'actividad', base64: imagePreview ?? undefined }}
                  className={clsx(isMobile ? 'h-[230px] mb-3' : 'h-full')}
                />
              </div>
            )}
          </div>

          {/* Fila inferior: Formulario */}
          <div className='w-full max-w-4xl'>
            {isMobile && !hideAdd ? (
              <ImageUploaderExpanded
                key={`change-activity-uploader-${uploaderVersion}`}
                placeholder='arrastra/selecciona la imagen que deseas subir'
                buttonLabel='Cambiar Imagen'
                onImage={handleImage}
                dataTestId='change-activity-uploader'
                initialFile={{ name: 'actividad', base64: imagePreview ?? undefined }}
                className={clsx(isMobile ? 'h-[230px] mb-3' : 'h-full')}
              />
            ) : (
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
            )}
          </div>
        </div>
      )}

      <PopUp
        open={Boolean(pendingDelete)}
        onClose={cancelActivityDelete}
        title='Eliminar actividad'
        content={deleteContentMessage}
        showPrimaryButton
        primaryButtonText='Eliminar'
        onPrimaryButtonClick={confirmActivityDelete}
        showSecondaryButton
        secondaryButtonText='Cancelar'
      />
    </section>
  )
}

export default AddActivities
