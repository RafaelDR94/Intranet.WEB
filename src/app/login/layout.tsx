import { RecoverPasswordFlowProvider } from "./context/RecoverPasswordFlowContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecoverPasswordFlowProvider>{children}</RecoverPasswordFlowProvider>;
}
