export type MockRouter = {
  push: (url: string) => void;
  replace: (url: string) => void;
  prefetch: (url: string) => void;
  refresh: () => void;
};
