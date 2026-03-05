import type { TutorialDefinition } from './types';
import { mainPageTutorials } from './modules/mainPage';
import { requisitionsTutorials } from './modules/requisitions';
import { ownRequisitionsTutorials } from './modules/ownRequisitions';
import { authorizationsTutorials } from './modules/authorizations';
import { treasuryTutorials } from './modules/treasury';
import { pettyCashTutorials } from './modules/pettyCash';
import { requestDocumentsTutorials } from './modules/requestDocuments';
import { requestAccesTutorials } from './modules/requestAcces';
import { accountingInvoicesTutorials } from './modules/accountingInvoices';
import { sipProjectsTutorials } from './modules/sipProjects';
import { generalServicesVehiclesTutorials } from './modules/generalServicesVehicles';
import { humanResourcesDocumentsTutorials } from './modules/humanResourcesDocuments';
import { administrationUsersTutorials } from './modules/administrationUsers';

export const tutorialRegistry: TutorialDefinition[] = [
  ...mainPageTutorials,
  ...requisitionsTutorials,
  ...ownRequisitionsTutorials,
  ...authorizationsTutorials,
  ...treasuryTutorials,
  ...pettyCashTutorials,
  ...requestDocumentsTutorials,
  ...requestAccesTutorials,
  ...accountingInvoicesTutorials,
  ...sipProjectsTutorials,
  ...generalServicesVehiclesTutorials,
  ...humanResourcesDocumentsTutorials,
  ...administrationUsersTutorials,
];

export const getTutorialById = (tutorialId: string) =>
  tutorialRegistry.find((tutorial) => tutorial.id === tutorialId) ?? null;

export const getTutorialsByModule = (moduleId: string) =>
  tutorialRegistry.filter((tutorial) => tutorial.moduleId === moduleId);

export const listTutorials = () => tutorialRegistry;

export type { TutorialDefinition, TutorialStep } from './types';




