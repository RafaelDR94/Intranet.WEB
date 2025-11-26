import React from 'react';
import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SignatureComponent from './SignatureComponent';

(globalThis as any).React = React;

const hookReturn = vi.hoisted(() => ({
  externalInformation: { name: 'John', workposition: 'Manager' },
  openSignaturePopUp: true,
  showSignaturePad: false,
  handleAuthorization: vi.fn(),
  handleSignatureSave: vi.fn(),
  handleCancel: vi.fn(),
  onPopUpClose: vi.fn(),
}));

const mockUseSignatureComponent = vi.hoisted(() =>
  vi.fn(() => hookReturn)
);
const signaturePadMock = vi.hoisted(() =>
  vi.fn((props: any) => <div data-testid="signature-pad" data-fullscreen={props.fullScreen} />)
);
const signaturePopUpMock = vi.hoisted(() => {
  const fn = vi.fn((props: any) => {
    (fn as any).latestProps = props;
    return <div data-testid="signature-popup" />;
  });
  return fn;
});

vi.mock('./hooks/useSignatureComponent', () => ({
  __esModule: true,
  default: mockUseSignatureComponent,
}));

vi.mock('../SignaturePAD/SignaturePAD', () => ({
  __esModule: true,
  default: signaturePadMock,
}));

vi.mock('../SignaturePopUp/SignaturePopUp', () => ({
  __esModule: true,
  default: signaturePopUpMock,
}));

describe('SignatureComponent', () => {
  const baseProps = {
    open: true,
    onClose: vi.fn(),
    onAuthorization: vi.fn(),
    responsibleGuid: 'emp-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.showSignaturePad = false;
    hookReturn.openSignaturePopUp = true;
  });

  it('renders signature pad when hook indicates so', () => {
    hookReturn.showSignaturePad = true;
    render(<SignatureComponent {...baseProps} />);
    const hookArgs = mockUseSignatureComponent.mock.calls.at(-1)?.[0];
    expect(hookArgs?.skipAuthorization).toBe(false);
    const padProps = signaturePadMock.mock.calls.at(-1)?.[0];
    expect(padProps).toMatchObject({
      onSignatureSave: hookReturn.handleSignatureSave,
      onCancel: hookReturn.handleCancel,
      name: hookReturn.externalInformation.name,
      workposition: hookReturn.externalInformation.workposition,
      fullScreen: false,
    });
  });

  it('propagates props to SignaturePopUp and toggles external flag', () => {
    render(
      <SignatureComponent
        {...baseProps}
        allowExternalToggle
        responsiveRequired
      />
    );

    const latestProps = signaturePopUpMock.latestProps;
    expect(latestProps.responsiveRequired).toBe(true);
    expect(latestProps.externalSignature).toBe(false);

    act(() => {
      latestProps.onRequestExternalSignature?.();
    });

    const updatedProps = signaturePopUpMock.latestProps;
    expect(updatedProps.externalSignature).toBe(true);

    act(() => {
      updatedProps.onRequestInternalSignature?.();
    });

    const finalProps = signaturePopUpMock.latestProps;
    expect(finalProps.externalSignature).toBe(false);
  });

  it('invokes hook with computed externalSignature state', () => {
    render(<SignatureComponent {...baseProps} externalSignature />);
    const hookArgs = mockUseSignatureComponent.mock.calls.at(-1)?.[0];
    expect(hookArgs?.externalSignature).toBe(true);
    expect(hookArgs?.skipAuthorization).toBe(false);
  });

  it('skips authorization popup when requested and shows fullscreen pad', () => {
    hookReturn.showSignaturePad = true;
    render(<SignatureComponent {...baseProps} skipAuthorization fullScreenPad />);

    const hookArgs = mockUseSignatureComponent.mock.calls.at(-1)?.[0];
    expect(hookArgs?.skipAuthorization).toBe(true);

    expect(signaturePopUpMock).not.toHaveBeenCalled();
    const padProps = signaturePadMock.mock.calls.at(-1)?.[0];
    expect(padProps.fullScreen).toBe(true);
  });
});
