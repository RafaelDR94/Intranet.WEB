import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useMainTab from './useMainTab'

// Dynamic mocks for environment-dependent hooks
let mockQS = ''
let mockIsMobile = false

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockQS),
}))

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: () => mockIsMobile,
}))

const TestComp: React.FC<Parameters<typeof useMainTab>[0]> = (props) => {
  const { isMobile, filtered, isActive } = useMainTab(props)
  return (
    <div>
      <div data-testid="isMobile">{String(isMobile)}</div>
      {filtered.map((t) => (
        <div key={t.path} data-testid={`tab-${t.path}`} data-active={String(isActive(t.path))}>
          {t.label}
        </div>
      ))}
    </div>
  )
}

describe('useMainTab', () => {
  beforeEach(() => {
    mockQS = ''
    mockIsMobile = false
  })

  it('filters tabs using permissions (ignores query params)', () => {
    const tabs = [
      { label: 'List', path: '/route' },
      { label: 'Detail', path: '/route?id' },
      { label: 'Other', path: '/other' },
    ]

    const valid = (path: string) => path === '/route'

    render(<TestComp tabs={tabs} pathname="/route" validPermissionsbyroute={valid} />)

    expect(screen.getByTestId('tab-/route')).toBeInTheDocument()
    expect(screen.getByTestId('tab-/route?id')).toBeInTheDocument()
    expect(screen.queryByTestId('tab-/other')).toBeNull()
  })

  it('activates base tab when no id is present', () => {
    const tabs = [
      { label: 'List', path: '/route' },
      { label: 'Detail', path: '/route?id' },
    ]

    render(<TestComp tabs={tabs} pathname="/route" validPermissionsbyroute={() => true} />)

    expect(screen.getByTestId('tab-/route').getAttribute('data-active')).toBe('true')
    expect(screen.getByTestId('tab-/route?id').getAttribute('data-active')).toBe('false')
  })

  it('activates id tab when id is present', () => {
    mockQS = 'id=123'
    const tabs = [
      { label: 'List', path: '/route' },
      { label: 'Detail', path: '/route?id' },
    ]

    render(<TestComp tabs={tabs} pathname="/route" validPermissionsbyroute={() => true} />)

    expect(screen.getByTestId('tab-/route').getAttribute('data-active')).toBe('false')
    expect(screen.getByTestId('tab-/route?id').getAttribute('data-active')).toBe('true')
  })

  it('matches explicit id in tab path', () => {
    mockQS = 'id=abc'
    const tabs = [
      { label: 'Detail A', path: '/route?id=abc' },
      { label: 'Detail B', path: '/route?id=xyz' },
    ]

    render(<TestComp tabs={tabs} pathname="/route" validPermissionsbyroute={() => true} />)

    expect(screen.getByTestId('tab-/route?id=abc').getAttribute('data-active')).toBe('true')
    expect(screen.getByTestId('tab-/route?id=xyz').getAttribute('data-active')).toBe('false')
  })
})

