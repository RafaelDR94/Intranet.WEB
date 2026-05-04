import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Card } from './Card'

const actionMenuCellMock = vi.fn()
const useRecoverableImageMock = vi.fn()

vi.mock('../ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: (props: any) => {
    actionMenuCellMock(props)
    return <div data-testid="action-menu-cell" />
  },
}))

vi.mock('./hooks/useRecoverableImage', () => ({
  useRecoverableImage: (...args: unknown[]) => useRecoverableImageMock(...args),
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
    useRecoverableImageMock.mockReset()
    useRecoverableImageMock.mockReturnValue({
      currentSrc: 'image.png',
      hasPlaceholder: false,
      isLoading: false,
      handleImageError: vi.fn(),
      handleImageLoaded: vi.fn(),
    })
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

  it('shows a stable placeholder when the image cannot be recovered', () => {
    useRecoverableImageMock.mockReturnValue({
      currentSrc: '',
      hasPlaceholder: true,
      isLoading: false,
      handleImageError: vi.fn(),
      handleImageLoaded: vi.fn(),
    })

    render(<Card {...baseProps} />)

    expect(screen.getByText('Imagen no disponible')).toBeInTheDocument()
  })

  it('shows a loading state while the image is being resolved', () => {
    useRecoverableImageMock.mockReturnValue({
      currentSrc: '',
      hasPlaceholder: false,
      isLoading: true,
      handleImageError: vi.fn(),
      handleImageLoaded: vi.fn(),
    })

    render(<Card {...baseProps} />)

    expect(screen.getByText('Cargando imagen...')).toBeInTheDocument()
  })
})
