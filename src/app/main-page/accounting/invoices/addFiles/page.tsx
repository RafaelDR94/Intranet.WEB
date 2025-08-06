'use client'

import AddFilesComponent from './components/AddFilesComponent'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import DownloadIcon from '@/assets/icons/acciones/download.svg'
import HorizonIncon from '@/assets/icons/navegacion/more-horiz.svg'
import FormTestPage from '@/app/components/DynamicForm/FormTestPage'
type ImagenTicket = {
  id: string
  imgIcon?: string
  deudor: string
  proyecto: string
}

const columns: ColumnDefinition<ImagenTicket>[] = [
  {
    key: 'imgIcon',
    headerRender: () => <span>IMG</span>,
    render: (row) => (
      <Button icon={ImageIcon} variant="ghost" onClick={() => console.log(row)} />
    ),
    cellClass: 'w-20 text-center',
    headerClass: 'w-20 text-center',
  },
  {
    key: 'deudor',
    label: 'DEUDOR',
    cellClass: 'flex-1 text-left',
    headerClass: 'flex-1 text-left',
  },
  {
    key: 'proyecto',
    label: 'PROYECTO',
  },
  {
    key: 'acciones' as unknown as keyof ImagenTicket,
    headerRender: () => <HorizonIncon />,
    render: (row) => (
      <Button icon={DownloadIcon} variant="ghost" onClick={() => console.log(row)} />
    ),
    cellClass: 'w-10 text-right',
    headerClass: 'w-10 text-right',
  },
]

const imagenes: ImagenTicket[] = [
  {
    id: '1',
    deudor: 'Tania Guerrero',
    proyecto: 'VISITAX',
  },
]



const AddFilesPage = () => {
  return (
    <>
      <AddFilesComponent />
      <DataTable
        onSearchChange={(value) => console.log('Buscando:', value)}
        onCalendarClick={() => console.log('Calendario')}
        onFilterClick={() => console.log('Filtro')}
        onSearch={() => console.log('Agregar')}
        actionLabel="Descargar"
        enableInternalSearch
        tables={[
          {
            columns,
            data: imagenes,
            enableSelection: true,
            title: 'Imágenes de Tickets',
            enableCollaps:true
          },
        ]}
      />
    </>
  )
}

export default AddFilesPage
