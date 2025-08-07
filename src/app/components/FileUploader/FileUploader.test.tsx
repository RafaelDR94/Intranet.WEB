// src/app/components/FileUploader/FileUploader.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ─── Mocks para TODOS los SVGs que usa FileUploader ────────────────────────────
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid="icon-right" {...props} />,
}));
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="icon-up" {...props} />,
}));
vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  default: (props: any) => <svg data-testid="icon-cancel" {...props} />,
}));
// **Mock** para upload.svg (el icono por defecto de FileUploader)
vi.mock('@/assets/icons/acciones/upload.svg', () => ({
  default: (props: any) => <svg data-testid="upload-icon" {...props} />,
}));

import { FileUploader } from './FileUploader';

describe('FileUploader component', () => {
  it('renderiza el botón con label y oculta el input file', () => {
    const onFile = vi.fn();
    const { container } = render(
      <FileUploader accept=".xml" label="Archivo" placeholder="Subir XML" onFile={onFile} />
    );

    // Comprueba el texto del botón
    expect(screen.getByRole('button')).toHaveTextContent('Subir XML');

    // El <input type="file" /> existe pero está oculto
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveClass('hidden');
  });

  it('invoca onFile al seleccionar un archivo', () => {
    const onFile = vi.fn();
    const { container } = render(
      <FileUploader accept=".xml" label="Archivo" placeholder="Subir XML" onFile={onFile} />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hola'], 'factura.xml', { type: 'text/xml' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('no dispara el selector cuando está disabled', () => {
    const onFile = vi.fn();
    render(
      <FileUploader
        accept=".xml"
        label="Archivo"
        placeholder="Subir XML"
        onFile={onFile}
        disabled
      />
    );

    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onFile).not.toHaveBeenCalled();
  });

  it('usa el icono por defecto (upload.svg) cuando no se pasa prop icon', () => {
    render(<FileUploader accept=".xml" label="Archivo" placeholder="Subir XML" onFile={() => {}} />);
    // Ahora el upload.svg está mockeado como <svg data-testid="upload-icon" />
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
  });

  it('permite pasar un icon custom y lo renderiza', () => {
    const CustomIcon = (props: any) => <svg data-testid="custom-icon" {...props} />;
    const onFile = vi.fn();
    render(
      <FileUploader
        accept=".xml"
        label="Archivo"
        placeholder="Subir XML"
        onFile={onFile}
        icon={CustomIcon}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('muestra un archivo inicial y llama a onFile', async () => {
    const onFile = vi.fn();
    render(
      <FileUploader
        accept=".txt"
        label="Archivo"
        placeholder="Subir archivo"
        onFile={onFile}
        initialFile={{
          name: 'inicial.txt',
          base64: 'data:text/plain;base64,aW5pY2lhbA==',
        }}
      />
    );

    expect(await screen.findByText('inicial.txt')).toBeInTheDocument();
    await waitFor(() => expect(onFile).toHaveBeenCalled());
  });
});
