// vitest.setup.tsx
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

// Polyfill matchMedia for jsdom environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
// Mock global para next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: () => <span data-testid="next-image" />,
}));
// Mock imágenes
vi.mock('@/assets/images/Walpapers/Wallpaper-1.png', () => ({
  __esModule: true,
  default: 'logo.png',
}));
// Mocks de íconos SVG
vi.mock('@/assets/icons/acciones/info-empty.svg', () => ({
  default: () => <svg data-testid="icon-info" />,
}));
vi.mock('@/assets/icons/organization/star.svg', () => ({
  default: () => <svg data-testid="icon-success" />,
}));
vi.mock('@/assets/icons/bussines/high-priority.svg', () => ({
  default: () => <svg data-testid="icon-warning" />,
}));
vi.mock('@/assets/icons/acciones/eye-alt.svg', () => ({
  default: () => <svg data-testid="eye-open" />,
}));
vi.mock('@/assets/icons/acciones/eye-close.svg', () => ({
  default: () => <svg data-testid="eye-close" />,
}));
// Mock para el ícono usado como separador en Breadcrumbs
vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => ({
  default: (props: any) => <svg data-testid={props['data-testid'] ?? 'breadcrumb-separator'} {...props} />,
}));
vi.mock('next/navigation', () => {
  const params = new URLSearchParams();
  return {
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(() => params),
  };
});
vi.mock('dexie', () => {
  return {
    default: class {
      documents = {
        get: vi.fn().mockResolvedValue({ id: 1, nombre: 'Mock User' }),
        put: vi.fn(),
        delete: vi.fn(),
        where: vi.fn(() => ({
          equals: vi.fn(() => ({
            first: vi.fn().mockResolvedValue({ id: 1 }),
          })),
        })),
      };

      version() {
        return this;
      }

      stores() {
        return this;
      }

      open() {
        return Promise.resolve();
      }

      table() {
        return this.documents;
      }

      close() {}
    }
  };
});
vi.mock('@/app/configurations/DataBase/crud', () => ({
  readDocumentById: vi.fn().mockResolvedValue({
    user: {
      token: 'mock-token',
      id: 1,
      name: 'Mock User',
      // agrega otros campos si tu contexto los espera
    }
  }),
}));
class DataTransferMock {
  private _files: File[] = [];
  items = {
    add: (file: File) => {
      this._files = [file];
    },
    clear: () => {
      this._files = [];
    },
  };
  get files() {
    // Suficiente para asignarlo a input.files en jsdom
    return this._files as unknown as FileList;
  }
}
(globalThis as any).DataTransfer = DataTransferMock;
