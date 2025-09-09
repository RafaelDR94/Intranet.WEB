import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import Avatar from './Avatar';

describe('Avatar', () => {
  it('renderiza las iniciales cuando no hay imagen', () => {
    render(<Avatar initials="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('no muestra indicador online cuando online es false', () => {
    const { container } = render(<Avatar initials="AB" online={false} />);
    const indicator = container.querySelector('.bg-alert-green-100');
    expect(indicator).toBeNull();
  });
});
