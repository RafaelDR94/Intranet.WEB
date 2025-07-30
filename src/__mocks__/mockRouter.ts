import type { MockRouter } from './mockRouter.types';

export const createMockRouter = (): MockRouter => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  refresh: () => {},
});
