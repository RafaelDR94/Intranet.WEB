import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import SignatureBox from './SignatureBox';

const SAMPLE_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23d1fae5"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="%2302554b">Firma</text></svg>';

describe('SignatureBox', () => {
  it('muestra un marcador de sin firma cuando no hay imagen', () => {
    render(<SignatureBox title="Firma pendiente" />);

    expect(screen.getByText('(sin firma)')).toBeInTheDocument();
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('renderiza la imagen de la firma cuando imageUrl está definido', () => {
    render(<SignatureBox title="Firma completa" imageUrl={SAMPLE_SIGNATURE} />);

    expect(screen.getByText('Firma completa')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('muestra leyendas cuando se proporcionan captionTop y captionBottom', () => {
    render(
      <SignatureBox
        title="Responsable"
        captionTop="Responsable de proyecto"
        captionBottom="Firmado el 23 de abril de 2025"
      />,
    );

    expect(screen.getByText('Responsable de proyecto')).toBeInTheDocument();
    expect(screen.getByText('Firmado el 23 de abril de 2025')).toBeInTheDocument();
  });
});
