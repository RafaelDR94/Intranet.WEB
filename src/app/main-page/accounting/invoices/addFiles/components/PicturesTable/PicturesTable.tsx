import React from "react";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Button } from "@/app/components/Button/Button";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import HorizonIncon from "@/assets/icons/navegacion/more-horiz.svg";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { BillingImagesTableMap } from "@/app/mappings/billingimages/billingimages.mapper";
import LinkIcon from "@/assets/icons/Other/Other/link.svg";
import ImgeIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { Spinner } from "@/app/components/Spinner/Spinner";
import { PicturesTableProps } from "./types";
import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import usePictureTable from "./usePictureTable";

const PictureTable: React.FC<PicturesTableProps> = ({
  setSelectedPictures,
}) => {
  const {
    loading,
    opePicture,
    isMobile,
    billingImages,
    setOpenRejectPicture,
    openRejectPicture,
    handleSubmitReject,
    hideImage,
    currentPagePermissions,
  } = usePictureTable();

  const columnsDesktop: ColumnDefinition<BillingImagesTable>[] = [
    {
      key: "requisitionkey",
      label: "CÓDIGO SOLICITUD",
    },
    {
      key: "proyect",
      label: "PROYECTO",
    },
    {
      key: "categoryName",
      label: "CATEGORÍA",
    },
    {
      key: "descriptionName",
      label: "DESCRIPCIÓN",
    },
    {
      key: "dateCreate",
      label: "FECHA DE CREACIÓN",
    },

    {
      key: "acciones" as unknown as keyof BillingImagesTable,
      headerRender: () => <HorizonIncon className="text-green-100" />,
      render: (row) => (
        <div className="flex">
          <Button
            icon={ImgeIcon}
            variant="ghost"
            onClick={() => opePicture(row)}
          />
          {currentPagePermissions?.canLinkImage &&
            currentPagePermissions?.canAddDocuments && (
              <Button
                icon={LinkIcon}
                variant="ghost"
                onClick={() => setSelectedPictures(row)}
              />
            )}

          <Button
            icon={DownloadIcon}
            variant="ghost"
            onClick={() =>
              DownloadFile(row.Image, row.proyect + "-" + row.deudor + ".jpg")
            }
          />
        </div>
      ),
      cellClass: "w-40 text-center",
      headerClass: "w-40 text-right",
    },
  ];

  const columnsMobile: ColumnDefinition<BillingImagesTable>[] = [
    {
      key: "proyect",
      label: "PROYECTO",
    },
    {
      key: "acciones" as unknown as keyof BillingImagesTable,
      headerRender: () => <HorizonIncon className="text-green-100" />,
      render: (row) => (
        <div className="flex">
          <Button
            icon={ImgeIcon}
            variant="ghost"
            onClick={() => opePicture(row)}
          />

          <Button
            icon={LinkIcon}
            variant="ghost"
            onClick={() => setSelectedPictures(row)}
          />
          <Button
            icon={DownloadIcon}
            variant="ghost"
            onClick={() =>
              DownloadFile(row.Image, row.proyect + "-" + row.deudor + ".jpg")
            }
          />
        </div>
      ),
    },
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  if (!currentPagePermissions?.canSeeTicketsList) return;
  if (loading) return <Spinner />;

  return (
    <>
      {/* PopUp: Rechazar */}
      <PopUp
        title={"Rechazar Ticket"}
        content={
          "Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su ticket"
        }
        open={openRejectPicture.state}
        onClose={() => setOpenRejectPicture({ state: false, row: null })}
      >
        <div>
          <DynamicForm
            fields={[
              {
                type: "textarea",
                name: "comments",
                label: "Comentarios:",
                value: "",
                placeholder: "Agregar comentario",
                validations: [{ type: "required" }],
                className: "bg-white",
                rows: 2,
              },
            ]}
            submitLabel="Rechazar"
            secondaryButtonLabel="Cancelar"
            onSubmit={handleSubmitReject}
            onSecondaryButtonClick={() => {
              setOpenRejectPicture({ state: false, row: null });
              hideImage();
            }}
          />
        </div>
      </PopUp>
      <DataTable
        showDownloadTable
        showButton={false}
        enableInternalSearch={true}
        dateKey="dateCreate"
        tables={[
          {
            columns,
            data: BillingImagesTableMap(billingImages) ?? [],
            enableSelection: true,
            title: "Imágenes de Tickets",
            enableCollaps: true,
            defaultSortKey: "dateCreate",
            defaultSortDirection: "desc",
          },
        ]}
      />
    </>
  );
};
export default PictureTable;
