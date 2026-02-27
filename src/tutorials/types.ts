export type TutorialStatus = 'notSeen' | 'completed' | 'dismissed';

export type TutorialStep = {
  target: string;
  title: string;
  description: string;
  /** Solo mostrar en mobile */
  onlyMobile?: boolean;
  /** Solo mostrar en desktop */
  onlyDesktop?: boolean;
  /** Control del sidebar en mobile */
  sidebar?: 'open' | 'close';
  /** Lado del popover en desktop */
  popoverSide?: 'top' | 'right' | 'bottom' | 'left' | 'over';
  /** Alineacion del popover en desktop */
  popoverAlign?: 'start' | 'center' | 'end';
  /** Accion al avanzar */
  nextAction?: 'click';
  /** Tutorial a iniciar despues */
  nextTutorialId?: string;
};

export type TutorialDefinition = {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  version: number;
  steps: TutorialStep[];
};
