'use client';

import { useEffect, useRef } from 'react';

import { useTutorials } from './TutorialProvider';

export type UseTutorialAutoRunOptions = {
  moduleId: string;
  tutorialId: string;
};

const isElementVisible = (element: Element) => {
  if (!(element instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const withinViewport =
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth;
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    rect.width > 0 &&
    rect.height > 0 &&
    withinViewport
  );
};

const getVisibleElement = (selector: string) => {
  const matches = Array.from(document.querySelectorAll(selector));
  return matches.find(isElementVisible) ?? matches[0] ?? null;
};

const waitForTargets = async (
  selectors: string[],
  {
    timeoutMs = 800,
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

export const useTutorialAutoRun = ({ moduleId, tutorialId }: UseTutorialAutoRunOptions) => {
  const { getTutorialStatus, listTutorials, startTutorial } = useTutorials();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    if (!moduleId || !tutorialId) return;
    if (process.env.NODE_ENV === 'test') return;

    const available = listTutorials(moduleId);
    const tutorial = available.find((item) => item.id === tutorialId);
    if (!tutorial) return;

    const status = getTutorialStatus(tutorialId);
    if (!status || status.status !== 'notSeen' || status.doNotAutoShow) return;

    if (typeof document === 'undefined') return;

    const attemptStart = async () => {
      const selectors = tutorial.steps.map((step) => step.target);
      const hasAnyTarget = await waitForTargets(selectors, { minVisible: 1 });
      if (!hasAnyTarget) return;
      hasRunRef.current = true;
      void startTutorial(tutorialId);
    };

    void attemptStart();
  }, [getTutorialStatus, listTutorials, moduleId, startTutorial, tutorialId]);
};

export default useTutorialAutoRun;
