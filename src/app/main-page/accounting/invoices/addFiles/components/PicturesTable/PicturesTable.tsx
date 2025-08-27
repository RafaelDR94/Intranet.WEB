import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Button } from "@/app/components/Button/Button";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import HorizonIncon from "@/assets/icons/navegacion/more-horiz.svg";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import { shallow } from "zustand/shallow"
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { BillingImagesTableMap } from "@/app/mappings/billingimages/billingimages.mapper";
import { useEffect, useState } from "react";
import { Spinner } from "@/app/components/Spinner/Spinner";
import { PicturesTableProps } from "./types";
import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";

const PictureTable: React.FC<PicturesTableProps> = ({ setSelectedPictures }) => {
  const { usePrincipalImage, usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;
  const { showImage, hideImage } = usePrincipalImage;
  const [openRejectPicture, setOpenRejectPicture] = useState<{ state: boolean, row: BillingImagesTable | null }>({ state: false, row: null });
  const isMobile = useIsMobile();

  const opePicture = (row: BillingImagesTable) => {
    showImage({
      src: row.Image,
      alt: 'Ticket',
      showAction: true,
      actionLabel: 'Rechazar Imagen',
      onAction: () => {
        setOpenRejectPicture({ state: true, row: row });
        hideImage();
      },
      disableOutsideClose: false, // si quieres obligar a usar los botones, ponlo en true
    });
  }

  const columnsDesktop: ColumnDefinition<BillingImagesTable>[] = [
    {
      key: "imgIcon" as keyof BillingImagesTable,
      headerRender: () => <span>IMG</span>,
      render: (row) => (
        <Button
          hideIcon
          variant="solid"
          onClick={() => opePicture(row)}
        >
          Ver Imagen
        </Button>
      ),

    },
    {
      key: "deudor",
      label: "DEUDOR",

    },
    {
      key: "proyect",
      label: "PROYECTO",
    },
    {
      key: "dateCreate",
      label: "FECHA DE CREACIÓN",
    },
    {
      key: "addinvioice" as unknown as keyof BillingImagesTable,
      label: "",
      render: (row) => (
        <Button
          hideIcon
          variant="solid"
          onClick={() => setSelectedPictures(row)}
        >
          Ligar Factura
        </Button>
      ),

    },
    {
      key: "acciones" as unknown as keyof BillingImagesTable,
      headerRender: () => <HorizonIncon className="text-green-100" />,
      render: (row) => (
        <Button
          icon={DownloadIcon}
          variant="ghost"
          onClick={() => DownloadFile(row.Image, row.proyect + "-" + row.deudor + ".jpg")}
        />
      ),
      cellClass: "w-10 text-right",
      headerClass: "w-10 text-right",
    }
  ];

  const columnsMobile: ColumnDefinition<BillingImagesTable>[] = [
    {
      key: "imgIcon" as keyof BillingImagesTable,
      headerRender: () => <span>IMÁGEN</span>,
      render: (row) => (
        <Button
          hideIcon
          variant="solid"
          size="xsmall"
          onClick={() => opePicture(row)}
        >
          Ver Imagen
        </Button>
      ),

    },
    {
      key: "proyect",
      label: "PROYECTO",
    },
    {
      key: "acciones" as unknown as keyof BillingImagesTable,
      headerRender: () => <HorizonIncon className="text-green-100" />,
      render: (row) => (
        <Button
          icon={DownloadIcon}
          variant="ghost"
          onClick={() => DownloadFile(row.Image, row.proyect + "-" + row.deudor + ".jpg")}
        />
      ),
      cellClass: "w-10 text-right",
      headerClass: "w-10 text-right",
    }
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  const handleSubmitReject = (values: Record<string, any>) => {
    const payload = {
      billing_image_id: openRejectPicture.row?.billing_image_id ?? "",
      comments: values.comments ?? "",
    };
    setOpenRejectPicture({ state: false, row: null });
    rejectBillingImage(payload)
  };

  const {
    loading,
    billingImages,
    fetchBillingImages,
    rejectBillingImage,
    resetFlags,
    rejecting,
    succesReject,
    error
  } = useBillingImagesStore(
    (s) => ({
      loading: s.loading,
      fetchBillingImages: s.fetchBillingImages,
      billingImages: s.billingImages,
      rejectBillingImage: s.rejectBillingImage,
      rejecting: s.rejecting,
      succesReject: s.succesReject,
      error: s.error,
      resetFlags:s.resetFlags
    }),
    shallow
  )
  useEffect(() => {
    fetchBillingImages(true)
  }, [])

  useEffect(() => {

    if (rejecting) {
      showSpinner({ message: "Espera un momento, se esta rechazando la factua." });
      return;
    }

    hideSpinner();
    if (succesReject) {
      showAlert({
        type: "info",
        title: "Factura Rechazada",
        description: "Se ha rechazado correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (error) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: String(error) ?? "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    resetFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ error, rejecting]);



  if (loading) return <Spinner />

  return (
    <>

      {/* PopUp: Rechazar */}
      <PopUp
        title={"Rechazar Ticket"}
        content={"Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su ticket"}
        open={openRejectPicture.state}
        onClose={() => setOpenRejectPicture({ state: false, row: null })}
      >
        <div >
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
            onSecondaryButtonClick={() => { setOpenRejectPicture({ state: false, row: null }); hideImage(); }}
          />
        </div>
      </PopUp>
      <DataTable
        onCalendarClick={() => console.log("Calendario")}
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
