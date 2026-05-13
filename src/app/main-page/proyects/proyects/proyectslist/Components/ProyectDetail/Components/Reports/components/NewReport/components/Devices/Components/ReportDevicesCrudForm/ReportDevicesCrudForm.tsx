'use client';

import React, { useEffect, useRef } from 'react';

import useQuery from '@/app/hooks/useQuery/useQuery';
import DevicesForm from '@/app/main-page/proyects/components/DevicesCrud/components/DevicesForm';

import { NEW_DEVICE_ID } from '../../hooks/useDevices';

type ReportDevicesCrudFormProps = {
  selectedRowId: string | null;
  onClose: () => void;
  onSaved?: () => void;
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const ReportDevicesCrudForm = ({
  selectedRowId,
  onClose,
}: ReportDevicesCrudFormProps) => {
  const { all, updateQuery } = useQuery();
  const openedRef = useRef(false);

  const crudView = getSingleValue(all.crudView);
  const crudMode = getSingleValue(all.crudMode);
  const crudItemId = getSingleValue(all.crudItemId);
  const type = getSingleValue(all.type);

  const expectedMode = selectedRowId === NEW_DEVICE_ID ? 'create' : 'edit';
  const expectedItemId = selectedRowId && selectedRowId !== NEW_DEVICE_ID ? selectedRowId : null;

  useEffect(() => {
    openedRef.current = false;
  }, [selectedRowId]);

  useEffect(() => {
    if (!selectedRowId) return;

    const queryMatches =
      crudView === 'form' &&
      crudMode === expectedMode &&
      (expectedItemId ? crudItemId === expectedItemId : !crudItemId) &&
      type === 'complete';

    if (queryMatches) {
      openedRef.current = true;
      return;
    }

    updateQuery({
      crudView: 'form',
      crudMode: expectedMode,
      crudItemId: expectedItemId,
      type: 'complete',
    });
  }, [crudItemId, crudMode, crudView, expectedItemId, expectedMode, selectedRowId, type, updateQuery]);

  useEffect(() => {
    if (!selectedRowId || !openedRef.current) return;
    if (crudView === 'form') return;

    onClose();
  }, [crudView, onClose, selectedRowId]);

  if (!selectedRowId) return null;

  return <DevicesForm scope="project" />;
};

export default ReportDevicesCrudForm;
