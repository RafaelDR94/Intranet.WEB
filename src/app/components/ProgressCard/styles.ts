// components/ProgressCard/styles.ts

export const baseCard =
  'bg-white-70 rounded-xl shadow-sm p-2 md:p-4';

export const classes = {
  root: baseCard,
  grid: 'grid grid-cols-2 md:grid-cols-2 gap-1',
  leftCol: 'space-y-1',
  title: 'text-s1 font-semibold text-green-100',
  subtitle: 'text-d3 font-medium text-gray-90',
  statsWrapper: 'pt-20',
  statsValue: 'text-s1 font-semibold text-green-100',
  statsLabel: 'text-d3 font-medium text-gray-90',
  donutCol: 'flex justify-center md:justify-center',
  donutWrapper: '', // por si luego agregas paddings/márgenes al donut
} as const;
