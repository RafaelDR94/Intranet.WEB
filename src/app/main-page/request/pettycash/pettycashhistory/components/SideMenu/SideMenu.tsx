import { useRef } from "react";

import VoucherBlue from "../../../pettycashrequest/components/VoucherBlue/VoucherBlue";
import VoucherPink from "../../../pettycashrequest/components/VoucherPink/VoucherPink";

import { SideMenuProps } from "../types";
import { useSideMenu } from "./hooks/useSideMenu";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

const READ_ONLY_FIELDS: string[] = [
  "monto",
  "asignamentdate",
  "concept",
  "project",
];

const SideMenu = ({
  panelOpen,
  setPanelOpen,
  selected,
  detail,
  isDetailLoading,
  authorizationRequestOpen = false,
  authorizationRequestOptions = [],
  authorizationRequestSelected = "",
  authorizationRequestError = null,
  isRequestingAuthorization = false,
  onRequestAuthorization,
  onCancelAuthorizationRequest,
  onConfirmAuthorizationRequest,
  onAuthorizationRequestChange,
}: SideMenuProps) => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const { user } = useAuth();

  const {
    voucherDataEdit,
    isVoucherPinkVoucher,
    projectCode,
    employeeName,
    certificationDate,
    voucherUuid,
    comments,
    rfcEmisor,
    rfcReceptor,
    subtotal,
    iva,
    formattedAmount,
    isEditableStatus,
    shouldDisableFormInteractions,
    hasAuthorization,
    authorizationStatus,
    authorizationComment,
    authorizerName,
    authorizationStatusToLabelType,
    formatDate,
  } = useSideMenu({ selected, detail, user });

  return (
    <>
      <PopUp
        open={authorizationRequestOpen}
        onClose={onCancelAuthorizationRequest}
        title="Solicitud de autorización"
        content="Selecciona al responsable de la aprobación del vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={onCancelAuthorizationRequest}
        showPrimaryButton
        primaryButtonText={
          isRequestingAuthorization ? "Enviando..." : "Enviar solicitud"
        }
        onPrimaryButtonClick={onConfirmAuthorizationRequest}
      >
        <Select
          label="Autorizador"
          placeholder="Selecciona una opción"
          options={authorizationRequestOptions}
          selected={
            authorizationRequestSelected ? [authorizationRequestSelected] : []
          }
          onChange={(values) => {
            const next = Array.isArray(values) ? values[0] ?? "" : "";
            onAuthorizationRequestChange?.(next);
          }}
        />
        {authorizationRequestError ? (
          <p className="mt-2 text-b4 text-alert-red-100">
            {authorizationRequestError}
          </p>
        ) : null}
      </PopUp>

      <DetailsPanelLayout
        open={panelOpen}
        withinContainer
        zIndex={80}
        renderActions={() => (
          <div className="flex">
            {selected && (
              <Label
                type={selected.statusLabelType}
                text={(selected?.status ?? "").toUpperCase()}
              />
            )}
            {selected?.authorization_evidence && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                disabled={!selected.authorization_evidence}
                onClick={() =>
                  window.open(selected.authorization_evidence!, "_blank")
                }
              />
            )}
            {selected?.xml && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!selected.xml}
                onClick={() => window.open(selected.xml!, "_blank")}
              />
            )}
            {selected?.pdf && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!selected.pdf}
                onClick={() => window.open(selected.pdf!, "_blank")}
              />
            )}
          </div>
        )}
        onClose={() => setPanelOpen(false)}
        leftLabel={selected ? `Usuario: ${employeeName}` : undefined}
        rightLabel={selected ? `Proyecto: ${projectCode}` : undefined}
        actionButton={
          <Button
            size="medium"
            variant="solid"
            hideIcon
            onClick={() => submitRef.current?.()}
            disabled={!isEditableStatus}
          >
            Reenviar
          </Button>
        }
      >
        {selected ? (
          <div className="space-y-4">
            {isDetailLoading && (
              <div className="text-gray-70 text-b4">Cargando detalle...</div>
            )}


            {hasAuthorization ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-gray-90 text-b4 font-medium">
                  <span>RESPONSABLE:</span>
                  <span className="text-gray-90 text-b3 font-regular">
                    {authorizerName}
                  </span>
                  <span className="ml-2 text-gray-90 text-b4 font-medium">
                    ESTATUS:
                  </span>
                  <Label
                    type={authorizationStatusToLabelType(authorizationStatus)}
                    text={authorizationStatus}
                  />
                </div>
                <div className="text-gray-90 text-b4 font-medium">
                  COMENTARIO:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {authorizationComment || "—"}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <Button
                  size="medium"
                  variant="outline"
                  hideIcon
                  disabled={isDetailLoading}
                  data-testid="request-authorization-button"
                  onClick={() => {
                    if (onRequestAuthorization && selected) {
                      onRequestAuthorization(selected);
                    }
                  }}
                >
                  Solicitar autorización
                </Button>
              </div>
            )}

            <div className="text-gray-90 text-s1 font-semibold">
              {voucherUuid || "—"}
            </div>

            <div className="text-gray-90 text-b4 font-medium">
              FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {formatDate(certificationDate) || "—"}
              </span>
            </div>

            <div className="text-gray-90 text-b4 font-medium">
              RFC EMISOR:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {rfcEmisor || "—"}
              </span>
            </div>

            <div className="text-gray-90 text-b4 font-medium">
              RFC RECEPTOR:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {rfcReceptor || "—"}
              </span>
            </div>

            <div className="text-gray-90 text-b4 font-medium">
              CONCEPTO:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {detail?.concept ?? selected.description.name ?? "—"}
              </span>
            </div>


            <div className="text-gray-90 text-b4 font-medium">
              <div className="flex flex-col items-end">
                <p>
                  SUBTOTAL:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    ${subtotal}
                  </span>
                </p>
                <p>
                  (IVA 16%):&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    ${iva}
                  </span>
                </p>
                <p>
                  TOTAL:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {formattedAmount}
                  </span>
                </p>
              </div>
            </div>

            {comments && (
              <div className="space-y-1">
                <div className="text-gray-90 text-b4 font-medium">
                  Comentarios:
                </div>
                <p className="text-b4 p-2 font-medium text-gray-50">
                  {comments || "—"}
                </p>
              </div>
            )}

            <div>
              <div className="text-gray-90 text-b4 font-medium">
                Editar documento:
              </div>

              {isVoucherPinkVoucher ? (
                <div>
                  <VoucherPink
                    mode="edit"
                    responsiveLayoutMatrix={{
                      sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                      md: [[10], [10], [10], [10], [5, 5], [10]],
                      lg: [[10], [10], [10], [10], [5, 5], [10]],
                    }}
                    dataEdit={voucherDataEdit}
                    startDisabled={shouldDisableFormInteractions}
                    readOnlyFieldNames={READ_ONLY_FIELDS}
                    externalSubmitRef={submitRef}
                  />
                </div>
              ) : (
                <div>
                  <VoucherBlue
                    mode="edit"
                    responsiveLayoutMatrix={{
                      sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                      md: [
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                      ],
                      lg: [
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                      ],
                    }}
                    dataEdit={voucherDataEdit}
                    startDisabled={shouldDisableFormInteractions}
                    readOnlyFieldNames={READ_ONLY_FIELDS}
                    externalSubmitRef={submitRef}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-70 text-b3">
            Selecciona un registro para ver el detalle.
          </div>
        )}
      </DetailsPanelLayout>
    </>
  );
};

export default SideMenu;
