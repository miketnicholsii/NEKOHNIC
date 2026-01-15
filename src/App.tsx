import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider } from "@/components/AuthProvider";
import { AdminPreviewProvider } from "@/components/AdminPreviewProvider";
import { UpgradeModalProvider } from "@/components/UpgradeModalProvider";
import { AdminPreviewIndicator } from "@/components/admin/AdminPreviewPanel";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { FloatingCTA } from "@/components/FloatingCTA";
import ScrollManager from "@/components/ScrollManager";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { MissingConfigScreen } from "@/components/MissingConfigScreen";
import { hasSupabaseConfig } from "@/lib/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2, // Retry failed queries twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <GlobalErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {hasSupabaseConfig() ? (
            <AuthProvider>
              <AdminPreviewProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollManager />
                  <UpgradeModalProvider>
                    <AnimatedRoutes />
                    <FloatingCTA />
                    <AdminPreviewIndicator />
                  </UpgradeModalProvider>
                </BrowserRouter>
                <SpeedInsights />
              </AdminPreviewProvider>
            </AuthProvider>
          ) : (
            <MissingConfigScreen />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </GlobalErrorBoundary>
);

export default App;
