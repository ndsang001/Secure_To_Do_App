import React, { ReactNode } from 'react';
import { ErrorInfo } from 'react';
import ErrorPage from './ErrorPage';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * GlobalErrorBoundary is a React component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays a fallback UI.
 * It is used to prevent the entire application from crashing due to an error in a single component.
 */ 
export default class GlobalErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
