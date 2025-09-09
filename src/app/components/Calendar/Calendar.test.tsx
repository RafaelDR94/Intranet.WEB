// Calendar.test.tsx
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// -----------------------
// Mocks de dependencias
// -----------------------
vi.mock("react-datepicker/dist/react-datepicker.css", () => ({}));
vi.mock("./datepicker.css", () => ({}));

vi.mock("@/assets/icons/System/System/calendar.svg", () => ({
  default: () => <svg data-testid="calendar-icon" />,
}));

vi.mock("./styles", () => ({
  calendarStyles: {
    calendarContainer: "calendarContainer",
    triggerBtn: "triggerBtn",
    triggerDisabled: "triggerDisabled",
    triggerHover: "triggerHover",
    trigerFocus: "trigerFocus",
    modalOverlay: "modalOverlay",
    subCalendarMobile: "subCalendarMobile",
    subCalendarContainer: "subCalendarContainer",
    subCalendarTitle: "subCalendarTitle",
    subCalendarWrapper: "subCalendarWrapper",
    wrapper: "wrapper",
    inputWrapper: "inputWrapper",
    inputLabel: "inputLabel",
    input: "input",
    buttonWrapper: "buttonWrapper",
    button: "button",
  },
}));

const mockContextMenu = vi.fn();
vi.mock("../ContextMenu/ContextMenu", () => ({
  ContextMenu: (props: any) => {
    mockContextMenu(props);
    const { trigger, isOpen, items, setIsOpen } = props;
    return (
      <div>
        <div
          data-testid="context-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {trigger}
        </div>
        {isOpen && (
          <div data-testid="context-menu">
            {items?.map((it: any, i: number) => (
              <button
                key={i}
                data-testid={`preset-${i}`}
                onClick={it.onClick}
              >
                {it.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
}));

let isMobileMockValue = false;
vi.mock(
  "../DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => isMobileMockValue,
  })
);

vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: (props: any) => (
    <button
      data-testid="datepicker"
      onClick={() => {
        props?.onChange?.([new Date("2025-01-01"), new Date("2025-01-10")]);
      }}
    >
      mock-date-picker
    </button>
  ),
}));

type MockUseCalendarState = {
  startDate: Date | null;
  endDate: Date | null;
  startDateStr: string;
  endDateStr: string;
  isOpen: boolean;
  showCustomRange: boolean;
  canGo: boolean;
  presets: Array<{ label: string; action: () => void }>;
  handleTriggerClick: () => void;
  handleDateChange: (dates: [Date | null, Date | null]) => void;
  handleGo: () => void;
  setIsOpen: (v: boolean) => void;
  setShowCustomRange: (v: boolean) => void;
};

const defaultHandlers = {
  handleTriggerClick: vi.fn(),
  handleDateChange: vi.fn(),
  handleGo: vi.fn(),
  setIsOpen: vi.fn(),
  setShowCustomRange: vi.fn(),
};

let useCalendarState: MockUseCalendarState = {
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-01-10"),
  startDateStr: "01/01/2025",
  endDateStr: "10/01/2025",
  isOpen: false,
  showCustomRange: false,
  canGo: false,
  presets: [
    { label: "Hoy", action: vi.fn() },
    { label: "Últimos 7 días", action: vi.fn() },
  ],
  ...defaultHandlers,
};

const setUseCalendarMock = (overrides?: Partial<MockUseCalendarState>) => {
  useCalendarState = { ...useCalendarState, ...defaultHandlers, ...overrides };
};

vi.mock("./hooks/useCalendar", () => ({
  useCalendar: () => useCalendarState,
}));

import { Calendar } from "./Calendar";

// Helpers
const renderCalendar = () => render(<Calendar onCalendarClick={vi.fn()} />);

beforeEach(() => {
  isMobileMockValue = false;
  Object.values(defaultHandlers).forEach((fn) => (fn as any).mockClear());
  useCalendarState.presets.forEach((p) => (p.action as any).mockClear());
  setUseCalendarMock({
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-10"),
    startDateStr: "01/01/2025",
    endDateStr: "10/01/2025",
    isOpen: false,
    showCustomRange: false,
    canGo: false,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// -----------------------
// Tests
// -----------------------
describe("Calendar component", () => {
  it("renderiza el botón trigger con el icono", () => {
    renderCalendar();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  it("al hacer click en el trigger alterna el estado con setIsOpen", () => {
    renderCalendar();
    const triggerWrapper = screen.getByTestId("context-trigger");
    fireEvent.click(triggerWrapper);
    expect(defaultHandlers.setIsOpen).toHaveBeenCalledWith(true);
  });

  it("muestra el menú contextual y ejecuta un preset", () => {
    setUseCalendarMock({ isOpen: true });
    renderCalendar();
    const preset0 = screen.getByTestId("preset-0");
    fireEvent.click(preset0);
    expect(useCalendarState.presets[0].action).toHaveBeenCalled();
  });

  it("muestra modal móvil si isMobile=true y showCustomRange=true", () => {
    isMobileMockValue = true;
    setUseCalendarMock({ showCustomRange: true });
    renderCalendar();
    expect(screen.getByText("PERIODO PERSONALIZADO")).toBeInTheDocument();
  });

  it("muestra submenú escritorio si showCustomRange=true", () => {
    setUseCalendarMock({ showCustomRange: true });
    renderCalendar();
    expect(screen.getByText("PERIODO PERSONALIZADO")).toBeInTheDocument();
  });

  it("el botón 'Ir' se deshabilita y habilita según canGo", () => {
    setUseCalendarMock({ showCustomRange: true, canGo: false });
    const { rerender } = render(<Calendar onCalendarClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /ir/i })).toBeDisabled();

    setUseCalendarMock({ showCustomRange: true, canGo: true });
    rerender(<Calendar onCalendarClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /ir/i })).toBeEnabled();
  });

  it("ejecuta handleGo al clickear 'Ir' habilitado", () => {
    setUseCalendarMock({ showCustomRange: true, canGo: true });
    renderCalendar();
    fireEvent.click(screen.getByRole("button", { name: /ir/i }));
    expect(defaultHandlers.handleGo).toHaveBeenCalled();
  });

  it("propaga onChange del DatePicker a handleDateChange", () => {
    setUseCalendarMock({ showCustomRange: true });
    renderCalendar();
    fireEvent.click(screen.getByTestId("datepicker"));
    expect(defaultHandlers.handleDateChange).toHaveBeenCalled();
  });

  it("cierra con tecla Escape", () => {
    setUseCalendarMock({ isOpen: true, showCustomRange: true });
    renderCalendar();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultHandlers.setIsOpen).toHaveBeenCalledWith(false);
    expect(defaultHandlers.setShowCustomRange).toHaveBeenCalledWith(false);
  });
});
