import { Suspense, memo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyBoundary, lazyWithRetry } from "@/components/LazyBoundary";

// Critical path - load immediately
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Lazy load non-critical routes with retry logic
const About = lazyWithRetry(() => import("@/pages/About"));
const Services = lazyWithRetry(() => import("@/pages/Services"));
const PersonalBrand = lazyWithRetry(() => import("@/pages/PersonalBrand"));
const Pricing = lazyWithRetry(() => import("@/pages/Pricing"));
const GetStarted = lazyWithRetry(() => import("@/pages/GetStarted"));
const Contact = lazyWithRetry(() => import("@/pages/Contact"));
const PublicProfile = lazyWithRetry(() => import("@/pages/PublicProfile"));

// Auth pages - lazy load with retry
const Login = lazyWithRetry(() => import("@/pages/Login"));
const ForgotPassword = lazyWithRetry(() => import("@/pages/ForgotPassword"));

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

// Lightweight page transitions for performance
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] as const } },
};

const AnimatedPage = memo(function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" className="min-h-full">
      {children}
    </motion.div>
  );
});

export const AnimatedRoutes = memo(function AnimatedRoutes() {
  const location = useLocation();
  
  // Get the base path for animation key (prevents re-animating nested routes)
  const getAnimationKey = () => {
    const path = location.pathname;
    // For app and admin routes, use the base path to prevent re-animation on nested nav
    if (path.startsWith('/app')) return '/app';
    if (path.startsWith('/admin')) return '/admin';
    return path;
  };

  return (
    <LazyBoundary>
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<PageLoader />} key={getAnimationKey()}>
          <Routes location={location} key={getAnimationKey()}>
          {/* Public routes */}
          <Route path="/" element={<AnimatedPage><Index /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
          <Route path="/services" element={<AnimatedPage><Services /></AnimatedPage>} />
          <Route path="/personal-brand" element={<AnimatedPage><PersonalBrand /></AnimatedPage>} />
          <Route path="/pricing" element={<AnimatedPage><Pricing /></AnimatedPage>} />
          <Route path="/get-started" element={<AnimatedPage><GetStarted /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          
          {/* Auth routes */}
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
          
          {/* Legal routes */}
          <Route path="/legal/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
          <Route path="/legal/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
          
          {/* Authenticated app routes - no page transition on nested routes */}
          <Route path="/app" element={<AnimatedPage><AppLayout /></AnimatedPage>}>
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
            <Route path="checkout-success" element={<CheckoutSuccess />} />
          </Route>
          
          {/* Admin routes - no page transition on nested routes */}
          <Route path="/admin" element={<AnimatedPage><AdminLayout /></AnimatedPage>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Route>
          
          {/* Public profile route */}
          <Route path="/p/:slug" element={<AnimatedPage><PublicProfile /></AnimatedPage>} />
          
          {/* Fallback */}
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  </LazyBoundary>
  );
});