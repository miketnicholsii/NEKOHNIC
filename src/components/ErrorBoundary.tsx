import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string; // Widget/component name for debugging
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught error in ${this.props.name || "component"}:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default minimal error UI
      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {this.props.name ? `${this.props.name} failed to load` : "Something went wrong"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={this.handleRetry}
                className="shrink-0"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Wrapper component for easier usage with widgets
interface WidgetErrorBoundaryProps {
  children: ReactNode;
  name: string;
}

export function WidgetErrorBoundary({ children, name }: WidgetErrorBoundaryProps) {
  return (
    <ErrorBoundary name={name}>
      {children}
    </ErrorBoundary>
  );
}
