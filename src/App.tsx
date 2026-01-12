import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminPreviewProvider } from "@/hooks/use-admin-preview";
import { UpgradeModalProvider } from "@/components/UpgradeModalProvider";
import { AdminPreviewIndicator } from "@/components/admin/AdminPreviewPanel";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { FloatingCTA } from "@/components/FloatingCTA";
import ScrollManager from "@/components/ScrollManager";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
          </AdminPreviewProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
