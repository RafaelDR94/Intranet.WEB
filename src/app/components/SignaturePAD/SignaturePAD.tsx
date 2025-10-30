'use client';

import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { SignaturePadProps } from './types';
import { containerCls, canvasWrapperCls } from './styles';

import { Button } from '@/app/components/Button/Button';
import useSignaturePad from './hooks/useSignaturePad';
import { useIsMobile } from '../DataTable/components/DataTableLayout/hooks/useMediaQuery';// ⚙️ tu hook de detección

const SignaturePad: React.FC<SignaturePadProps> = (props) => {
  const { sigCanvasRef, wrapperRef, size, handleSave, handleClear } = useSignaturePad(props);
  const isMobile = useIsMobile(); // ✅ Detectamos si es mobile

  return (
    <div className={containerCls}>
      <h3 className="text-gray-600 text-label font-medium mb-1">Firma Digital</h3>

      <div ref={wrapperRef} className={`${canvasWrapperCls} h-[300px]`}>
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
        <div className="flex justify-between items-center w-full mt-4">
          <div>
            <Button variant="outline" onClick={props?.onCancel} hideIcon>
              Cancelar
            </Button>
          </div>
          <div className="flex gap-3">
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
