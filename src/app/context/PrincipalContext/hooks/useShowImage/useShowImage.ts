'use client';
import { useCallback, useMemo, useState } from 'react';

export type ImageViewerState = {
  open: boolean;
  src?: string;
  alt?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  disableOutsideClose?: boolean;
};

export type UseShowImage = {
  /** Estado público (para render en layout) */
  state: ImageViewerState;
  /** Abrir/mostrar imagen */
  showImage: (opts: Omit<ImageViewerState, 'open'>) => void;
  /** Cerrar/ocultar imagen */
  hideImage: () => void;
};

const useShowImage = (): UseShowImage => {
  const [state, setState] = useState<ImageViewerState>({ open: false });

  const showImage = useCallback<UseShowImage['showImage']>((opts) => {
    setState({ open: true, ...opts });
  }, []);

  const hideImage = useCallback(() => {
    setState(s => ({ ...s, open: false }));
  }, []);

  return useMemo(() => ({ state, showImage, hideImage }), [state, showImage, hideImage]);
};

export default useShowImage;
