
import { SVGProps } from 'react';

/**
 * Información de un archivo inicial a mostrar en el uploader.
 */
export interface InitialFile {
  /** Nombre del archivo inicial */
  name: string;
  /** URL del archivo inicial */
  url?: string;
  /** Cadena base64 (puede incluir prefijo data:) */
  base64?: string;
}

export interface FileUploaderProps {
  /** Acepta extensiones válidas, p.ej.: ".xml,.pdf" */
  accept: string;
  /** Texto a mostrar en el botón */
  buttonLabel: string;
  /** Callback con el archivo seleccionado */
  onFile: (file: File) => void;
  /** Deshabilita el uploader */
  disabled?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Icono custom para el botón (anula arrowDirection) */
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  /** Archivo inicial a precargar (por URL o base64) */
  initialFile?: InitialFile;
}