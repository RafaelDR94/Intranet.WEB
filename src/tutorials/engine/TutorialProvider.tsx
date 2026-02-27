'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Config, Driver } from 'driver.js';

import {
  getTutorialById,
  getTutorialsByModule,
  listTutorials as listAllTutorials,
} from '../registry';
import type { TutorialDefinition, TutorialStatus, TutorialStep } from '../types';
import {
  tutorialStorage,
  type TutorialProgressEntry,
  type TutorialProgressMap,
} from '../storage/tutorialStorage';

export type TutorialStatusInfo = {
  status: TutorialStatus;
  version: number;
  updatedAt?: string;
  doNotAutoShow?: boolean;
  isUpdated: boolean;
};

export type TutorialContextValue = {
  listTutorials: (moduleId?: string) => TutorialDefinition[];
  getTutorialStatus: (tutorialId: string) => TutorialStatusInfo | null;
  startTutorial: (tutorialId: string) => Promise<void>;
  markCompleted: (tutorialId: string) => void;
  markDismissed: (tutorialId: string) => void;
  activeTutorialId: string | null;
  isTutorialActive: (tutorialId: string) => boolean;
};

type DriverFactory = (config?: Config) => Driver;

type TutorialProviderProps = {
  children: React.ReactNode;
};

const TutorialContext = createContext<TutorialContextValue | null>(null);

const isElementVisible = (element: Element) => {
  if (!(element instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    rect.width > 0 &&
    rect.height > 0
  );
};

const getVisibleElement = (selector: string) => {
  const matches = Array.from(document.querySelectorAll(selector));
  return matches.find(isElementVisible) ?? matches[0] ?? null;
};

const SKIP_BUTTON_ID = 'tutorial-skip-btn';

const removeSkipButton = () => {
  const existing = document.getElementById(SKIP_BUTTON_ID);
  if (existing) {
    existing.remove();
  }
};

const getSidebarControls = () => {
  if (typeof window === 'undefined') return null;
  return window.__tutorialSidebar ?? null;
};

declare global {
  interface Window {
    __tutorialSidebar?: {
      open: () => void;
      close: () => void;
    };
  }
}

const waitForTargets = async (
  selectors: string[],
  {
    timeoutMs = 4000,
    intervalMs = 200,
    minVisible = selectors.length,
  }: { timeoutMs?: number; intervalMs?: number; minVisible?: number } = {}
) => {
  if (selectors.length === 0) return true;
  const start = Date.now();

  const visibleCount = () =>
    selectors.reduce((count, selector) => (getVisibleElement(selector) ? count + 1 : count), 0);
  if (visibleCount() >= minVisible) return true;

  return new Promise<boolean>((resolve) => {
    const tick = () => {
      if (visibleCount() >= minVisible) {
        resolve(true);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });
};

const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(max-width: 768px)').matches ?? false;
};

const buildStatusInfo = (
  tutorial: TutorialDefinition,
  entry: TutorialProgressEntry | null
): TutorialStatusInfo => {
  if (!entry) {
    return {
      status: 'notSeen',
      version: tutorial.version,
      isUpdated: false,
    };
  }

  return {
    status: entry.status,
    version: entry.version,
    updatedAt: entry.updatedAt,
    doNotAutoShow: entry.doNotAutoShow,
    isUpdated: entry.version < tutorial.version,
  };
};

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<TutorialProgressMap>({});
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const driverFactoryRef = useRef<DriverFactory | null>(null);
  const pendingStartRef = useRef<string | null>(null);
  const completionRef = useRef(false);

  useEffect(() => {
    setProgress(tutorialStorage.readAll());
  }, []);

  const updateProgressEntry = useCallback(
    (tutorialId: string, next: TutorialProgressEntry) => {
      const data = tutorialStorage.readAll();
      const updated: TutorialProgressMap = {
        ...data,
        [tutorialId]: next,
      };
      tutorialStorage.writeAll(updated);
      setProgress(updated);
    },
    []
  );

  const markStatus = useCallback(
    (tutorialId: string, status: TutorialStatus) => {
      const tutorial = getTutorialById(tutorialId);
      if (!tutorial) return;
      const next: TutorialProgressEntry = {
        status,
        version: tutorial.version,
        updatedAt: new Date().toISOString(),
        doNotAutoShow: true,
      };
      updateProgressEntry(tutorialId, next);
    },
    [updateProgressEntry]
  );

  const markCompleted = useCallback(
    (tutorialId: string) => {
      markStatus(tutorialId, 'completed');
    },
    [markStatus]
  );

  const markDismissed = useCallback(
    (tutorialId: string) => {
      markStatus(tutorialId, 'dismissed');
    },
    [markStatus]
  );

  const listTutorials = useCallback((moduleId?: string) => {
    if (moduleId) {
      return getTutorialsByModule(moduleId);
    }
    return listAllTutorials();
  }, []);

  const getTutorialStatus = useCallback(
    (tutorialId: string): TutorialStatusInfo | null => {
      const tutorial = getTutorialById(tutorialId);
      if (!tutorial) return null;
      const entry = progress[tutorialId] ?? tutorialStorage.getEntry(tutorialId);
      return buildStatusInfo(tutorial, entry);
    },
    [progress]
  );

  const startTutorial = useCallback(
    async (tutorialId: string) => {
      const tutorial = getTutorialById(tutorialId);
      if (!tutorial) return;

      if (!driverFactoryRef.current) {
        pendingStartRef.current = tutorialId;
        return;
      }

      if (typeof document === 'undefined') return;

      const isMobile = getIsMobile();

      const stepsByDevice = tutorial.steps.filter((step) => {
        if (step.onlyMobile && !isMobile) return false;
        if (step.onlyDesktop && isMobile) return false;
        return true;
      });

      const selectors = stepsByDevice.map((step) => step.target).filter(Boolean);
      const targetsReady = await waitForTargets(selectors, { minVisible: 1 });
      if (!targetsReady) return;

      if (stepsByDevice.length === 0) return;

      completionRef.current = false;

      const steps = stepsByDevice.map((step) => ({
        element: () => getVisibleElement(step.target) ?? undefined,
        meta: step,
        popover: {
          title: step.title,
          description: step.description,
          side: isMobile ? 'over' : step.popoverSide ?? 'bottom',
          align: isMobile ? 'center' : step.popoverAlign ?? 'start',
        },
      }));

      const handleSidebarForStep = (step?: TutorialStep) => {
        if (!step || !isMobile) return;
        if (!step.sidebar) return;
        const controls = getSidebarControls();
        if (!controls) return;
        if (step.sidebar === 'open') controls.open();
        if (step.sidebar === 'close') controls.close();
      };

      const moveToWithSidebar = (driver: Driver, targetIndex: number) => {
        const step = steps[targetIndex]?.meta as TutorialStep | undefined;
        handleSidebarForStep(step);
        window.setTimeout(() => driver.moveTo(targetIndex), 250);
      };

      const driverObj = driverFactoryRef.current({
        steps,
        showProgress: true,
        allowClose: true,
        smoothScroll: true,
        stagePadding: isMobile ? 8 : 12,
        stageRadius: 8,
        overlayClickBehavior: 'close',
        popoverClass: isMobile
          ? 'driver-popover--dr driver-popover--mobile'
          : 'driver-popover--dr',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Finalizar',
        onHighlightStarted: (element, step, opts) => {
          handleSidebarForStep((step as TutorialStep | undefined));
          if (element instanceof HTMLElement) {
            element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
          }
          opts.driver.refresh();
        },
        onCloseClick: (_element, _step, opts) => {
          opts.driver.destroy();
        },
        onPrevClick: (_element, _step, opts) => {
          if (opts.driver.isFirstStep()) return;
          moveToWithSidebar(opts.driver, (opts.driver.getActiveIndex() ?? 0) - 1);
        },
        onNextClick: (_element, _step, opts) => {
          if (opts.driver.isLastStep()) {
            opts.driver.destroy();
            return;
          }
          const currentIndex = opts.driver.getActiveIndex() ?? 0;
          const currentStep = steps[currentIndex]?.meta as TutorialStep | undefined;
          const nextIndex = currentIndex + 1;

          if (currentStep?.nextAction === 'click') {
            const targetEl = getVisibleElement(currentStep.target);
            if (targetEl instanceof HTMLElement) {
              targetEl.click();
            }
            if (currentStep.nextTutorialId) {
              const nextTutorial = getTutorialById(currentStep.nextTutorialId);
              if (nextTutorial) {
                const nextSelectors = nextTutorial.steps.map((step) => step.target);
                void waitForTargets(nextSelectors, { minVisible: 1 }).then(() => {
                  void startTutorial(currentStep.nextTutorialId!);
                });
              }
              opts.driver.destroy();
              return;
            }
            const nextTarget = steps[nextIndex]?.meta?.target;
            if (nextTarget) {
              void waitForTargets([nextTarget], { minVisible: 1 }).then(() => {
                moveToWithSidebar(opts.driver, nextIndex);
              });
              return;
            }
          }

          moveToWithSidebar(opts.driver, nextIndex);
        },
        onPopoverRender: (popover, opts) => {
          const isLast = opts.driver.isLastStep();

          popover.wrapper.classList.add('driver-popover--dr');
          popover.title?.classList.add('text-s1', 'font-semibold', 'text-gray-90');
          popover.description?.classList.add('text-b3', 'text-gray-70');
          popover.footer?.classList.add('driver-footer--dr');

          popover.progress?.classList.add('text-c2', 'text-gray-60');

          popover.closeButton.classList.add('driver-close--dr');
          popover.closeButton.setAttribute('aria-label', 'Cerrar tutorial');
          popover.closeButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `;

          popover.previousButton.textContent = 'Anterior';
          popover.nextButton.textContent = isLast ? 'Finalizar' : 'Siguiente';

          popover.previousButton.classList.add('driver-btn', 'driver-btn-outline');
          popover.nextButton.classList.add('driver-btn', 'driver-btn-solid');
        },
        onDestroyStarted: (_element, _step, opts) => {
          completionRef.current = Boolean(opts.driver.isLastStep());
        },
        onDestroyed: () => {
          removeSkipButton();
          const status: TutorialStatus = completionRef.current ? 'completed' : 'dismissed';
          markStatus(tutorialId, status);
          completionRef.current = false;
          setActiveTutorialId(null);
        },
      });

      setActiveTutorialId(tutorialId);
      removeSkipButton();
      const skipButton = document.createElement('button');
      skipButton.id = SKIP_BUTTON_ID;
      skipButton.type = 'button';
      skipButton.className = 'driver-skip-btn';
      skipButton.textContent = 'Saltar tutorial';
      const handleSkip = () => {
        completionRef.current = false;
        driverObj.destroy();
      };
      skipButton.addEventListener('click', handleSkip);
      document.body.appendChild(skipButton);

      handleSidebarForStep((steps[0]?.meta as TutorialStep | undefined));
      if (steps[0]?.meta?.sidebar) {
        window.setTimeout(() => driverObj.drive(0), 250);
      } else {
        driverObj.drive();
      }
    },
    [markStatus]
  );

  useEffect(() => {
    let mounted = true;

    const loadDriver = async () => {
      const mod = await import('driver.js');
      if (!mounted) return;
      driverFactoryRef.current = mod.driver;
      if (pendingStartRef.current) {
        const pendingId = pendingStartRef.current;
        pendingStartRef.current = null;
        void startTutorial(pendingId);
      }
    };

    loadDriver();

    return () => {
      mounted = false;
    };
  }, [startTutorial]);

  const value = useMemo<TutorialContextValue>(
    () => ({
      listTutorials,
      getTutorialStatus,
      startTutorial,
      markCompleted,
      markDismissed,
      activeTutorialId,
      isTutorialActive: (tutorialId: string) => activeTutorialId === tutorialId,
    }),
    [
      activeTutorialId,
      getTutorialStatus,
      listTutorials,
      markCompleted,
      markDismissed,
      startTutorial,
    ]
  );

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
};

export const useTutorials = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorials must be used within TutorialProvider');
  }
  return context;
};

export default TutorialProvider;
