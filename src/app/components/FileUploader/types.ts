
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
  /** Etiqueta que se muestra sobre el botón */
  label?: string;
  /** Texto que se muestra dentro del botón */
  placeholder?: string;
  /** Valor controlado (cuando se resetea a null, limpia el nombre mostrado) */
  value?: File | null;
  /** Callback con el archivo seleccionado */
  onFile: (file: File|null) => void;
  /** Deshabilita el uploader */
  disabled?: boolean;
  /** Clases CSS adicionales para el botón */
  className?: string;
  /** Icono custom para el botón (anula arrowDirection) */
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  /** Archivo inicial a precargar (por URL o base64) */
  initialFile?: InitialFile;
  /** Identificador de pruebas */
  dataTestId?: string;
}
