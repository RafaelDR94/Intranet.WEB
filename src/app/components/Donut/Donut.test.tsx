import React from 'react';
import { render } from '@testing-library/react';
import Donut from './Donut';

describe('Donut', () => {
  it('renders an svg element', () => {
    const { container } = render(<Donut percentage={75} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
