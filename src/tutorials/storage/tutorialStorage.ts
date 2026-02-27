import type { TutorialStatus } from '../types';

export const TUTORIAL_STORAGE_KEY = 'tutorialProgress:v1';

export type TutorialProgressEntry = {
  status: TutorialStatus;
  version: number;
  updatedAt: string;
  doNotAutoShow?: boolean;
};

export type TutorialProgressMap = Record<string, TutorialProgressEntry>;

const isBrowser = () => typeof window !== 'undefined';

const safeParse = (raw: string | null): TutorialProgressMap => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as TutorialProgressMap;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
};

export const tutorialStorage = {
  readAll: (): TutorialProgressMap => {
    if (!isBrowser()) return {};
    const raw = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
    return safeParse(raw);
  },
  writeAll: (data: TutorialProgressMap) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(data));
  },
  getEntry: (tutorialId: string): TutorialProgressEntry | null => {
    const data = tutorialStorage.readAll();
    return data[tutorialId] ?? null;
  },
  setEntry: (tutorialId: string, entry: TutorialProgressEntry) => {
    const data = tutorialStorage.readAll();
    data[tutorialId] = entry;
    tutorialStorage.writeAll(data);
  },
  mergeEntry: (
    tutorialId: string,
    patch: Partial<TutorialProgressEntry> & { status: TutorialStatus; version: number }
  ): TutorialProgressEntry => {
    const data = tutorialStorage.readAll();
    const next: TutorialProgressEntry = {
      status: patch.status,
      version: patch.version,
      updatedAt: patch.updatedAt ?? new Date().toISOString(),
      doNotAutoShow: patch.doNotAutoShow ?? data[tutorialId]?.doNotAutoShow,
    };
    data[tutorialId] = next;
    tutorialStorage.writeAll(data);
    return next;
  },
};
