
import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow"

import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
const usePictureTable = () => {
    const { usePrincipalImage, usePrincipalLoading, usePrincipalAlert } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert;
    const { showImage, hideImage } = usePrincipalImage;
    const [openRejectPicture, setOpenRejectPicture] = useState<{ state: boolean, row: BillingImagesTable | null }>({ state: false, row: null });
    const isMobile = useIsMobile();
    const { currentPagePermissions, user } = useAuth();
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
            resetFlags: s.resetFlags
        }),
        shallow
    )
    const { billingDocuments, fetchBillingDocuments, successPost, successPut } = useBillingDocumentsStore(
        (s) => ({
            billingDocuments: s.billingDocuments,
            fetchBillingDocuments: s.fetchBillingDocuments,
            successPost: s.successPost,
            successPut: s.successPut
        }),
        shallow
    )
    useEffect(() => {
        if (!user?.idEmployee) return
        fetchBillingImages(user.idEmployee, true)
    }, [fetchBillingImages, user?.idEmployee])
    useEffect(() => {
        fetchBillingDocuments(true)
    }, [fetchBillingDocuments])
    useEffect(() => {
        if (!successPost && !successPut) return
        fetchBillingDocuments(true)
        if (user?.idEmployee) {
            fetchBillingImages(user.idEmployee, true)
        }
    }, [fetchBillingDocuments, fetchBillingImages, successPost, successPut, user?.idEmployee])

    const filteredBillingImages = useMemo(() => {
        const linkedImageIds = new Set(
            (billingDocuments ?? [])
                .map((doc) => String(doc?.billingimages_id ?? ""))
                .filter((id) => Boolean(id))
        )

        return (billingImages ?? []).filter((image) => !linkedImageIds.has(image.billing_image_id))
    }, [billingDocuments, billingImages])

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
                description: String(error) || "Hubo un problema desconocido",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
        }
        resetFlags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, rejecting]);
    const handleSubmitReject = (values: Record<string, any>) => {
        const payload = {
            billing_image_id: openRejectPicture.row?.billing_image_id ?? "",
            comments: values.comments ?? "",
        };
        setOpenRejectPicture({ state: false, row: null });
        rejectBillingImage(payload)
    };
    const opePicture = (row: BillingImagesTable) => {
        showImage({
            src: row.Image,
            alt: 'Ticket',
            showAction: currentPagePermissions?.canRejectImage,
            actionLabel: 'Rechazar Imagen',
            onAction: () => {
                setOpenRejectPicture({ state: true, row: row });
                hideImage();
            },
            disableOutsideClose: false, // si quieres obligar a usar los botones, ponlo en true
        });
    }

    return { currentPagePermissions,loading, opePicture, isMobile, billingImages: filteredBillingImages, setOpenRejectPicture, openRejectPicture, handleSubmitReject, hideImage }
}
export default usePictureTable;
