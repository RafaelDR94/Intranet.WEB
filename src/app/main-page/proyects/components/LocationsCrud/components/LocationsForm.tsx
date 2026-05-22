'use client';

import { Copy, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/app/components/Button/Button';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import CrudFormTemplate from '../../CrudFormTemplate';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import { Select } from '@/app/components/Select/Select';
import { Spinner } from '@/app/components/Spinner/Spinner';
import { useLocationsForm } from '../hooks/useLocationsForm';
import type { CrudScope } from '../../types';

type LocationsFormProps = {
  scope: CrudScope;
};

const LocationsForm = ({ scope }: LocationsFormProps) => {
  const state = useLocationsForm(scope);
  const inlineSubmitRef = useRef<(() => void | Promise<unknown>) | null>(null);
  const [inlineFormReady, setInlineFormReady] = useState(false);
  const isCreatingNewLocation =
    state.mode === 'link-existing' ? state.isCreatingNewLocation : false;

  useEffect(() => {
    if (!isCreatingNewLocation) {
      setInlineFormReady(false);
    }
  }, [isCreatingNewLocation]);

  if (state.mode === 'default') {
    return <CrudFormTemplate {...state} />;
  }

  const handleCopy = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <FormsLayout
      title={state.title}
      primaryLabel={state.primaryLabel}
      onPrimaryClick={() => {
        if (isCreatingNewLocation) {
          void inlineSubmitRef.current?.();
          return;
        }
        void state.onSubmit();
      }}
      primaryDisabled={
        isCreatingNewLocation ? !inlineFormReady : state.primaryDisabled
      }
      enableCollapse={false}
      showSecondaryButton
      secondaryLabel="Cancelar"
      onSecondaryClick={state.onCancel}
    >
      <div className="flex w-full flex-col gap-6">
        <p className="text-b4 text-blue-60">
          Selecciona en el menu desplegable la ubicacion que deseas agregar al proyecto.
          Si no la encuentras en la lista, puedes registrarla dando clic en el boton
          &nbsp;&quot;Crear ubicacion&quot;.
        </p>

        <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-[350px]">
            <p className="mb-2 text-[12px] font-medium leading-4 text-gray-70">
              Seleccionar ubicacion
            </p>
            <Select
              multiple
              options={state.locationOptions}
              selected={state.selectedLocationIds}
              onChange={state.onSelectionChange}
              placeholder="Selecciona una o varias opciones"
              disabled={isCreatingNewLocation}
            />
          </div>

          <Button variant="outline" hideIcon onClick={state.onToggleCreateMode}>
            {isCreatingNewLocation
              ? 'Registrar ubicacion existente'
              : 'Crear ubicacion'}
          </Button>
        </div>

        {state.loadingFormInfo ? (
          <div className="flex min-h-24 items-center justify-center">
            <Spinner size="medium" />
          </div>
        ) : null}
      </div>

      {isCreatingNewLocation ? (
        <div className="w-full">
          <DynamicForm
            key={`inline-location-form-${state.createLocationForm.valuesVersion}`}
            fields={state.createLocationForm.fields}
            onSubmit={state.createLocationForm.onSubmit}
            loading={state.createLocationForm.loading}
            loadingFormInfo={state.createLocationForm.loadingFormInfo}
            responsiveLayoutMatrix={state.createLocationForm.responsiveLayout}
            dataTestId={state.createLocationForm.dataTestId}
            showSubmitIf={() => false}
            externalSubmitRef={inlineSubmitRef}
            onValidChange={setInlineFormReady}
          />
        </div>
      ) : null}

      {state.stagedLocations.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          <div className="hidden grid-cols-[1.2fr_3fr_0.8fr_0.8fr] gap-4 border-b border-gray-30 pb-3 text-[10px] font-semibold uppercase tracking-wide text-green-100 md:grid">
            <p>Nombre</p>
            <p>Direccion</p>
            <p>Enlace</p>
            <p className="text-right">Acciones</p>
          </div>

          <div className="flex flex-col gap-3">
            {state.stagedLocations.map((location) => {
              const mapUrl = String(location.linkmaps ?? '').trim();
              return (
                <div
                  key={location.id}
                  className="grid gap-3 border-b border-gray-20 pb-3 md:grid-cols-[1.2fr_3fr_0.8fr_0.8fr] md:items-center"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-green-100 md:hidden">
                      Nombre
                    </p>
                    <p className="text-b4 text-gray-70">{location.name}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-green-100 md:hidden">
                      Direccion
                    </p>
                    <p className="text-b4 text-gray-70">{location.address}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-green-100 md:hidden">
                      Enlace
                    </p>
                    <div className="text-blue-60 flex items-center gap-3">
                      {mapUrl ? (
                        <>
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-6 w-6 items-center justify-center"
                            aria-label={`Abrir enlace de ${location.name}`}
                          >
                            <Link2 className="h-5 w-5" strokeWidth={1.75} />
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleCopy(mapUrl)}
                            className="inline-flex h-6 w-6 items-center justify-center"
                            aria-label={`Copiar enlace de ${location.name}`}
                          >
                            <Copy className="h-5 w-5" strokeWidth={1.75} />
                          </button>
                        </>
                      ) : (
                        <span className="text-b3 text-gray-50">Sin enlace</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-start md:justify-end">
                    <Button
                      variant="ghost"
                      size="small"
                      hideIcon
                      onClick={() => state.onRemoveStagedLocation(location.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </FormsLayout>
  );
};

export default LocationsForm;
