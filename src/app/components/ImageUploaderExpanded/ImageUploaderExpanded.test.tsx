import { fireEvent, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/icons/Fotos y Videos/camera.svg', () => ({
  default: (props: any) => <svg data-testid="camera-icon" {...props} />,
}));

vi.mock('@/app/components/Button/Button', () => {
  const Button = ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  );
  return { Button, default: Button };
});

const cameraViewerSpy = vi.fn();
vi.mock('@/app/components/CameraViewer/CameraViewer', () => ({
  CameraViewer: (props: any) => {
    cameraViewerSpy(props);
    return <div data-testid="camera-viewer" />;
  },
}));

vi.mock('./hooks/useImageUploaderExpanded', () => ({
  useImageUploaderExpanded: vi.fn(),
}));

import { ImageUploaderExpanded } from './ImageUploaderExpanded';
import { useImageUploaderExpanded } from './hooks/useImageUploaderExpanded';

const hookSpy = vi.mocked(useImageUploaderExpanded);

const createHookReturn = () => {
  const inputRef = createRef<HTMLInputElement>();
  const containerRef = createRef<HTMLDivElement>();
  return {
    inputRef,
    handleButtonClick: vi.fn(),
    handleChange: vi.fn(),
    isDragging: false,
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    displayText: 'Arrastra o selecciona',
    containerRef,
    isCameraOpen: false,
    openCamera: vi.fn(),
    closeCamera: vi.fn(),
    handleCaptureFromCamera: vi.fn(),
  };
};

describe('ImageUploaderExpanded', () => {
  beforeEach(() => {
    hookSpy.mockReset();
    cameraViewerSpy.mockReset();
    hookSpy.mockReturnValue(createHookReturn());
  });

  it('muestra label, helper y boton con el texto configurado', () => {
    render(
      <ImageUploaderExpanded
        label="Selecciona imagen"
        onImage={vi.fn()}
        buttonLabel="Subir"
        placeholder="Arrastra"
      />
    );

    expect(screen.getByText('Selecciona imagen')).toBeInTheDocument();
    expect(screen.getByText('Arrastra o selecciona')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subir' })).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
  });

  it('activa la camara al presionar el boton de icono', () => {
    const hookReturn = createHookReturn();
    hookSpy.mockReturnValueOnce(hookReturn);

    render(<ImageUploaderExpanded label="Imagen" onImage={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('Abrir camara'));
    expect(hookReturn.openCamera).toHaveBeenCalled();
  });

  it('propaga el evento change del input hacia el hook', () => {
    const hookReturn = createHookReturn();
    hookSpy.mockReturnValueOnce(hookReturn);

    const { container } = render(<ImageUploaderExpanded label="test" onImage={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['data'], 'image.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(hookReturn.handleChange).toHaveBeenCalled();
  });

  it('renderiza CameraViewer con los flags y etiquetas correctas', () => {
    const hookReturn = { ...createHookReturn(), isCameraOpen: true };
    hookSpy.mockReturnValueOnce(hookReturn);

    render(
      <ImageUploaderExpanded
        label="Imagen"
        onImage={vi.fn()}
        cameraLabels={{ capture: 'Tomar', switchCamera: 'Cambiar', close: 'Cerrar todo' }}
      />
    );

    expect(cameraViewerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        captureButtonLabel: 'Tomar',
        switchButtonLabel: 'Cambiar',
        closeButtonLabel: 'Cerrar todo',
      })
    );
  });

  it('aplica estilos de arrastre cuando isDragging es true', () => {
    const hookReturn = { ...createHookReturn(), isDragging: true };
    hookSpy.mockReturnValueOnce(hookReturn);

    const { container } = render(<ImageUploaderExpanded label="Imagen" onImage={vi.fn()} />);
    const dropzone = container.querySelector('div[class*="border"]');
    expect(dropzone?.className).toContain('border-blue-50');
  });

  it('integra el uploader con la galeria y habilita quitar solo con imagenes seleccionadas', () => {
    const hookReturn = {
      ...createHookReturn(),
      images: Array.from({ length: 6 }, (_, index) => ({
        id: `image-${index}`,
        name: `Imagen ${index + 1}`,
        url: `https://files.example/${index}.png`,
        selected: index === 0,
      })),
      toggleImage: vi.fn(),
      clearImages: vi.fn(),
    };
    hookSpy.mockReturnValueOnce(hookReturn);

    const { container } = render(
      <ImageUploaderExpanded
        dataTestId="integrated-gallery"
        galleryLayout="integrated"
        multiple
        onImage={vi.fn()}
      />,
    );

    expect(screen.getByTestId('integrated-gallery')).toHaveClass('lg:grid-cols-5');
    expect(screen.getByLabelText('Seleccionar Imagen 1')).toHaveClass('top-2', 'right-2');
    expect(screen.getByRole('button', { name: 'Quitar imágenes' })).toBeEnabled();
    expect(container.querySelectorAll('img')).toHaveLength(6);

    fireEvent.click(screen.getByLabelText('Seleccionar Imagen 1'));
    expect(hookReturn.toggleImage).toHaveBeenCalledWith('image-0');
  });

  it('deshabilita quitar imagenes cuando no hay seleccion', () => {
    hookSpy.mockReturnValueOnce({
      ...createHookReturn(),
      images: [{ id: 'image-1', name: 'Imagen 1', selected: false }],
      toggleImage: vi.fn(),
      clearImages: vi.fn(),
    });

    render(
      <ImageUploaderExpanded galleryLayout="integrated" multiple onImage={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Quitar imágenes' })).toBeDisabled();
  });
});
