import type { TutorialDefinition } from './types';
import { mainPageTutorials } from './modules/mainPage';
import { requisitionsTutorials } from './modules/requisitions';

export const tutorialRegistry: TutorialDefinition[] = [
  ...mainPageTutorials,
  ...requisitionsTutorials,
];

export const getTutorialById = (tutorialId: string) =>
  tutorialRegistry.find((tutorial) => tutorial.id === tutorialId) ?? null;

export const getTutorialsByModule = (moduleId: string) =>
  tutorialRegistry.filter((tutorial) => tutorial.moduleId === moduleId);

export const listTutorials = () => tutorialRegistry;

export type { TutorialDefinition, TutorialStep } from './types';
