import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Tab } from './Tab';

// Mock del SVG (ahora usado como ArrowIcon)
vi.mock('@/assets/icons/navegacion/fast-arrow-right.svg', () => ({
  default: () => <svg data-testid="arrow-icon" />,
}));

describe('Tab component', () => {
  it('renders the label correctly', () => {
    render(<Tab label="Inicio" />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('calls onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();
    render(<Tab label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Tab label="Disabled" disabled onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies selected styles when selected is true', () => {
    render(<Tab label="Selected" selected />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-100');
    expect(button.className).toContain('text-white-100');
  });

  it('applies disabled styles when disabled is true', () => {
    render(<Tab label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('cursor-not-allowed');
    expect(button).toBeDisabled();
  });

  it('renders the arrow icon', () => {
    render(<Tab label="With Icon" />);
    const icon = screen.getByTestId('arrow-icon');
    expect(icon).toBeInTheDocument();
  });

  it('hides the arrow icon when showTrailingIcon is false', () => {
    render(<Tab label="Without Icon" showTrailingIcon={false} />);
    expect(screen.queryByTestId('arrow-icon')).not.toBeInTheDocument();
  });
});
