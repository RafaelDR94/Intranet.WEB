import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Static assets
vi.mock('@/assets/icons/acciones/menu.svg', () => ({ default: () => <svg data-testid="menu" /> }));
vi.mock('@/assets/icons/Fotos y Videos/media-video-list.svg', () => ({ default: () => <svg data-testid="tutorial" /> }));
vi.mock('@/assets/icons/Comunicacion/bell.svg', () => ({ default: () => <svg data-testid="bell" /> }));
vi.mock('@/assets/icons/Comunicacion/bell-notification.svg', () => ({ default: () => <svg data-testid="bell-notification" /> }));
vi.mock('../Notification/Notification', () => ({ __esModule: true, default: () => <div>Notification</div> }));
vi.mock('@/app/components/PersonalAvatar/PersonalAvatar', () => ({ default: () => <div>Avatar</div> }));

// Next mocks
vi.mock('next/image', () => ({ default: (props: any) => <img alt={props.alt} /> }));
vi.mock('next/link', () => ({
  default: ({ onClick, ...props }: any) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
    />
  ),
}));

let mockQS = ''
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockQS),
}))

const fetchDocumentsMock = vi.fn()
const fetchDocumentsByUserMock = vi.fn()
let userMock: { idUser?: string } = { idUser: 'user-1' }

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: userMock,
  }),
}))

vi.mock('@/app/stores/useDocumentsStore/useDocumentsStore', () => ({
  useDocumentsStore: (selector: any) =>
    selector({
      fetchDocuments: fetchDocumentsMock,
      fetchDocumentsByUser: fetchDocumentsByUserMock,
    }),
}))

// Responsive hook
let mockIsMobile = false;
vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => mockIsMobile,
}))

import MainTabs from './MainTabs';

const tabs = [
  { label: 'Tab1', path: '/a' },
  { label: 'Tab2', path: '/b' },
];

describe('MainTabs', () => {
  beforeEach(() => {
    mockQS = '';
    mockIsMobile = false;
    userMock = { idUser: 'user-1' }
    fetchDocumentsMock.mockClear();
    fetchDocumentsByUserMock.mockClear();
  });
  it('renders tabs', () => {
    render(<MainTabs tabs={tabs} pathname="/a" validPermissionsbyroute={() => true} />);
    expect(screen.getByText('Tab1')).toBeInTheDocument();
  });

  it('filters tabs by permissions', () => {
    render(
      <MainTabs
        tabs={[{ label: 'A', path: '/a' }, { label: 'B', path: '/b' }]}
        pathname="/a"
        validPermissionsbyroute={(p) => p === '/a'}
      />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeNull();
  });

  it('applies active class based on id presence', () => {
    mockQS = '';
    const { rerender } = render(
      <MainTabs
        tabs={[{ label: 'List', path: '/r' }, { label: 'Detail', path: '/r?id' }]}
        pathname="/r"
        validPermissionsbyroute={() => true}
      />
    );
    const list = screen.getByText('List');
    const detail = screen.getByText('Detail');
    expect(list.className).toMatch(/text-gray-100/);
    expect(detail.className).toMatch(/text-gray-70/);

    mockQS = 'id=1';
    rerender(
      <MainTabs
        tabs={[{ label: 'List', path: '/r' }, { label: 'Detail', path: '/r?id' }]}
        pathname="/r"
        validPermissionsbyroute={() => true}
      />
    );
    expect(screen.getByText('List').className).toMatch(/text-gray-70/);
    expect(screen.getByText('Detail').className).toMatch(/text-gray-100/);
  });

  it('uses white icon classes in the mobile top bar', () => {
    mockIsMobile = true;

    render(<MainTabs tabs={tabs} pathname="/a" validPermissionsbyroute={() => true} />);

    expect(screen.getByRole('button', { name: 'Centro de tutoriales' }).className).toMatch(/text-white-100/);
    expect(screen.getByTestId('top-bar-notifications').className).toMatch(/text-white-100/);
    expect(screen.getByTestId('open-mobile-menu').className).toMatch(/text-white-100/);
  });

  it('enables horizontal scrolling for tabs on mobile', () => {
    mockIsMobile = true;

    render(
      <MainTabs
        tabs={[
          { label: 'Tab 1 larga', path: '/a' },
          { label: 'Tab 2 larga', path: '/b' },
          { label: 'Tab 3 larga', path: '/c' },
        ]}
        pathname="/a"
        validPermissionsbyroute={() => true}
      />
    );

    expect(screen.getByTestId('main-tabs-scroll').className).toMatch(/overflow-x-auto/);
    expect(screen.getByTestId('tab:/a').className).toMatch(/whitespace-nowrap/);
  });

  it('fetches management documents when clicking the management documents tab', () => {
    render(
      <MainTabs
        tabs={[
          {
            label: 'Documentos Gerenciales',
            path: '/main-page/request/documents/managementdocuments',
          },
        ]}
        pathname="/main-page/request/documents/operationaldocuments"
        validPermissionsbyroute={() => true}
      />,
    );

    fireEvent.click(screen.getByTestId('tab:/main-page/request/documents/managementdocuments'));

    expect(fetchDocumentsMock).toHaveBeenCalledWith(true);
    expect(fetchDocumentsByUserMock).not.toHaveBeenCalled();
  });

  it('fetches operational documents by user when clicking the operational documents tab', () => {
    render(
      <MainTabs
        tabs={[
          {
            label: 'Documentos Operativos',
            path: '/main-page/request/documents/operationaldocuments',
          },
        ]}
        pathname="/main-page/request/documents/managementdocuments"
        validPermissionsbyroute={() => true}
      />,
    );

    fireEvent.click(screen.getByTestId('tab:/main-page/request/documents/operationaldocuments'));

    expect(fetchDocumentsByUserMock).toHaveBeenCalledWith('user-1', true);
    expect(fetchDocumentsMock).not.toHaveBeenCalled();
  });

  it('does not fetch all documents when the user id is unavailable', () => {
    userMock = {}

    render(
      <MainTabs
        tabs={[
          {
            label: 'Documentos Operativos',
            path: '/main-page/request/documents/operationaldocuments',
          },
        ]}
        pathname="/main-page/request/documents/managementdocuments"
        validPermissionsbyroute={() => true}
      />,
    )

    fireEvent.click(screen.getByTestId('tab:/main-page/request/documents/operationaldocuments'))

    expect(fetchDocumentsByUserMock).not.toHaveBeenCalled()
    expect(fetchDocumentsMock).not.toHaveBeenCalled()
  })
});
