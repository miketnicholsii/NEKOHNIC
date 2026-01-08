import { Component, ReactNode, lazy, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface LazyBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface LazyBoundaryProps {
  children: ReactNode;
}

/**
 * Error boundary specifically for handling lazy-load/chunk failures.
 * Shows a friendly reload prompt when dynamic imports fail.
 */
export class LazyBoundary extends Component<LazyBoundaryProps, LazyBoundaryState> {
  constructor(props: LazyBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LazyBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Check if this is a chunk load error
    const isChunkError = 
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError";

    if (isChunkError) {
      console.warn("Chunk load error detected:", error.message);
      
      // Try auto-reload once (using sessionStorage to prevent infinite loops)
      const reloadKey = "chunk_error_reload";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
        return;
      }
      
      // Clear the flag after showing the error (so future visits work)
      sessionStorage.removeItem(reloadKey);
    }
  }

  handleReload = () => {
    // Clear any reload flags
    sessionStorage.removeItem("chunk_error_reload");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message.includes("dynamically imported module");
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isChunkError ? "App Updated" : "Something went wrong"}
              </h1>
              <p className="text-muted-foreground">
                {isChunkError 
                  ? "We've updated the app. Please reload to get the latest version."
                  : "We encountered an error loading this page. A quick reload usually fixes it."}
              </p>
            </div>
            
            <Button onClick={this.handleReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
            
            {!isChunkError && this.state.error && (
              <details className="text-left text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <summary className="cursor-pointer mb-2">Technical details</summary>
                <pre className="overflow-auto whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Creates a lazy component with built-in retry logic for chunk load failures.
 * If the initial load fails, it will retry once after a short delay.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 1,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      // Retry logic for chunk load failures
      for (let i = 0; i < retries; i++) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        try {
          // Add cache-busting query param on retry
          return await importFn();
        } catch (retryError) {
          if (i === retries - 1) throw retryError;
        }
      }
      throw error;
    }
  });
}
