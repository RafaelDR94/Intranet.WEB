// e2e/specs/proyects/new-proyect.spec.ts
import { test, expect } from '@playwright/test'

import { fastLogin } from '../../helpers/login-helpers'
import { fillStable } from '../../helpers/actions-helpers'

const email = process.env.E2E_USER_EMAIL!
const password = process.env.E2E_USER_PASSWORD!

test.describe('proyects/New Proyect', () => {
  test('crea un proyecto mostrando PopUp de confirmación', async ({ page }) => {
    // Mock de catálogos y creación
    await page.route('**/Employees**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }))
    await page.route('**/Reports/Proyects**', async route => {
      const method = route.request().method()
      if (method === 'POST') {
        return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ data: { id: 'np-e2e' } }) })
      }
      // GETs (si ocurren)
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) })
    })

    await fastLogin(page, email, password)

    await page.goto('/main-page/proyects/proyects/newproyect')
    await expect(page.getByTestId('new-proyect-form')).toBeVisible()

    await fillStable(page.getByTestId('new-proyect-form-name'), 'Proyecto E2E')
    await fillStable(page.getByTestId('new-proyect-form-proyectKey'), 'PX-E2E')
    await fillStable(page.getByTestId('new-proyect-form-client'), 'Cliente QA')

    // Abrir confirmación
    await page.getByRole('button', { name: /Registrar Proyecto/i }).click()
    await expect(page.getByText('Confirmación Nuevo Proyecto')).toBeVisible()

    // Confirmar
    await page.getByRole('button', { name: /Continuar/i }).click()

    // Espera feedback de éxito
    await expect(page.getByText(/Creación exitosa/i)).toBeVisible({ timeout: 5000 })
  })
})

