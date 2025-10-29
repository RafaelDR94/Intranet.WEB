import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Filter from './Filter';

(globalThis as any).React = React;

const mockContextMenu = vi.hoisted(() =>
  vi.fn(({ trigger, items, setIsOpen, isOpen }: any) => (
    <div data-testid="context-menu">
      <button
        data-testid="context-trigger"
        type="button"
        onClick={() => setIsOpen?.(!isOpen)}
      >
        trigger
      </button>
      {trigger}
      {items.map((item: any, index: number) => (
        <button
          key={`${item.label}-${index}`}
          data-testid={`item-${index}`}
          disabled={item.disabled}
          onClick={() => {
            item.onClick?.();
            item.controlProps?.onChange?.();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  ))
);

vi.mock('../ContextMenu/ContextMenu', () => ({
  __esModule: true,
  default: mockContextMenu,
}));

vi.mock('@/assets/icons/organization/filter-alt.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="filter-icon">icon</span>,
}));

describe('Filter', () => {
  beforeEach(() => {
    mockContextMenu.mockClear();
  });

  it('renders options and selects value in uncontrolled mode', () => {
    const handleChange = vi.fn();
    render(
      <Filter
        options={[
          { label: 'Uno', value: 'one' },
          { label: 'Dos', value: 'two' },
        ]}
        onChange={handleChange}
      />
    );

    const itemsProp =
      mockContextMenu.mock.calls.at(-1)?.[0]?.items ?? [];
    expect(itemsProp).toHaveLength(2);
    expect(itemsProp[0].controlProps.checked).toBe(true);

    fireEvent.click(screen.getByTestId('item-1'));
    expect(handleChange).toHaveBeenCalledWith('two');
  });

  it('supports controlled mode without mutating internal state', () => {
    const handleChange = vi.fn();
    render(
      <Filter
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
        selectedValue="b"
        onChange={handleChange}
      />
    );

    let itemsProp =
      mockContextMenu.mock.calls.at(-1)?.[0]?.items ?? [];
    expect(
      itemsProp.find((entry: any) => entry.controlProps.value === 'b')
        ?.controlProps.checked
    ).toBe(true);

    fireEvent.click(screen.getByTestId('item-0'));
    expect(handleChange).toHaveBeenCalledWith('a');

    itemsProp = mockContextMenu.mock.calls.at(-1)?.[0]?.items ?? [];
    expect(
      itemsProp.find((entry: any) => entry.controlProps.value === 'b')
        ?.controlProps.checked
    ).toBe(true);
  });

  it('provides fallback item when options list is empty', () => {
    render(<Filter options={[]} />);

    const itemsProp =
      mockContextMenu.mock.calls.at(-1)?.[0]?.items ?? [];
    expect(itemsProp).toHaveLength(1);
    expect(itemsProp[0].disabled).toBe(true);
    expect(itemsProp[0].label).toContain('Sin opciones');
  });
});
