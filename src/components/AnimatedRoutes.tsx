import { Suspense, memo } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyBoundary, lazyWithRetry } from "@/components/LazyBoundary";

// Critical path - load immediately (main nav pages)
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Services from "@/pages/Services";
import PersonalBrand from "@/pages/PersonalBrand";
import Pricing from "@/pages/Pricing";

// Lazy load secondary routes with retry logic
const GetStarted = lazyWithRetry(() => import("@/pages/GetStarted"));
const Contact = lazyWithRetry(() => import("@/pages/Contact"));
const PublicProfile = lazyWithRetry(() => import("@/pages/PublicProfile"));
const ResourcesPreview = lazyWithRetry(() => import("@/pages/ResourcesPreview"));

// Auth pages - lazy load with retry
const Login = lazyWithRetry(() => import("@/pages/Login"));
const Signup = lazyWithRetry(() => import("@/pages/Signup"));
const ForgotPassword = lazyWithRetry(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazyWithRetry(() => import("@/pages/ResetPassword"));

// Legal pages - lazy load with retry
const Privacy = lazyWithRetry(() => import("@/pages/legal/Privacy"));
const Terms = lazyWithRetry(() => import("@/pages/legal/Terms"));

// App (authenticated) pages - lazy load with retry
const AppLayout = lazyWithRetry(() => import("@/pages/app/AppLayout"));
const Dashboard = lazyWithRetry(() => import("@/pages/app/Dashboard"));
const Onboarding = lazyWithRetry(() => import("@/pages/app/Onboarding"));
const BusinessStarter = lazyWithRetry(() => import("@/pages/app/BusinessStarter"));
const BusinessCredit = lazyWithRetry(() => import("@/pages/app/BusinessCredit"));
const PersonalBrandBuilder = lazyWithRetry(() => import("@/pages/app/PersonalBrandBuilder"));
const Resources = lazyWithRetry(() => import("@/pages/app/Resources"));
const ResourceDetail = lazyWithRetry(() => import("@/pages/app/ResourceDetail"));
const Strategy = lazyWithRetry(() => import("@/pages/app/Strategy"));
const Account = lazyWithRetry(() => import("@/pages/app/Account"));
const Support = lazyWithRetry(() => import("@/pages/app/Support"));
const Analytics = lazyWithRetry(() => import("@/pages/app/Analytics"));
const Achievements = lazyWithRetry(() => import("@/pages/app/Achievements"));
const CheckoutSuccess = lazyWithRetry(() => import("@/pages/app/CheckoutSuccess"));

// Admin pages - lazy load with retry
const AdminLayout = lazyWithRetry(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazyWithRetry(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazyWithRetry(() => import("@/pages/admin/AdminUsers"));
const AdminContent = lazyWithRetry(() => import("@/pages/admin/AdminContent"));
const AdminPlans = lazyWithRetry(() => import("@/pages/admin/AdminPlans"));
const AdminAnnouncements = lazyWithRetry(() => import("@/pages/admin/AdminAnnouncements"));
const AdminDiagnostics = lazyWithRetry(() => import("@/pages/admin/Diagnostics"));

// Loading fallback component - simplified for faster render
const PageLoader = memo(function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 w-full max-w-md px-8">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
});

// Removed AnimatePresence for performance - causing page load issues
export const AnimatedRoutes = memo(function AnimatedRoutes() {
  return (
    <LazyBoundary>
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
          <Route path="/resources" element={<ResourcesPreview />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
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
            <Route path="resources/:id" element={<ResourceDetail />} />
            <Route path="strategy" element={<Strategy />} />
            <Route path="account" element={<Account />} />
            <Route path="support" element={<Support />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="checkout-success" element={<CheckoutSuccess />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="diagnostics" element={<AdminDiagnostics />} />
          </Route>
          
          {/* Public profile route */}
          <Route path="/p/:slug" element={<PublicProfile />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </LazyBoundary>
  );
});
