'use client'
import ExternalAcccesForm from "@/app/main-page/request/acces/generateacces/components/ExternalAccesForm/ExternalAccesForm";
import useAccesRequest from "./hooks/useAccesRequest";
import { mainLayoutStyles } from "../main-page/components/MainLayoutClient/styles";
import { Alert } from "../components/Alert/Alert";
import LoadingOverlay from "../components/LoadingOverLay/LoadingOverlay";
import ShowImage from "../components/ShowImage/ShowImage";
import { usePrincipal } from "../context/PrincipalContext/PrincipalContext";

const AccesRequestClient = () => {
  const { canAcces } = useAccesRequest();
  const { usePrincipalAlert, usePrincipalLoading, usePrincipalImage } = usePrincipal();
  const { alert, hideAlert } = usePrincipalAlert;
  const { open, message, spinnerSize } = usePrincipalLoading;
  const {
    state: { open: imageOpen, src, alt, showAction, actionLabel, onAction, disableOutsideClose },
    hideImage,
  } = usePrincipalImage;

  if (!canAcces) {
    return <>Link Invalido</>;
  }

  return (
    <div className={mainLayoutStyles.container}>
      {alert && (
        <div className={mainLayoutStyles.alertContainer}>
          <Alert
            {...alert}
            onClose={() => {
              hideAlert();
            }}
            onPrimaryClick={alert.onPrimaryClick ?? hideAlert}
            onSecondaryClick={alert.onSecondaryClick ?? hideAlert}
            variant="subtle"
          />
        </div>
      )}

      <ShowImage
        open={imageOpen}
        src={src}
        alt={alt}
        showAction={showAction}
        actionLabel={actionLabel}
        onAction={onAction}
        onClose={hideImage}
        disableOutsideClose={disableOutsideClose}
      />
      <div className={mainLayoutStyles.main}>
        <ExternalAcccesForm />
      </div>



      <LoadingOverlay open={open} message={message} spinnerSize={spinnerSize} />
    </div>
  );
};

export default AccesRequestClient;

