import { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore';
import { useVehicleRegistryImagesStore } from '@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore';
import { shallow } from 'zustand/shallow';
import { useTransportStore } from '@/app/stores/useTransportStore/useTransportStore';
import type {
  LabeledOption,
  UseImagesComponentParams,
  UseImagesComponentReturn,
} from '../types';

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
  const [isSignatureOpen, setSignatureOpen] = useState(false);

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

  const selectedDriverId =
    typeof driverField?.value === 'string' ? driverField.value : '';

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
      setSignatureOpen(false);
      return;
    }

    if (
      selectedDriverId &&
      signature &&
      signatureResponsibleId &&
      signatureResponsibleId !== selectedDriverId
    ) {
      resetSignature();
      setSignatureOpen(false);
    }
  }, [selectedDriverId, signature, signatureResponsibleId, resetSignature]);

  useEffect(() => {
    if (!selectedDriverId) {
      setSignatureOpen(false);
    }
  }, [selectedDriverId]);

  const handleSignatureAuthorization = useCallback<
    UseImagesComponentReturn['handleSignatureAuthorization']
  >(
    (authorized) => {
      if (!authorized?.state || !authorized.signature) return;
      if (!selectedDriverId) return;
      setSignature(authorized.signature, selectedDriverId);
      setSignatureOpen(false);
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
    setSignatureOpen(true);
  }, []);

  const closeSignature = useCallback(() => {
    setSignatureOpen(false);
  }, []);

  return {
    isSignatureOpen,
    openSignature,
    closeSignature,
    slots,
    signatureBox,
    shouldShowSignatureButton: Boolean(selectedDriverId),
    selectedDriverId,
    handleSignatureAuthorization,
    handleImageSelect,
    handleRemoveImage,
    currentAssignment
  };
};

export default useImagesComponent;
