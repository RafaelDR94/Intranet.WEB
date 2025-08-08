'use client'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
const ValidateInvoices = () => {
    type Factura = {
        id: string
        rfc: string
        claveSat: string
        uuid: string
        fecha: string
        importe: number
        xml: string,
        pdf: string
    }

    const columnas: ColumnDefinition<Factura>[] = [
        {
            key: 'xml',
            label: "XML",
            render: () => <Button size={'xsmall'} onClick={() => { }} variant='ghost' icon={XMLIcon} />,
            cellClass: 'w-12 text-center',
            headerClass: 'w-12  text-center',
        },
        {
            key: 'pdf',
            label: "PDF",
            render: () => <Button size={'xsmall'} onClick={() => { }} variant='ghost' icon={PDFIcon} />,
            cellClass: 'w-12  text-center',
            headerClass: 'w-12 text-center',
        },
        {
            key: 'rfc',
            label: 'RFC EMISOR',
        },
        {
            key: 'claveSat',
            label: 'CLAVE SAT',
        },
        {
            key: 'uuid',
            label: 'UUID',
        },
        {
            key: 'fecha',
            label: 'FECHA',
        },
        {
            key: 'importe',
            label: 'IMPORTE',
            render: (row) => `$${row.importe.toFixed(2)}`,
            cellClass: 'text-right',
            headerClass: 'text-right'
        },
        {
            key: 'acciones' as unknown as keyof Factura,
            headerRender: () => <span className="text-lg">⋯</span>,
            render: (row) => (
                <Button size={'small'} onClick={() => { console.log(row) }} variant='ghost' hideIcon={true}> Ver Detalles</Button>
            ),
            cellClass: 'w-24 text-right',
            headerClass: 'w-24 text-right',
        },
    ]
    const datosFactura: Factura[] = Array.from({ length: 5 }).map((_, i) => {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() - i) // Fecha descendente

        return {
            id: `${i + 1}`,
            rfc: `RFC${1000 + i}`, // RFCs distintos
            claveSat: `9010150${i}`, // ClaveSat única
            uuid: crypto.randomUUID(), // UUID único (requiere Node 14.17+ o navegador moderno)
            fecha: fecha.toISOString().split('T')[0], // YYYY-MM-DD
            importe: parseFloat((100 + i * 23.75).toFixed(2)), // Importes distintos
            xml: `https://example.com/factura-${i + 1}.xml`,
            pdf: `https://example.com/factura-${i + 1}.pdf`,
        }
    })
    return (
        <div className="space-y-8 overflow-auto">
            <DataTable
                onSearchChange={(val) => console.log('Buscar nuevas:', val)}
                onCalendarClick={() => console.log('Calendario nuevas')}
                onFilterClick={() => console.log('Filtro nuevas')}
                onSearch={() => console.log('Validar nuevas')}
                actionLabel="Validar Facturas"
                enablePagination={false}
                tables={[
                    {
                        data: datosFactura,
                        columns: columnas,
                        enableSelection: true,
                        title: 'Nuevas Facturas',
                        enableCollaps: true,
                        defaultSortKey: "fecha",
                        defaultSortDirection: 'desc'
                    },
                ]}
            />

            <DataTable
                onSearchChange={(val) => console.log('Buscar pendientes:', val)}
                onCalendarClick={() => console.log('Calendario pendientes')}
                onFilterClick={() => console.log('Filtro pendientes')}
                onSearch={() => console.log('Validar pendientes')}
                actionLabel="Validar Facturas"
                tables={[
                    {
                        data: datosFactura,
                        columns: columnas,
                        enableSelection: true,
                        title: 'Facturas Pendientes por Validar',
                        enableCollaps: true,
                        defaultSortKey: "fecha",
                        defaultSortDirection: 'desc'
                    },
                ]}
            />
        </div>
    )
}
export default ValidateInvoices