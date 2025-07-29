import React from "react"
import { render, screen } from '@testing-library/react'
import { describe,it,expect } from 'vitest'
import { ThemeProvider,useTheme } from './ThemeContext'
import userEvent from '@testing-library/user-event'

function Test(){
  const {theme,toggleTheme}=useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}

describe('ThemeContext',()=>{
  it('toggles theme',async()=>{
    const user=userEvent.setup()
    render(<ThemeProvider><Test/></ThemeProvider>)
    const btn=screen.getByRole('button')
    expect(btn.textContent).toBe('light')
    await user.click(btn)
    expect(btn.textContent).toBe('dark')
  })
})
