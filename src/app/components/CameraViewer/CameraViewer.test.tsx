import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid="arrow-right" {...props} />,
}));
vi.mock('@/assets/icons/navegacion/arrow-up.svg', () => ({
  default: (props: any) => <svg data-testid="arrow-up" {...props} />,
}));
vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  default: (props: any) => <svg data-testid="cancel" {...props} />,
}));

const useCameraViewerMock = vi.fn();
vi.mock('./hooks/useCameraViewer', () => ({
  useCameraViewer: () => useCameraViewerMock(),
}));

import { CameraViewer } from './CameraViewer';

const baseReturn = () => ({
  videoRef: createRef<HTMLVideoElement>(),
  facingMode: 'environment' as const,
  isLoading: false,
  error: null as string | null,
  toggleFacingMode: vi.fn(),
  capturePhoto: vi.fn(),
  closeStream: vi.fn(),
});

describe('CameraViewer', () => {
  beforeEach(() => {
    useCameraViewerMock.mockReturnValue(baseReturn());
  });

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(
      <CameraViewer isOpen={false} onClose={vi.fn()} onCapture={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('muestra los controles principales cuando esta abierto', () => {
    useCameraViewerMock.mockReturnValueOnce(baseReturn());

    render(<CameraViewer isOpen onClose={vi.fn()} onCapture={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Activando camara...')).not.toBeInTheDocument();
    expect(screen.getByText('Cerrar')).toBeInTheDocument();
    expect(screen.getByText('Cambiar camara')).toBeInTheDocument();
    expect(screen.getByText('Capturar')).toBeInTheDocument();
  });

  it('llama a toggleFacingMode cuando se presiona "Cambiar camara"', () => {
    const mocked = baseReturn();
    useCameraViewerMock.mockReturnValueOnce(mocked);

    render(<CameraViewer isOpen onClose={vi.fn()} onCapture={vi.fn()} />);

    fireEvent.click(screen.getByText('Cambiar camara'));
    expect(mocked.toggleFacingMode).toHaveBeenCalled();
  });

  it('dispara onClose y closeStream al presionar cerrar', () => {
    const mocked = baseReturn();
    useCameraViewerMock.mockReturnValueOnce(mocked);
    const onClose = vi.fn();

    render(<CameraViewer isOpen onClose={onClose} onCapture={vi.fn()} />);

    fireEvent.click(screen.getByText('Cerrar'));
    expect(mocked.closeStream).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('captura la imagen y notifica al callback', async () => {
    const file = new File(['data'], 'capture.png', { type: 'image/png' });
    const mocked = {
      ...baseReturn(),
      capturePhoto: vi.fn().mockResolvedValue(file),
    };
    useCameraViewerMock.mockReturnValueOnce(mocked);
    const onCapture = vi.fn();
    const onClose = vi.fn();

    render(<CameraViewer isOpen onClose={onClose} onCapture={onCapture} />);

    fireEvent.click(screen.getByText('Capturar'));

    await waitFor(() => expect(onCapture).toHaveBeenCalledWith(file));
    expect(mocked.closeStream).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('muestra mensaje de carga cuando isLoading es true', () => {
    const mocked = { ...baseReturn(), isLoading: true };
    useCameraViewerMock.mockReturnValueOnce(mocked);

    render(<CameraViewer isOpen onClose={vi.fn()} onCapture={vi.fn()} />);

    expect(screen.getByText('Activando camara...')).toBeInTheDocument();
  });

  it('renderiza el mensaje de error cuando existe', () => {
    const mocked = { ...baseReturn(), error: 'Algo fallo' };
    useCameraViewerMock.mockReturnValueOnce(mocked);

    render(<CameraViewer isOpen onClose={vi.fn()} onCapture={vi.fn()} />);

    expect(screen.getByText('Algo fallo')).toBeInTheDocument();
  });
});
