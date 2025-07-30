import useLogin from "./hooks/useLogin";
export type LoginPageProps = {
  routerOverride?: ReturnType<typeof useLogin> extends (arg: infer R) => any ? R : never;
};
