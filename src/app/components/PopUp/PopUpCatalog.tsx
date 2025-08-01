'use client'
import { useState } from 'react'
import { PopUp } from './PopUp'

export const PopUpCatalog = () => {
  const [openBasic, setOpenBasic] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  return (
    <div className="space-y-8 p-6">
      <button
        onClick={() => setOpenBasic(true)}
        className="px-4 py-2 rounded bg-blue-90 text-white-100"
      >
        Mostrar Básico
      </button>
      <PopUp
        open={openBasic}
        title="Confirmar"
        content="¿Desea continuar?"
        showPrimaryButton
        showSecondaryButton
        onPrimaryButtonClick={() => setOpenBasic(false)}
        onSecondaryButtonClick={() => setOpenBasic(false)}
        onClose={() => setOpenBasic(false)}
      />

      <button
        onClick={() => setOpenForm(true)}
        className="px-4 py-2 rounded bg-blue-90 text-white-100"
      >
        Mostrar Formulario
      </button>
      <PopUp
        open={openForm}
        title="Enviar mensaje"
        content="Rellene el formulario"
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Enviar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={() => setOpenForm(false)}
        onSecondaryButtonClick={() => setOpenForm(false)}
        onClose={() => setOpenForm(false)}
      >
        <div className="mt-4 space-y-2">
          <input className="border px-2 py-1 w-full" placeholder="Mensaje" />
        </div>
      </PopUp>
    </div>
  )
}

