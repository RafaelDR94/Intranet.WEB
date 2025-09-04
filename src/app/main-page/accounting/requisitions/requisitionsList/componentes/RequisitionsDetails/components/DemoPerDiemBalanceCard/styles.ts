// src/app/components/PerDiemBalanceCard/styles.ts
export const perDiemBalanceCardStyles = {
  root: 'max-w-97 p-6',

  card: 'w-full rounded-2xl bg-white-70 p-6 shadow-sm ring-1 ring-black/5',

  // Header
  title: 'text-s1 font-semibold text-green-100',
  period: 'mt-2 text-d3 text-gray-90 font-medium',
  amountLine: 'mt-1 text-d3 text-gray-90 font-medium',
  amountValue: 'font-semibold',

  // Body
  body: 'flex mt-5 mb-5',

  // Columna izquierda
  leftCol: 'row-start-2 col-start-1 flex flex-col justify-center gap-1 mr-3',
  dayCounter: 'text-s1 font-semibold text-green-100',
  dayCounterSub: 'ml-2 text-gray-90 text-d3 font-medium',

  // Leyendas
  legendRow: 'flex items-center gap-2',
  legendTriangle: 'inline-flex h-0 w-0 border-l-5 border-r-5 border-b-[8px] border-l-transparent border-r-transparent text-alert-green-100',
  legendPctGreen: 'text-s1 font-semibold text-alert-green-100',
  legendPctYellow: 'text-s1 font-semibold text-alert-yellow-100',
  legendText: 'text-gray-90 text-d3 font-medium',
  legendDot: 'inline-block h-2 w-2 rounded-full', // el color lo mantendremos inline en el componente

  // Donut
  donutWrap: '',

  // Footer
  footer: 'row-start-3 col-span-2 mt-2 text-gray-90 text-c2 font-medium',
  footerValue: 'font-semibold',
} as const;