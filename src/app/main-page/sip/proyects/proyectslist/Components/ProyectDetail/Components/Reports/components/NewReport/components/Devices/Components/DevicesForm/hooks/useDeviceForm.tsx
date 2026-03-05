"use client"
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportDevicesStore from '@/app/stores/useReportDevicesStore/useReportDevicesStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import useQuery from '@/app/hooks/useQuery/useQuery';
type Values = { brand: string; model: string; serialnumber: string; };

const emptyValues: Values = { brand: '', model: '', serialnumber: '' };

const resolveExternalView = (device?: DeviceExternalView | null) => {
    const raw = (device as any)?.device_external_view ?? device ?? {};
    return {
        brand: raw?.brand ? String(raw.brand) : '',
        model: raw?.model ? String(raw.model) : '',
        serialnumber: raw?.serialnumber ? String(raw.serialnumber) : '',
    };
};

export function useDeviceForm(opts: { deviceId: string | null; onSuccess: () => void }) {
    const { deviceId, onSuccess } = opts;
    const submitRef = useRef<() => void | Promise<void>>(null)

    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert, hideAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;

    const { report } = useReportBuilderStore((s) => ({ report: s.report }), shallow);
    const { all } = useQuery();
    const locationId = report?.location?.id ? String(report.location.id) : '';
    const projectId = useMemo(() => {
        const raw = all.id;
        if (Array.isArray(raw)) return raw[0] ?? '';
        if (raw == null) return '';
        return String(raw);
    }, [all]);


    const {
        locationDevices,
        devices,
        createDevice, updateDevice,
        creating, updating,
        successPost, successPut, error,
        resetFlags
    } = useReportDevicesStore(
        (s) => ({
            locationDevices: s.locationDevices,
            devices: s.devices,
            createDevice: s.createDevice,
            updateDevice: s.updateDevice,
            creating: s.creating,
            updating: s.updating,
            successPost: s.successPost,
            successPut: s.successPut,
            error: s.error,
            resetFlags: s.resetFlags,
        }),
        shallow
    );

    // valores iniciales
    const initialValues: Values = useMemo(() => {
        if (!deviceId) return emptyValues;

        const rowFromLocation = locationDevices.find((d) =>
            String((d as any)?.id ?? (d as any)?.device_external_view?.id) === deviceId
        );

        if (rowFromLocation) {
            return resolveExternalView((rowFromLocation as any)?.device_external_view ?? rowFromLocation);
        }

        const rowFromDevices = devices.find((d) => String((d as any)?.id ?? (d as any)?.device_external_view?.id) === deviceId);

        return rowFromDevices ? resolveExternalView(rowFromDevices) : emptyValues;
    }, [deviceId, locationDevices, devices]);

    const [values, setValues] = useState<Values>(initialValues);
    const [isValid, setIsValid] = useState(false);

    // si cambia el target, reseteamos valores
    useEffect(() => { setValues(initialValues); setIsValid(false); }, [initialValues]);

    // spinner
    useEffect(() => {
        const message = updating ? 'Actualizando dispositivo...' : creating ? 'Guardando dispositivo...' : null;
        if (message) { showSpinner({ message }); return; }
        hideSpinner();
    }, [creating, updating, showSpinner, hideSpinner]);
    useEffect(() => () => hideSpinner(), [hideSpinner]);


    const handleSubmit = async (v: Record<string, any>) => {
        if (!locationId || !projectId) return;

        const payloadBase = {
            brand: v.brand.trim(),
            model: v.model.trim(),
            serialnumber: v.serialnumber.trim(),
            idLocation: locationId,
            idProyect: projectId,
        };

        if (deviceId) {
            await updateDevice({ ...payloadBase, id: deviceId });
        } else {
            await createDevice(payloadBase);
        }
    };

    // resultado/errores
    useEffect(() => {
        if (!successPost && !successPut && !error) return;

        const label = [values.brand, values.model, values.serialnumber].map(x => x?.trim()).filter(Boolean).join(' ') || 'equipo';

        if (successPost) {
            showAlert({ type: 'success', variant: 'filled', title: 'Equipo guardado', description: `Se guardó correctamente el ${label}.`, autoCloseMs: 3000, showPrimaryButton: false, showSecondaryButton: false, onClose: hideAlert });
            onSuccess();
        }
        if (successPut) {
            showAlert({ type: 'info', variant: 'filled', title: 'Equipo actualizado', description: `Se actualizó correctamente el ${label}.`, autoCloseMs: 3000, showPrimaryButton: false, showSecondaryButton: false, onClose: hideAlert });
            onSuccess();
        }
        if (error) {
            showAlert({ type: 'error', variant: 'filled', title: 'No fue posible completar la acción', description: String(error), autoCloseMs: 4000, showPrimaryButton: false, showSecondaryButton: false, onClose: hideAlert });
        }
        resetFlags();
    }, [successPost, successPut, error, values, onSuccess, hideAlert, resetFlags, showAlert]);

    const title = deviceId ? 'Editar equipo' : 'Registrar equipo';
    const description = deviceId
        ? 'Actualiza la información del dispositivo asociado al reporte.'
        : 'Completa la información del dispositivo para asociarlo al reporte.';

    return {
        values,
        setValues,
        isValid,
        setIsValid,
        submitting: creating || updating,
        title,
        description,
        submitRef,
        handleSubmit,
    };
}
