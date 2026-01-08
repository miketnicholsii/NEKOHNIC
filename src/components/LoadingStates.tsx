// Loading States Component
// Centralized loading UI components for consistent UX across the app
// Per Engineering Standards: "All React components must handle loading, empty, and error states"

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2, Inbox, AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================================================
// LOADING STATES
// ============================================================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

/**
 * Simple loading spinner with optional label
 */
export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} aria-hidden="true" />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Full-card loading state with centered spinner
 */
export function LoadingCard({ title, description, className }: LoadingCardProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        {title && (
          <h3 className="font-medium text-foreground mb-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  blur?: boolean;
  className?: string;
}

/**
 * Overlay loading state that covers content while loading
 */
export function LoadingOverlay({ isLoading, children, blur = true, className }: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-background/80 z-10",
            blur && "backdrop-blur-sm"
          )}
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner size="lg" label="Loading..." />
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// SKELETON PATTERNS
// ============================================================================

/**
 * Skeleton for a typical card with title and content
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for a list item
 */
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a stat card
 */
export function StatSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMPTY STATES
// ============================================================================

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Empty state component for when there's no data to display
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center py-12", className)}
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden="true" />}
      </div>
      <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// ============================================================================
// ERROR STATES
// ============================================================================

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  showDetails?: boolean;
  variant?: "full" | "inline" | "card";
  className?: string;
}

/**
 * Error state component for displaying errors with optional retry
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  error,
  onRetry,
  showDetails = false,
  variant = "card",
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)} role="alert">
        <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm">{description || errorMessage || title}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="ml-2 h-6 px-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("min-h-[300px] flex items-center justify-center p-8", className)} role="alert">
        <div className="text-center max-w-md">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
          </div>
          <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description || "We encountered an error. Please try again."}
          </p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {showDetails && errorMessage && (
            <details className="mt-4 text-left text-xs bg-muted rounded-lg p-3">
              <summary className="cursor-pointer text-muted-foreground">Technical details</summary>
              <pre className="mt-2 overflow-auto text-destructive">{errorMessage}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <Card className={cn("border-destructive/20 bg-destructive/5", className)} role="alert">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="p-2 rounded-lg bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {description || errorMessage || "An error occurred"}
          </p>
        </div>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NETWORK ERROR STATE
// ============================================================================

interface NetworkErrorProps {
  onRetry?: () => void;
  className?: string;
}

/**
 * Specialized error state for network/connectivity issues
 */
export function NetworkError({ onRetry, className }: NetworkErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center py-12", className)}
      role="alert"
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <WifiOff className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-display font-semibold text-foreground mb-2">Connection Problem</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        We couldn't connect to our servers. Check your internet connection and try again.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

// ============================================================================
// CONDITIONAL WRAPPER
// ============================================================================

interface AsyncStateProps<T> {
  isLoading: boolean;
  error?: Error | string | null;
  data: T | null | undefined;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  emptyFallback?: ReactNode;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
  isEmpty?: (data: T) => boolean;
  className?: string;
}

/**
 * Wrapper component that handles async state (loading, error, empty, data)
 * 
 * @example
 * ```tsx
 * <AsyncState
 *   isLoading={isLoading}
 *   error={error}
 *   data={users}
 *   isEmpty={(data) => data.length === 0}
 *   onRetry={refetch}
 *   emptyFallback={<EmptyState title="No users found" />}
 * >
 *   {(users) => <UserList users={users} />}
 * </AsyncState>
 * ```
 */
export function AsyncState<T>({
  isLoading,
  error,
  data,
  loadingFallback,
  errorFallback,
  emptyFallback,
  onRetry,
  children,
  isEmpty,
  className,
}: AsyncStateProps<T>) {
  // Loading state
  if (isLoading) {
    return <>{loadingFallback || <LoadingCard className={className} />}</>;
  }

  // Error state
  if (error) {
    return (
      <>
        {errorFallback || (
          <ErrorState
            error={error}
            onRetry={onRetry}
            variant="card"
            className={className}
          />
        )}
      </>
    );
  }

  // Empty/null data state
  if (data === null || data === undefined) {
    return (
      <>
        {emptyFallback || (
          <EmptyState
            title="No data found"
            description="There's nothing here yet."
            className={className}
          />
        )}
      </>
    );
  }

  // Custom empty check
  if (isEmpty && isEmpty(data)) {
    return (
      <>
        {emptyFallback || (
          <EmptyState
            title="No data found"
            description="There's nothing here yet."
            className={className}
          />
        )}
      </>
    );
  }

  // Data available - render children
  return <>{children(data)}</>;
}
