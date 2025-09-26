import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ActionMenuCell from './ActionMenuCell'

// Mock de ContextMenu para exponer items como botones simples
vi.mock('../ContextMenu/ContextMenu', () => ({
  __esModule: true,
  default: ({ items, trigger }: any) => (
    <div>
      <div data-testid="trigger">{trigger}</div>
      <div data-testid="menu">
        {(items || []).map((it: any, idx: number) => (
          <button key={idx} onClick={it.onClick} data-testid={`item-${idx}`}>
            {it.label}
          </button>
        ))}
      </div>
    </div>
  ),
}))

// Mock del botón para no arrastrar estilos ni íconos
vi.mock('../Button/Button', () => ({
  Button: (props: any) => <button type="button" {...props} />,
}))

// Hook de permisos
// setter provisto por el mock del módulo
let setPerms = (perms: any) => {}

vi.mock('@/app/context/AuthContext/AuthContext', async () => {
  let current = { currentPagePermissions: { details: true, delete: true } }
  return {
    useAuth: () => current,
    // util de pruebas
    __set: (p: any) => (current = { currentPagePermissions: p }),
  }
})
import * as AuthModule from '@/app/context/AuthContext/AuthContext'
setPerms = (perms: any) => (AuthModule as any).__set(perms)

// Hook de viewport
vi.mock('../DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}))

describe('ActionMenuCell', () => {
  const row = { id: '1', name: 'Row 1' }
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  beforeEach(() => {
    onEdit.mockClear()
    onDelete.mockClear()
    setPerms({ details: true, delete: true })
  })

  it('muestra items según permisos y dispara callbacks', async () => {
    render(<ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />)

    // Debe existir trigger y el menú renderizado por el mock
    expect(screen.getByTestId('trigger')).toBeInTheDocument()
    expect(screen.getByTestId('menu')).toBeInTheDocument()

    // Click en "Ver Detalle" (índice 0)
    await userEvent.click(screen.getByText(/Ver Detalle/i))
    expect(onEdit).toHaveBeenCalledWith(row)

    // Click en "Cancelar" (índice 1)
    await userEvent.click(screen.getByText(/Cancelar/i))
    expect(onDelete).toHaveBeenCalledWith(row)
  })

  it('oculta opciones cuando no hay permisos', async () => {
    setPerms({ details: false, delete: true })
    const { rerender } = render(
      <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
    )
    expect(screen.queryByText(/Ver Detalle/i)).toBeNull()
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument()

    setPerms({ details: true, delete: false })
    rerender(<ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText(/Ver Detalle/i)).toBeInTheDocument()
    expect(screen.queryByText(/Cancelar/i)).toBeNull()
  })
})
