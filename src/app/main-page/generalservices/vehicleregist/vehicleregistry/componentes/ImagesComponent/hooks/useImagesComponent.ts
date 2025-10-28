/**
 * Encapsula la logica de captura de imagenes y firmas para el registro vehicular.
 * Coordina el estado global de slots, la generacion de documentos responsivos y las validaciones previas.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore';
import { useVehicleRegistryImagesStore } from '@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore';
import { shallow } from 'zustand/shallow';
import { useTransportStore } from '@/app/stores/useTransportStore/useTransportStore';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { CreatePDF } from '@/app/utilities/PDF/PDF';
import type {
  LabeledOption,
  UseImagesComponentParams,
  UseImagesComponentReturn,
} from '../types';
import useVehicleDocuments from '../../../../hooks/useVehicleDocuments';
const isLabeledOption = (option: unknown): option is LabeledOption =>
  typeof option === 'object' &&
  option !== null &&
  'label' in option &&
  'value' in option;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No fue posible leer la imagen seleccionada.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Ocurrio un error al cargar la imagen.'));
    };

    reader.readAsDataURL(file);
  });

const useImagesComponent = ({
  formId,
}: UseImagesComponentParams) => {
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [downloadingResponsive, setDownloadingResponsive] = useState(false);
  const { makeResponsive } = useVehicleDocuments();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const {
    slots,
    setSlotImage,
    resetSlot,
    signature,
    setSignature,
    resetSignature,
    signatureResponsibleId,
  } = useVehicleRegistryImagesStore((state) => ({
    slots: state.slots,
    setSlotImage: state.setSlotImage,
    resetSlot: state.resetSlot,
    signature: state.signature,
    setSignature: state.setSignature,
    resetSignature: state.resetSignature,
    signatureResponsibleId: state.signatureResponsibleId,
  }), shallow);

  const { currentAssignment } = useTransportStore(
    (s) => ({
      currentAssignment: s.currentAssignment,
    }),
    shallow
  );



  const driverField = useFormFieldsStore(
    (state) => state.fieldsByFormId[formId]?.find((field) => field.name === 'driver')
  );
  const vehicleField = useFormFieldsStore(
    (state) => state.fieldsByFormId[formId]?.find((field) => field.name === 'vehicle')
  );

  const selectedDriverId =
    typeof driverField?.value === 'string' ? driverField.value : '';
  const selectedVehicleId =
    typeof vehicleField?.value === 'string' ? vehicleField.value : '';

  const selectedDriverLabel = useMemo(() => {
    if (!driverField?.options || !Array.isArray(driverField.options)) return '';
    const match = driverField.options.find(
      (option) => isLabeledOption(option) && option.value === selectedDriverId
    );
    return match?.label ?? '';
  }, [driverField?.options, selectedDriverId]);

  useEffect(() => {
    if (!selectedDriverId && signature) {
      resetSignature();
      setIsSignatureOpen(false);
      return;
    }

    if (
      selectedDriverId &&
      signature &&
      signatureResponsibleId &&
      signatureResponsibleId !== selectedDriverId
    ) {
      resetSignature();
      setIsSignatureOpen(false);
    }
  }, [selectedDriverId, signature, signatureResponsibleId, resetSignature]);

  useEffect(() => {
    if (!selectedDriverId) {
      setIsSignatureOpen(false);
    }
  }, [selectedDriverId]);

  const handleSignatureAuthorization = useCallback<
    UseImagesComponentReturn['handleSignatureAuthorization']
  >(
    (authorized) => {
      if (!authorized?.state || !authorized.signature) return;
      if (!selectedDriverId) return;
      setSignature(authorized.signature, selectedDriverId);
      setIsSignatureOpen(false);
    },
    [selectedDriverId, setSignature]
  );

  const handleImageSelect = useCallback<
    UseImagesComponentReturn['handleImageSelect']
  >(
    (slotId) => async (file) => {
      if (!file) {
        resetSlot(slotId);
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setSlotImage(slotId, { file, imageSrc: dataUrl });
      } catch (error) {
        console.error(error);
        resetSlot(slotId);
      }
    },
    [resetSlot, setSlotImage]
  );

  const handleRemoveImage = useCallback<
    UseImagesComponentReturn['handleRemoveImage']
  >(
    (slotId) => {
      resetSlot(slotId);
    },
    [resetSlot]
  );

  const signatureBox = useMemo(
    () =>
      signature && selectedDriverLabel
        ? { title: selectedDriverLabel, imageUrl: signature }
        : null,
    [selectedDriverLabel, signature]
  );

  const openSignature = useCallback(() => {
    setIsSignatureOpen(true);
  }, []);

  const closeSignature = useCallback(() => {
    setIsSignatureOpen(false);
  }, []);

  const handleResponsiveDownload = useCallback(async () => {
    if (downloadingResponsive) return;



    if (!selectedDriverId || !selectedVehicleId) {
      showAlert({
        type: 'warning',
        title: 'Información incompleta',
        description: 'No se pudo identificar al empleado o al vehículo asignado.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    try {
      setDownloadingResponsive(true);
      showSpinner({ message: 'Generando responsiva...' });

      const pdfData = await makeResponsive(selectedDriverId,selectedVehicleId);
      if (!pdfData) {
        throw new Error('No se pudo construir la responsiva');
      }

      const url = await new Promise<string>((resolve, reject) => {
        try {
          CreatePDF(pdfData, resolve);
        } catch (err) {
          reject(err);
          return;
        }
        setTimeout(() => reject(new Error('Tiempo de espera excedido al generar el PDF')), 10_000);
      });

      const fileId = selectedVehicleId || 'registro';
      const filename = `responsiva-vehicular-${fileId}.pdf`;
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      showAlert({
        type: 'info',
        title: 'Documento generado',
        description: 'La responsiva se descargó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      });
    } catch (error) {
      console.error('[vehicle-documents] Error generando responsiva', error);
      const message =
        error instanceof Error ? error.message : 'Intenta nuevamente en unos segundos.';
      showAlert({
        type: 'error',
        title: 'No se pudo generar la responsiva',
        description: message,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
    } finally {
      hideSpinner();
      setDownloadingResponsive(false);
    }
  }, [
    currentAssignment,
    downloadingResponsive,
    hideSpinner,
    makeResponsive,
    showAlert,
    showSpinner,
  ]);

  return {
    isSignatureOpen,
    openSignature,
    closeSignature,
    slots: currentAssignment ? slots.filter(slot => slot.title != "Licencia de conducir") : slots,
    signatureBox,
    shouldShowSignatureButton: Boolean(selectedDriverId),
    selectedDriverId,
    handleSignatureAuthorization,
    handleImageSelect,
    handleRemoveImage,
    handleResponsiveDownload,
    currentAssignment
  };
};

export default useImagesComponent;
