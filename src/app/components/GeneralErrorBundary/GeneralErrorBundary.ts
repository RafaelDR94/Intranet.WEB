"use client"
import React, { Component, ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class GeneralErrorBundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {


    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        error;
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            window.location.href = "/";


            return null;
        }

        return this.props.children;
    }
}

export default GeneralErrorBundary;
