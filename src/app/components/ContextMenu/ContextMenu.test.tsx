// ContextMenu.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- Mocks de módulos dependientes --- //
vi.mock('./styles', () => {
  const cm = {
    Container: 'Container',
    Trigger: 'Trigger',
    MenuBase: 'MenuBase',
    MenuSize: 'MenuSize',
    RightAligned: 'RightAligned',
    LeftAligned: 'LeftAligned',
    OpenDown: 'OpenDown',
    OpenUp: 'OpenUp',
    HeaderWrap: 'HeaderWrap',
    HeaderText: 'HeaderText',
    ItemBase: 'ItemBase',
    ItemPressed: 'ItemPressed',
    ItemDisabled: 'ItemDisabled',
    ItemDanger: 'ItemDanger',
    ItemHover: 'ItemHover',
    ItemContent: 'ItemContent',
    Label: 'Label',
    LeftSlot: 'LeftSlot',
    RightSlot: 'RightSlot',
    Icon: 'Icon',
    ControlButton: 'ControlButton',
    BadgeButton: 'BadgeButton',
  };
  return { contextMenuStyles: cm };
});

vi.mock('@/assets/icons/navegacion/nav-arrow-right.svg', () => {
  const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg data-testid="arrow-right" {...props} />
  );
  return { default: Icon };
});

vi.mock('../CustomRadio/CustomRadio', () => {
  return {
    default: (props: any) => <input data-testid="custom-radio" type="radio" {...props} />,
  };
});

vi.mock('../CheckBox/CheckBox', () => {
  return {
    Checkbox: (props: any) => <input data-testid="checkbox" type="checkbox" {...props} />,
  };
});

vi.mock('../ToogleButton/ToogleButton', () => {
  return {
    ToggleButton: (props: any) => (
      <button data-testid="toggle-button" type="button" {...props}>
        toggle
      </button>
    ),
  };
});

vi.mock('../Button/Button', () => {
  return {
    Button: (props: any) => (
      <button data-testid="button" type="button" {...props}>
        {props.children ?? 'button'}
      </button>
    ),
  };
});

vi.mock('../Control/Control', () => {
  return {
    Control: (props: any) => (
      <div data-testid="control" role="spinbutton" aria-valuenow={0} {...props} />
    ),
  };
});

// --- Mock del hook useContextMenu para controlar el estado en las pruebas --- //
type AlignH = 'left' | 'right';
type AlignV = 'up' | 'down';

const mockState = {
  menuIsOpen: true as boolean,
  hAlign: 'right' as AlignH,
  vAlign: 'down' as AlignV,
  pressedIndex: -1 as number,
};

const handleItemActivate = vi.fn();
const toggleMenu = vi.fn();

function __setMockState(partial: Partial<typeof mockState>) {
  Object.assign(mockState, partial);
}
function __resetMocks() {
  handleItemActivate.mockClear();
  toggleMenu.mockClear();
  __setMockState({ menuIsOpen: true, hAlign: 'right', vAlign: 'down', pressedIndex: -1 });
}

vi.mock('./hooks/useContextMenu', async () => {
  // crear refs "vacíos"; React los rellenará con el DOM al montar
  const makeRef = <T,>() => ({ current: null } as React.RefObject<T>);
  return {
    useContextMenu: () => ({
      rootRef: makeRef<HTMLDivElement>(),
      menuRef: makeRef<HTMLDivElement>(),
      menuIsOpen: mockState.menuIsOpen,
      toggleMenu,
      hAlign: mockState.hAlign,
      vAlign: mockState.vAlign,
      pressedIndex: mockState.pressedIndex,
      handleItemActivate,
    }),
    // utilidades de test
    __setMockState,
    __getMocks: () => ({ handleItemActivate, toggleMenu }),
  };
});

// Importar el componente después de definir los mocks
import ContextMenu from './ContextMenu';
// Importar helpers expuestos por el mock
import { __setMockState as setHookState, __getMocks as getHookMocks } from './hooks/useContextMenu';

// --- Utils de datos para tests --- //
const baseItems = [
  { label: 'Abrir', icon: undefined },
  { label: 'Eliminar', danger: true },
  { label: 'Conmutar', controlType: 'toggle', controlSide: 'left' },
  { label: 'Badge', controlType: 'badge', controlSide: 'right' },
];

const renderMenu = (props?: Partial<React.ComponentProps<typeof ContextMenu>>) => {
  return render(
    <ContextMenu
      title="Opciones"
      trigger={<button>Trigger</button>}
      items={baseItems as any}
      {...props}
    />
  );
};

// --- Tests --- //
describe('ContextMenu', () => {
  beforeEach(() => {
    __resetMocks();
  });

  afterEach(() => {
    // Asegurar que no quede abierto ningún menú o listeners "colgados"
    document.body.innerHTML = '';
  });

  it('renderiza el trigger y el menú (si menuIsOpen es true) con el título', () => {
    setHookState({ menuIsOpen: true });
    renderMenu();

    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Opciones')).toBeInTheDocument();

    // Renderiza items y el ícono por defecto cuando no hay control
    expect(screen.getByText('Abrir')).toBeInTheDocument();
    expect(screen.getAllByTestId('arrow-right').length).toBeGreaterThan(0);
  });

  it('aplica clases de alineación horizontal y vertical según el hook', () => {
    setHookState({ menuIsOpen: true, hAlign: 'left', vAlign: 'up' });
    const { container } = renderMenu();

    const menu = container.querySelector('.MenuBase')!;
    expect(menu.className).toContain('LeftAligned');
    expect(menu.className).toContain('OpenUp');
  });

  it('llama a handleItemActivate con el índice correcto al hacer click en un ítem', async () => {
    setHookState({ menuIsOpen: true });
    renderMenu();
    const { handleItemActivate } = getHookMocks();

    await userEvent.click(screen.getByText('Eliminar'));
    expect(handleItemActivate).toHaveBeenCalledTimes(1);
    // índice 1 corresponde a "Eliminar" en baseItems
    expect(handleItemActivate).toHaveBeenCalledWith(1, expect.any(Array));
  });

  it('renderiza controles embebidos cuando el item tiene controlType', () => {
    setHookState({ menuIsOpen: true });
    renderMenu();

    // El item con controlType "toggle" y controlSide="left" debe tener LeftSlot
    const leftSlots = screen.getAllByText('Conmutar')[0]
      .closest('.ItemContent')!
      .querySelectorAll('.LeftSlot');
    expect(leftSlots.length).toBe(1);
    expect(screen.getAllByTestId('toggle-button').length).toBeGreaterThan(0);

    // El item con controlType "badge" y controlSide="right" debe tener RightSlot
    const rightSlots = screen.getAllByText('Badge')[0]
      .closest('.ItemContent')!
      .querySelectorAll('.RightSlot');
    expect(rightSlots.length).toBe(1);
  });

  it('marca correctamente los ítems con aria-disabled y tabIndex cuando están deshabilitados', () => {
    setHookState({ menuIsOpen: true });
    const items = [
      { label: 'No disponible', disabled: true },
      { label: 'Disponible' },
    ];
    renderMenu({ items: items as any });

    const disabledItem = screen.getByText('No disponible').closest('[role="menuitem"]')!;
    const enabledItem = screen.getByText('Disponible').closest('[role="menuitem"]')!;

    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    expect(disabledItem).toHaveAttribute('tabIndex', '-1');
    expect(enabledItem).toHaveAttribute('tabIndex', '0');
  });

  it('cierra con tecla Escape cuando se proporciona setIsOpen (modo controlado)', () => {
    setHookState({ menuIsOpen: true });
    const setIsOpen = vi.fn();
    renderMenu({ isOpen: true, setIsOpen });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('cierra con click fuera y respeta ignoreRefs (no cierra si el click es dentro de una zona ignorada)', async () => {
    setHookState({ menuIsOpen: true });
    const setIsOpen = vi.fn();
    const ignoredRef = createRef<HTMLDivElement>();

    render(
      <div>
        <div ref={ignoredRef} data-testid="ignored-zone">
          Zona ignorada
        </div>
        <ContextMenu
          title="Opciones"
          trigger={<button>Trigger</button>}
          items={baseItems as any}
          isOpen={true}
          setIsOpen={setIsOpen}
          ignoreRefs={[ignoredRef]}
        />
      </div>
    );

    // Click fuera → debe cerrar
    fireEvent.pointerDown(document.body);
    expect(setIsOpen).toHaveBeenCalledWith(false);
    setIsOpen.mockClear();

    // Click dentro de zona ignorada → NO debe cerrar
    fireEvent.pointerDown(screen.getByTestId('ignored-zone'));
    expect(setIsOpen).not.toHaveBeenCalled();
  });

  it('cierra cuando otra instancia emite el evento global de apertura (coordinación)', () => {
    setHookState({ menuIsOpen: true });
    const setIsOpen = vi.fn();
    renderMenu({ isOpen: true, setIsOpen });

    // Emite evento como si "otra" instancia se hubiese abierto
    window.dispatchEvent(new CustomEvent('ctxmenu:open', { detail: { id: Symbol('otra') } }));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
