import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import PersonalBrand from "./pages/PersonalBrand";
import Pricing from "./pages/Pricing";
import GetStarted from "./pages/GetStarted";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// Legal pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";

// App (authenticated) pages
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Onboarding from "./pages/app/Onboarding";
import BusinessStarter from "./pages/app/BusinessStarter";
import BusinessCredit from "./pages/app/BusinessCredit";
import PersonalBrandBuilder from "./pages/app/PersonalBrandBuilder";
import Resources from "./pages/app/Resources";
import Account from "./pages/app/Account";
import Support from "./pages/app/Support";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);
export default App;
