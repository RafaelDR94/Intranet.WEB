import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';

import ImagesComponent from './ImagesComponent';

(globalThis as any).React = React;

const handleSignatureAuthorization = vi.fn();
const handleImageSelect = vi.fn(() => vi.fn());
const handleRemoveImage = vi.fn();
const handleResponsiveDownload = vi.fn();
const openSignature = vi.fn();
const closeSignature = vi.fn();

const hookReturn = {
  isSignatureOpen: false,
  openSignature,
  closeSignature,
  slots: [
    {
      id: 'front',
      title: 'Frontal',
      uploadLabel: 'Frontal',
      imageSrc: 'data:image/png;base64,AAA',
    },
    {
      id: 'rear',
      title: 'Trasera',
      uploadLabel: 'Trasera',
      imageSrc: '',
    },
  ],
  signatureBox: { title: 'Driver', imageUrl: 'signature.png' },
  shouldShowSignatureButton: true,
  selectedDriverId: 'driver-1',
  handleSignatureAuthorization,
  handleImageSelect: (slotId: string) => handleImageSelect(slotId),
  handleRemoveImage,
  handleResponsiveDownload,
  currentAssignment: null,
};

vi.mock('./hooks/useImagesComponent', () => ({
  __esModule: true,
  default: vi.fn(() => hookReturn),
}));

vi.mock('@/app/components/Card/Card', () => {
  const React = require('react');
  return {
    __esModule: true,
    Card: ({ title, actionMenuProps }: any) =>
      React.createElement(
        'div',
        { 'data-testid': `card-${title}` },
        title,
        React.createElement(
          'button',
          {
            type: 'button',
            'data-testid': `delete-${title}`,
            onClick: () => actionMenuProps.onDelete?.(),
          },
          'delete'
        )
      ),
  };
});

vi.mock('@/app/components/ImageUploaderExpanded/ImageUploaderExpanded', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ dataTestId, onImage }: any) =>
      React.createElement(
        'button',
        {
          type: 'button',
          'data-testid': dataTestId,
          onClick: () => onImage(null),
        },
        'uploader'
      ),
  };
});

vi.mock('@/app/components/SignatureBox/SignatureBox', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ title }: any) =>
      React.createElement('div', { 'data-testid': 'signature-box' }, title),
  };
});

vi.mock('@/app/components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    Button: ({ children, onClick, hideIcon: _hideIcon, ...rest }: any) =>
      React.createElement(
        'button',
        { type: 'button', 'data-testid': 'signature-button', onClick, ...rest },
        children
      ),
  };
});

vi.mock('@/app/components/SignatureComponent/SignatureComponent', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ open, onClose }: any) =>
      React.createElement(
        'div',
        { 'data-testid': 'signature-component' },
        `signature-${String(open)}`,
        React.createElement(
          'button',
          { type: 'button', 'data-testid': 'close-signature', onClick: onClose },
          'close'
        )
      ),
  };
});

describe('ImagesComponent', () => {
  beforeEach(() => {
    handleSignatureAuthorization.mockClear();
    handleImageSelect.mockClear();
    handleRemoveImage.mockClear();
    handleResponsiveDownload.mockClear();
    openSignature.mockClear();
    closeSignature.mockClear();
    hookReturn.isSignatureOpen = false;
    hookReturn.shouldShowSignatureButton = true;
    hookReturn.signatureBox = { title: 'Driver', imageUrl: 'signature.png' };
    hookReturn.currentAssignment = null;
  });

  it('renders image cards and uploader when signature is closed', () => {
    render(<ImagesComponent formId="departure-form" />);

    expect(screen.getByTestId('card-Frontal')).toBeInTheDocument();
    expect(screen.getByTestId('image-uploader-rear')).toBeInTheDocument();
    expect(screen.getByTestId('signature-box')).toHaveTextContent('Driver');
    expect(screen.getByTestId('signature-button')).toBeDisabled();
    fireEvent.click(screen.getByTestId('signature-button'));
    expect(openSignature).not.toHaveBeenCalled();
  });

  it('calls remove handler when delete action is triggered', () => {
    render(<ImagesComponent formId="departure-form" />);
    fireEvent.click(screen.getByTestId('delete-Frontal'));
    expect(handleRemoveImage).toHaveBeenCalledWith('front');
  });

  it('hides gallery when signature is open but keeps signature component mounted', () => {
    hookReturn.isSignatureOpen = true;
    render(<ImagesComponent formId="departure-form" />);
    expect(screen.queryByTestId('card-Frontal')).not.toBeInTheDocument();
    expect(screen.getByTestId('signature-component')).toHaveTextContent('signature-true');
  });

  it('omits signature button when driver selection is missing or assignment is active', () => {
    hookReturn.shouldShowSignatureButton = false;
    hookReturn.currentAssignment = { vehicleassignments_id: '123' };
    render(<ImagesComponent formId="departure-form" />);
    expect(screen.queryByTestId('signature-button')).not.toBeInTheDocument();
  });

  it('enables signature button when there is no captured signature', () => {
    hookReturn.signatureBox = null as any;
    render(<ImagesComponent formId="departure-form" />);
    expect(screen.getByTestId('signature-button')).toBeEnabled();
    fireEvent.click(screen.getByTestId('signature-button'));
    expect(openSignature).toHaveBeenCalledTimes(1);
  });
});
