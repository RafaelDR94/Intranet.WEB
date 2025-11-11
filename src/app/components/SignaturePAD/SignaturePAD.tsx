'use client';

import React from 'react';
import clsx from 'clsx';
import SignatureCanvas from 'react-signature-canvas';
import { SignaturePadProps } from './types';
import { containerCls, canvasWrapperCls } from './styles';

import { Button } from '@/app/components/Button/Button';
import useSignaturePad from './hooks/useSignaturePad';
import { useIsMobile } from '../DataTable/components/DataTableLayout/hooks/useMediaQuery';// ⚙️ tu hook de detección

const SignaturePad: React.FC<SignaturePadProps> = (props) => {
  const { sigCanvasRef, wrapperRef, size, handleSave, handleClear } = useSignaturePad(props);
  const isMobile = useIsMobile(); // ✅ Detectamos si es mobile
  const { fullScreen } = props;

  return (
    <div
      className={clsx(
        containerCls,
        fullScreen &&
          'max-h-[90vh] overflow-hidden rounded-2xl shadow-lg sm:p-8 md:p-10'
      )}
    >
      <h3 className="text-gray-600 text-label font-medium mb-1">Firma Digital</h3>

      <div
        ref={wrapperRef}
        className={clsx(
          canvasWrapperCls,
          fullScreen ? 'h-[360px] md:h-[420px]' : 'h-[300px]'
        )}
      >
        <SignatureCanvas
          ref={sigCanvasRef}
          canvasProps={{
            width: size.width,
            height: size.height,
            className: 'bg-white-70',
          }}
        />
      </div>

      {/* Botones */}
      {!isMobile ? (
        // 💻 Desktop layout (horizontal)
        <div className={clsx('flex w-full items-center justify-between gap-3', fullScreen ? 'mt-6' : 'mt-4')}>
          <div className="flex gap-3">
            <Button variant="outline" onClick={props?.onCancel} hideIcon>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleClear} hideIcon>
              Borrar Firma
            </Button>
            <Button variant="solid" onClick={handleSave} hideIcon>
              Guardar Firma
            </Button>
          </div>
        </div>
      ) : (
        // 📱 Mobile layout (Guardar Firma abajo)
        <div className="flex flex-col gap-3 mt-4 w-full">
          <div className="flex justify-between gap-3">
            <Button className="flex-1" variant="outline" onClick={props?.onCancel} hideIcon>
              Cancelar
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleClear} hideIcon>
              Borrar Firma
            </Button>
          </div>
          <Button className="w-full" variant="solid" onClick={handleSave} hideIcon>
            Guardar Firma
          </Button>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
