import { lazy, Suspense, memo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Critical path - load immediately
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Lazy load non-critical routes
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const PersonalBrand = lazy(() => import("@/pages/PersonalBrand"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const GetStarted = lazy(() => import("@/pages/GetStarted"));
const Contact = lazy(() => import("@/pages/Contact"));
const PublicProfile = lazy(() => import("@/pages/PublicProfile"));

// Auth pages - lazy load
const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

// Legal pages - lazy load
const Privacy = lazy(() => import("@/pages/legal/Privacy"));
const Terms = lazy(() => import("@/pages/legal/Terms"));

// App (authenticated) pages - lazy load
const AppLayout = lazy(() => import("@/pages/app/AppLayout"));
const Dashboard = lazy(() => import("@/pages/app/Dashboard"));
const Onboarding = lazy(() => import("@/pages/app/Onboarding"));
const BusinessStarter = lazy(() => import("@/pages/app/BusinessStarter"));
const BusinessCredit = lazy(() => import("@/pages/app/BusinessCredit"));
const PersonalBrandBuilder = lazy(() => import("@/pages/app/PersonalBrandBuilder"));
const Resources = lazy(() => import("@/pages/app/Resources"));
const Account = lazy(() => import("@/pages/app/Account"));
const Support = lazy(() => import("@/pages/app/Support"));
const Analytics = lazy(() => import("@/pages/app/Analytics"));
const Achievements = lazy(() => import("@/pages/app/Achievements"));
const CheckoutSuccess = lazy(() => import("@/pages/app/CheckoutSuccess"));

// Admin pages - lazy load
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminPlans = lazy(() => import("@/pages/admin/AdminPlans"));
const AdminAnnouncements = lazy(() => import("@/pages/admin/AdminAnnouncements"));

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
  );
});