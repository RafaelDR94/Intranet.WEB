// src/app/components/FileUploaderExpanded/FileUploaderExpanded.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { FileUploaderExpanded } from './FileUploaderExpanded';

const setup = (props: Partial<React.ComponentProps<typeof FileUploaderExpanded>> = {}) => {
  const onFile = vi.fn();
  const utils = render(
    <FileUploaderExpanded
      label="Sube archivo"
      accept=".pdf"
      onFile={onFile}
      {...props}
    />
  );
  return { onFile, ...utils };
};

describe('FileUploaderExpanded', () => {
  it('renderiza con label y placeholder por defecto', () => {
    setup();
    expect(screen.getByText('Sube archivo')).toBeInTheDocument();
    expect(screen.getByText(/Arrastra y suelta/i)).toBeInTheDocument();
  });

  it('abre selector al hacer click en el botón', () => {
    setup();
    const button = screen.getByRole('button', { name: /Seleccionar archivo/i });
    expect(button).toBeEnabled();
  });

  it('muestra el nombre del archivo (reemplaza placeholder) tras seleccionar', () => {
    const { container } = setup();
    // input hidden: búscalo por selector, no por role
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.queryByText(/Arrastra y suelta/i)).not.toBeInTheDocument();
  });

  it('cambia a estilo de arrastre al hacer dragover y vuelve al salir', () => {
    setup();
    const dropzone = screen.getByText(/Arrastra y suelta/i).parentElement!;
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toMatch(/bg-blue-10/);
    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).toMatch(/bg-white-100/);
  });

it('dispara onFile al soltar un archivo válido', () => {
  const { onFile, container } = setup({ accept: '.pdf' });

  const dropzone = screen.getByText(/Arrastra y suelta/i).parentElement!;
  const file = new File(['dummy'], 'a.pdf', { type: 'application/pdf' });

  // 1) localiza el input file
  const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

  // 2) crea un FileList-like para el getter
  const fileListLike = {
    0: file,
    length: 1,
    item: (i: number) => (i === 0 ? file : null),
    // opcional: for-of support
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as unknown as FileList;

  // 3) sobreescribe la propiedad files del input para que:
  //    - el setter no valide tipo
  //    - el getter devuelva nuestro fileListLike
  Object.defineProperty(fileInput, 'files', {
    configurable: true,
    get: () => fileListLike,
    set: (_: any) => {}, // no-op para evitar TypeError del setter nativo
  });

  // 4) dispara el drop (el hook hará input.files = dt.files y dispatchEvent('change'))
  fireEvent.drop(dropzone, {
    preventDefault: () => {},
    dataTransfer: { files: [file] },
  } as unknown as DragEvent);

  // 5) assert
  expect(onFile).toHaveBeenCalledWith(expect.any(File));
});

  it('envía null si el archivo no coincide con accept', () => {
    const { onFile } = setup({ accept: '.pdf' });
    const dropzone = screen.getByText(/Arrastra y suelta/i).parentElement!;
    const wrong = new File(['x'], 'a.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: [wrong] },
    } as unknown as DragEvent);

    expect(onFile).toHaveBeenCalledWith(null);
  });
});
