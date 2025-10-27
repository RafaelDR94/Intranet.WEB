'use client';

import { Card } from '@/app/components/Card/Card';
import { Button } from '@/app/components/Button/Button';
import ImageUploaderExpanded from '@/app/components/ImageUploaderExpanded/ImageUploaderExpanded';
import SignatureBox from '@/app/components/SignatureBox/SignatureBox';
import SignatureComponent from '@/app/components/SignatureComponent/SignatureComponent';

import useImagesComponent from './hooks/useImagesComponent';
import {
  cardWidthClass,
  cardsWrapperClass,
  containerClass,
  footerWrapperClass,
  signatureButtonClass,
  uploaderClass,
} from './styles';
import type { ImagesComponentProps } from './types';

const ImagesComponent: React.FC<ImagesComponentProps> = ({ formId }) => {
  const {
    isSignatureOpen,
    openSignature,
    closeSignature,
    slots,
    signatureBox,
    shouldShowSignatureButton,
    selectedDriverId,
    handleSignatureAuthorization,
    handleImageSelect,
    handleRemoveImage,
    currentAssignment
  } = useImagesComponent({ formId });

  return (
    <section className={containerClass}>
      {!isSignatureOpen && (
        <>
          <div className={cardsWrapperClass}>
            {slots.map((slot) => (
              <div key={slot.id} className={cardWidthClass}>
                {slot.imageSrc ? (
                  <Card
                    orientation="vertical"
                    imageSrc={slot.imageSrc}
                    fallbackSrc={slot.imageSrc}
                    label=""
                    title={slot.title}
                    description=""
                    onAccept={() => { }}
                    showPrimaryButton={false}
                    showSecondaryButton={false}
                    actionMenuProps={{
                      row: slot,
                      permissions: { delete: true },
                      onEdit: () => { },
                      onDelete: () => handleRemoveImage(slot.id),
                    }}
                  />
                ) : (
                  <ImageUploaderExpanded
                    label={slot.uploadLabel}
                    placeholder=""
                    dataTestId={`image-uploader-${slot.id}`}
                    onImage={handleImageSelect(slot.id)}
                    className={uploaderClass}
                  />
                )}
              </div>
            ))}
          </div>
          {!currentAssignment &&
            <div className={footerWrapperClass}>
              {signatureBox ? (
                <SignatureBox
                  title={signatureBox.title}
                  imageUrl={signatureBox.imageUrl}
                />
              ) : null}

              {shouldShowSignatureButton ? (
                <Button hideIcon onClick={openSignature} className={signatureButtonClass}>
                  Firma del Responsable de la Unidad
                </Button>
              ) : null}
            </div>
          }


        </>
      )}
      <SignatureComponent
        allowExternalToggle={true}
        responsiveRequired={true}
        onResponsiveDownload={() => {
          console.log('Descarga de responsiva');
        }}
        open={isSignatureOpen}
        onClose={closeSignature}
        onAuthorization={handleSignatureAuthorization}
        responsibleGuid={selectedDriverId}
      />
    </section>
  );
};

export default ImagesComponent;
