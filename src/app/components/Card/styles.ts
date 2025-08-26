export const cardStyles = {
  Container: 'bg-white-100 shadow-300 rounded-lg overflow-hidden flex',
  ContainerVertical: 'flex-col w-[280px]',
  ContainerHorizontal: 'flex-row w-[360px]',

  ImageWrapperBase: 'relative',
  ImageWrapperVertical: 'h-40 w-full',
  ImageWrapperHorizontal: 'w-32 h-auto',
  Image: 'object-cover',

  Body: 'py-4 px-6 flex flex-col gap-2 flex-1',
  Label: 'text-gray-80 text-label',
  Title: 'text-green-90 text-s2 font-semibold',
  Description: 'text-gray-70 text-b3 flex-1',

  Actions: 'flex items-center gap-2 mt-auto',
  ActionsVertical: 'justify-between',
  ActionsHorizontal: 'justify-end',

  CancelBtn: 'text-green-80 border border-green-80 rounded-md px-btn-md-x py-btn-md-y btn-giant',
  AcceptBtn: 'text-white bg-green-80 rounded-md btn-giant px-btn-md-x py-btn-md-y',
  AcceptBtnFull: 'text-white bg-green-80 btn-giant rounded-md w-full px-btn-md-x py-btn-md-y ml-auto',
};
