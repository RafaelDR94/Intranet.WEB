import React, { Component, ErrorInfo } from "react";
import { FirebaseContext } from "@/app/context/FirebaseContext/FirebaseContext";
import { currentDateDataBase, getTime } from "@/app/utilities/DatesHelper/Dateshelper";
import { isProduction } from "@/app/configurations/Axios/Clients";
import ErrorScreen from "../ErrorScreen/ErroScreen";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = FirebaseContext;
  declare context: React.ContextType<typeof FirebaseContext>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const path = isProduction() ? "Production" : "Sandbox";
    console.error("ErrorBoundary caught an error", error, errorInfo);

    this.setState({ error, errorInfo });

    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    if (this.context && this.context.firebaserealtime) {
      this.context.firebaserealtime
        .pushData(
          "Logs/" + path + "/Front/" + currentDateDataBase() + "/" + getTime(),
          errorData
        )
        .catch((err: any) => console.error("Error al registrar en Firebase:", err));
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          title="Se produjo un error"
          message="Estamos registrando el incidente. Puedes volver al inicio o reintentar."
          error={this.state.error}
          stack={this.state.error?.stack ?? null}
          componentStack={this.state.errorInfo?.componentStack ?? null}
          onGoHome={() => window.location.assign('/')}
          onRetry={() => window.location.reload()}
          // En producción ocultamos detalles por defecto; si quieres verlos, usa forceShowDetails
          // forceShowDetails
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
