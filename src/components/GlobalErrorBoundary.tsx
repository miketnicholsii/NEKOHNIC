import { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import logger from "@/lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global error boundary that wraps the entire app
 * Catches unhandled errors and displays a user-friendly recovery UI
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log the error
    logger.uiError("Global error boundary triggered", {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500),
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReportProblem = () => {
    const subject = encodeURIComponent("Problem Report - NÈKO App");
    const errorDetails = this.state.error?.message || "Unknown error";
    const logSummary = logger.getLogSummary();
    
    const body = encodeURIComponent(
      `Hi NÈKO Team,\n\n` +
      `I encountered an issue while using the app.\n\n` +
      `--- Technical Details ---\n` +
      `Error: ${errorDetails}\n` +
      `Time: ${new Date().toISOString()}\n` +
      `URL: ${window.location.href}\n` +
      `Browser: ${navigator.userAgent.slice(0, 100)}\n\n` +
      `Recent Logs:\n${logSummary}\n\n` +
      `--- Description ---\n` +
      `[Please describe what you were doing when this happened]\n\n`
    );
    
    window.open(`mailto:support@helloneko.co?subject=${subject}&body=${body}`, "_blank");
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl font-display">Something went wrong</CardTitle>
              <CardDescription className="text-muted-foreground">
                We've run into an unexpected issue. Don't worry — your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error details (collapsed by default) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-xs bg-muted rounded-lg p-3">
                  <summary className="cursor-pointer text-muted-foreground font-medium">
                    Technical details
                  </summary>
                  <pre className="mt-2 overflow-auto text-destructive whitespace-pre-wrap break-words">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              {/* Action buttons */}
              <div className="grid gap-2">
                <Button onClick={this.handleReload} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reload App
                </Button>
                
                <Button onClick={this.handleGoHome} variant="outline" className="w-full gap-2">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Go to Homepage
                </Button>
                
                <Button 
                  onClick={this.handleReportProblem} 
                  variant="ghost" 
                  className="w-full gap-2 text-muted-foreground"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Report Problem
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                If this keeps happening, please{" "}
                <button 
                  onClick={this.handleReportProblem}
                  className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  let us know
                </button>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
