import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

// Critical path - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical routes
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const PersonalBrand = lazy(() => import("./pages/PersonalBrand"));
const Pricing = lazy(() => import("./pages/Pricing"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Contact = lazy(() => import("./pages/Contact"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

// Auth pages - lazy load
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Legal pages - lazy load
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));

// App (authenticated) pages - lazy load
const AppLayout = lazy(() => import("./pages/app/AppLayout"));
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const Onboarding = lazy(() => import("./pages/app/Onboarding"));
const BusinessStarter = lazy(() => import("./pages/app/BusinessStarter"));
const BusinessCredit = lazy(() => import("./pages/app/BusinessCredit"));
const PersonalBrandBuilder = lazy(() => import("./pages/app/PersonalBrandBuilder"));
const Resources = lazy(() => import("./pages/app/Resources"));
const Account = lazy(() => import("./pages/app/Account"));
const Support = lazy(() => import("./pages/app/Support"));
const Analytics = lazy(() => import("./pages/app/Analytics"));
const Achievements = lazy(() => import("./pages/app/Achievements"));

// Admin pages - lazy load
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminAnnouncements = lazy(() => import("./pages/admin/AdminAnnouncements"));

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

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 w-full max-w-md px-8">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/personal-brand" element={<PersonalBrand />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Legal routes */}
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/terms" element={<Terms />} />
                
                {/* Authenticated app routes */}
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="business-starter" element={<BusinessStarter />} />
                  <Route path="business-credit" element={<BusinessCredit />} />
                  <Route path="personal-brand" element={<PersonalBrandBuilder />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="account" element={<Account />} />
                  <Route path="support" element={<Support />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="achievements" element={<Achievements />} />
                </Route>
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="plans" element={<AdminPlans />} />
                  <Route path="announcements" element={<AdminAnnouncements />} />
                </Route>
                
                {/* Public profile route */}
                <Route path="/p/:slug" element={<PublicProfile />} />
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
