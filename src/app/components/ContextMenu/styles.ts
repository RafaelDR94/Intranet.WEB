export const contextMenuStyles = {
  Container: 'relative inline-block',
  Trigger: 'inline-block',

  // 🔁 Deja Menu “neutral” para que otros popovers (calendario) no se vean afectados
  Menu: 'absolute mt-2 rounded-md shadow-300 bg-white-100 z-50 p-1',

  // ✅ Panel específico del ContextMenu (con las restricciones que necesitabas)
  ContextMenuPanel:
    'w-56 max-w-[calc(100vw-1rem)] overflow-x-hidden rounded-md shadow-300 bg-white-100',

  // utilidades de posición
  RightAligned: 'right-0',
  LeftAligned: 'left-0',
  OpenDown: 'top-full mt-2',
  OpenUp: 'bottom-full mb-2',

  // items
  ItemBase:
    'w-full flex justify-between items-center px-4 py-2 text-left text-gray-70 font-normal text-b1 rounded-sm',
  ItemPressed: 'bg-green-10 text-black-100',
  ItemDisabled: 'text-gray-40 cursor-not-allowed',
  ItemDanger: 'text-alert-red-100',
  ItemHover: 'hover:bg-gray-10',
  Icon: 'w-5 h-5 text-green-100',

  // soporte controles (si los usas)
  ItemContent: 'flex w-full items-center justify-between gap-2',
  Label: 'flex-1 truncate',
  LeftSlot: 'flex items-center justify-center',
  RightSlot: 'flex items-center justify-center',
  ControlButton: 'px-2 py-1 text-sm border rounded-sm',
  BadgeButton: 'px-2 py-0.5 text-xs bg-gray-20 rounded-full',
};
