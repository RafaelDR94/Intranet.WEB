import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Card } from './Card'

const actionMenuCellMock = vi.fn()

vi.mock('../ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: (props: any) => {
    actionMenuCellMock(props)
    return <div data-testid="action-menu-cell" />
  },
}))

describe('Card', () => {
  const baseProps = {
    imageSrc: 'image.png',
    label: 'Label',
    title: 'Title',
    description: 'Description',
    onAccept: vi.fn(),
  }

  beforeEach(() => {
    actionMenuCellMock.mockClear()
  })

  it('renders label and title', () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.queryByTestId('action-menu-cell')).toBeNull()
  })

  it('renders ActionMenuCell when props are provided', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const row = { id: 1 }

    render(
      <Card
        {...baseProps}
        actionMenuProps={{
          row,
          onEdit,
          onDelete,
        }}
      />
    )

    expect(screen.getByTestId('action-menu-cell')).toBeInTheDocument()
    expect(actionMenuCellMock).toHaveBeenCalledWith(
      expect.objectContaining({ row, onEdit, onDelete })
    )
  })
})
