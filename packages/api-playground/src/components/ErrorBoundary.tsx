import { Component, ReactNode } from 'react';
import { Typography } from '~/shared/typography';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[APIPlayground] Component error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-8 spr-ui-01">
          <Typography variant="h4">Something went wrong</Typography>
          <Typography variant="body-14" className="spr-text-03">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </Typography>
        </div>
      );
    }
    return this.props.children;
  }
}
