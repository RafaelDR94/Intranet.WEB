// ErrorScreen/styles.ts
export const container = `
  w-full h-[100dvh] [height:100svh]
  p-6
  bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100
  overflow-y-auto overscroll-y-contain
  [-webkit-overflow-scrolling:touch]
`;

export const wrapper = 'max-w-2xl w-full mx-auto';
export const card = `
  rounded-2xl shadow-lg p-8
  bg-white dark:bg-gray-800
  max-h-[calc(100svh-3rem)]
  overflow-y-auto
`;

export const title = 'text-2xl font-semibold mb-1';

export const message = 'text-sm opacity-80';

export const detailsWrapper = `
  mt-6 space-y-3
`;

export const detailsTitle = 'text-sm font-medium opacity-70';
export const detailsHeader = 'flex items-center justify-between gap-2';
export const detailsPre = `
  mt-1 text-xs rounded-lg p-3
  bg-gray-100 dark:bg-gray-900
  overflow-auto break-words whitespace-pre-wrap
  max-h-[50svh]
`;


export const actions = 'mt-8 flex flex-wrap gap-3';
export const copyBtn = `
  px-3 py-1 rounded-xl text-xs
  border border-gray-300 dark:border-gray-700
  hover:bg-gray-100 dark:hover:bg-gray-900
`;

export const primaryBtn = `
  px-4 py-2 rounded-2xl shadow
  bg-blue-600 text-white hover:opacity-90
`;

export const secondaryBtn = `
  px-4 py-2 rounded-2xl
  border border-gray-300 dark:border-gray-700
  hover:bg-gray-100 dark:hover:bg-gray-900
`;