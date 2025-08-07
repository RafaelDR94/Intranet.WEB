'use client'
import { ColumnDefinition } from "@/app/components/DataTable/types"
import { DataTable } from "@/app/components/DataTable/DataTable"
import CheckIcon from '@/assets/icons/acciones/check.svg'
import CrossIcon from '@/assets/icons/acciones/cancel.svg'
import WarningIcon from '@/assets/icons/acciones/minus.svg'
import { Button } from "@/app/components/Button/Button"
import DownloadIcon from '@/assets/icons/acciones/download.svg'
const SAT = () => {
   type Cfdi = {
      id: string
      deudor: string
      archivo: string
      uuid: string
      clave?: string
      descripcion?: string
      total: number
      estado: string
   }
   const columnasValidos: ColumnDefinition<Cfdi>[] = [
      {
         key: 'estado',
         headerRender: () => null,
         render: () => <CheckIcon className="text-green-60" />,
         cellClass: 'w-10 text-center',
         headerClass: 'w-10',
      },
      {
         key: 'archivo',
         label: 'ARCHIVO',
      },
      {
         key: 'uuid',
         label: 'UUID',
      },
      {
         key: 'total',
         label: 'TOTAL',
         render: (row) => `$${row.total.toFixed(2)}`,

      },
      {
         key: 'estado',
         label: 'ESTADO SAT',
      },
   ]
   const columnasProhibidas: ColumnDefinition<Cfdi>[] = [
      {
         key: 'estado',
         headerRender: () => null,
         render: () => <CrossIcon className="text-alert-red-50" />,
         cellClass: 'w-10 text-center',
         headerClass: 'w-10',
      },
      { key: 'deudor', label: 'DEUDOR' },
      { key: 'archivo', label: 'ARCHIVO' },
      { key: 'uuid', label: 'UUID' },
      { key: 'clave', label: 'CLAVE' },
      { key: 'descripcion', label: 'DESCRIPCIÓN' },
      {
         key: 'total',
         label: 'TOTAL',
         render: (row) => `$${row.total.toFixed(2)}`,
      },
      { key: 'estado', label: 'ESTADO SAT' },
      {
         key: 'detalles' as keyof Cfdi,
         label: 'DETALLES',
         render: () => (
            <Button variant="ghost" size="small" hideIcon={true}>Ver Detalles</Button>
         ),
      },
      {
         key: 'comentarios' as keyof Cfdi,
         label: 'COMENTARIOS',
         render: () => (
            <Button variant="ghost" size="small">Agregar un comentario</Button>
         ),
      },
   ]
   const columnasInvalidas = columnasProhibidas.map(col =>
      col.key === 'estado'
         ? {
            ...col,
            render: () => <WarningIcon className="text-alert-yellow-100" />,
         }
         : col
   )
   const dataCFDI: Cfdi[] = [
      {
         id: '1',
         deudor: 'DD0001',
         archivo: 'DD0001',
         uuid: '0A6F61E0-BAAD-4CF4...',
         clave: '50202200',
         descripcion: 'New Mix Paloma...',
         total: 297,
         estado: 'Vigente',
      },

   ]
   return (<>

      <DataTable
         tables={[
            {
               title: 'CFDIs Válidos',
               enableCollaps: true,
               data: dataCFDI,
               columns: columnasValidos,

            },
         ]}
         enableInternalSearch
         onSearchChange={() => console.log('Enviar')}
         actionsRender={() => (
            <div className="ml-auto flex items-center gap-2">
               <Button size="medium" variant="ghost" hideIcon={true}>Descargar</Button>
               <Button size="medium" variant="outline" icon={DownloadIcon} iconOnly />
               <Button size="medium" hideIcon={true}>Enviar</Button>
            </div>
         )}
      />

      <div className="mt-5">
         <DataTable
            enableInternalSearch
            tables={[
               {
                  data: dataCFDI,
                  columns: columnasProhibidas,
                  title: 'CFDIs con Claves Prohibidas',
                  enableCollaps: false,
               },
               {
                  data: dataCFDI,
                  columns: columnasInvalidas,
                  title: 'CFDIs con Claves Inválidas',
                  enableCollaps: false
               },
            ]}
            actionsRender={() => (
               <div className="ml-auto flex items-center gap-2">
                  <Button size="medium" variant="ghost" hideIcon={true}>Descargar</Button>
                  <Button size="medium" variant="outline" icon={DownloadIcon} iconOnly />
                  <Button size="medium" hideIcon={true}>Enviar</Button>
               </div>
            )}
         />
      </div>

   </>)
}
export default SAT;