/**
 * Mock Data for E2E Testing
 * 
 * These fixtures provide consistent mock data for API responses
 * when testing without a real backend connection.
 */

import type { TestUserCredentials } from "./test-users";

// ============================================
// User & Auth Mocks
// ============================================

export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
  created_at: string;
}

export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  user: MockUser;
}

export function createMockUser(credentials: TestUserCredentials): MockUser {
  return {
    id: `mock-user-${credentials.email.replace(/[^a-z0-9]/gi, "-")}`,
    email: credentials.email,
    user_metadata: {
      full_name: credentials.displayName,
    },
    created_at: new Date().toISOString(),
  };
}

export function createMockSession(user: MockUser): MockSession {
  return {
    access_token: `mock-access-token-${user.id}`,
    refresh_token: `mock-refresh-token-${user.id}`,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  };
}

// ============================================
// Profile Mocks
// ============================================

export interface MockProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  business_name: string | null;
  business_stage: string | null;
  industry: string | null;
  state: string | null;
  has_llc: boolean;
  has_ein: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function createMockProfile(
  userId: string,
  credentials: TestUserCredentials,
  overrides?: Partial<MockProfile>
): MockProfile {
  return {
    id: `profile-${userId}`,
    user_id: userId,
    full_name: credentials.displayName,
    avatar_url: null,
    business_name: credentials.onboardingCompleted ? "Test Business LLC" : null,
    business_stage: credentials.onboardingCompleted ? "launching" : null,
    industry: credentials.onboardingCompleted ? "Technology" : null,
    state: credentials.onboardingCompleted ? "CA" : null,
    has_llc: credentials.onboardingCompleted,
    has_ein: credentials.onboardingCompleted,
    onboarding_completed: credentials.onboardingCompleted,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// ============================================
// Subscription Mocks
// ============================================

export interface MockSubscription {
  id: string;
  user_id: string;
  plan: "free" | "start" | "build" | "scale";
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export function createMockSubscription(
  userId: string,
  tier: "free" | "start" | "build" | "scale",
  overrides?: Partial<MockSubscription>
): MockSubscription {
  const isPaid = tier !== "free";
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    id: `sub-${userId}`,
    user_id: userId,
    plan: tier,
    status: "active",
    current_period_start: isPaid ? now.toISOString() : null,
    current_period_end: isPaid ? periodEnd.toISOString() : null,
    cancel_at_period_end: false,
    stripe_subscription_id: isPaid ? `sub_mock_${userId}` : null,
    stripe_customer_id: isPaid ? `cus_mock_${userId}` : null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    ...overrides,
  };
}

// ============================================
// User Roles Mocks
// ============================================

export interface MockUserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

export function createMockUserRole(
  userId: string,
  role: "admin" | "moderator" | "user" = "user"
): MockUserRole {
  return {
    id: `role-${userId}`,
    user_id: userId,
    role,
    created_at: new Date().toISOString(),
  };
}

// ============================================
// Progress & Tasks Mocks
// ============================================

export interface MockProgress {
  id: string;
  user_id: string;
  module: string;
  step: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function createMockProgress(
  userId: string,
  module: string,
  step: string,
  completed = false
): MockProgress {
  return {
    id: `progress-${userId}-${module}-${step}`,
    user_id: userId,
    module,
    step,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
    notes: null,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export interface MockTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  module: string | null;
  step: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function createMockTask(
  userId: string,
  title: string,
  overrides?: Partial<MockTask>
): MockTask {
  return {
    id: `task-${userId}-${Date.now()}`,
    user_id: userId,
    title,
    description: null,
    status: "todo",
    priority: "medium",
    module: null,
    step: null,
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// ============================================
// Streaks & Achievements Mocks
// ============================================

export interface MockStreak {
  id: string;
  user_id: string;
  login_streak_current: number;
  login_streak_longest: number;
  task_streak_current: number;
  task_streak_longest: number;
  total_login_days: number;
  total_tasks_completed: number;
  last_login_date: string | null;
  last_task_date: string | null;
  created_at: string;
  updated_at: string;
}

export function createMockStreak(userId: string, active = true): MockStreak {
  return {
    id: `streak-${userId}`,
    user_id: userId,
    login_streak_current: active ? 5 : 0,
    login_streak_longest: 10,
    task_streak_current: active ? 3 : 0,
    task_streak_longest: 7,
    total_login_days: 25,
    total_tasks_completed: 15,
    last_login_date: active ? new Date().toISOString().split("T")[0] : null,
    last_task_date: active ? new Date().toISOString().split("T")[0] : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export interface MockAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function createMockAchievement(
  userId: string,
  achievementId: string
): MockAchievement {
  return {
    id: `achievement-${userId}-${achievementId}`,
    user_id: userId,
    achievement_id: achievementId,
    earned_at: new Date().toISOString(),
    metadata: {},
    created_at: new Date().toISOString(),
  };
}

// ============================================
// Resources Mocks
// ============================================

export interface MockResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  tier_required: "free" | "start" | "build" | "scale";
  is_published: boolean;
  read_time_minutes: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function createMockResources(): MockResource[] {
  return [
    {
      id: "resource-1",
      title: "Getting Started Guide",
      description: "Learn the basics of building your business",
      content: "# Getting Started\n\nWelcome to your business journey...",
      category: "guides",
      tier_required: "free",
      is_published: true,
      read_time_minutes: 5,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "resource-2",
      title: "LLC Formation Checklist",
      description: "Step-by-step LLC formation guide",
      content: "# LLC Formation\n\n1. Choose a name...",
      category: "checklists",
      tier_required: "start",
      is_published: true,
      read_time_minutes: 10,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "resource-3",
      title: "Advanced Credit Building",
      description: "Pro strategies for building business credit",
      content: "# Advanced Credit Building\n\nFor Pro members...",
      category: "guides",
      tier_required: "build",
      is_published: true,
      read_time_minutes: 15,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

// ============================================
// Announcements Mocks
// ============================================

export interface MockAnnouncement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  target: "all" | "free" | "paid";
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export function createMockAnnouncements(): MockAnnouncement[] {
  return [
    {
      id: "announcement-1",
      title: "Welcome to NÈKO",
      message: "Start your business journey today!",
      type: "info",
      target: "all",
      is_active: true,
      starts_at: new Date().toISOString(),
      ends_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

// ============================================
// Complete User Data Bundle
// ============================================

export interface MockUserData {
  user: MockUser;
  session: MockSession;
  profile: MockProfile;
  subscription: MockSubscription;
  roles: MockUserRole[];
  progress: MockProgress[];
  tasks: MockTask[];
  streak: MockStreak;
  achievements: MockAchievement[];
}

export function createMockUserData(credentials: TestUserCredentials): MockUserData {
  const user = createMockUser(credentials);
  const session = createMockSession(user);
  const profile = createMockProfile(user.id, credentials);
  const subscription = createMockSubscription(user.id, credentials.tier);
  const roles: MockUserRole[] = [createMockUserRole(user.id, credentials.isAdmin ? "admin" : "user")];

  const progress: MockProgress[] = credentials.onboardingCompleted
    ? [
        createMockProgress(user.id, "business_starter", "create_llc", true),
        createMockProgress(user.id, "business_starter", "get_ein", true),
        createMockProgress(user.id, "business_starter", "open_business_bank", false),
      ]
    : [];

  const tasks: MockTask[] = credentials.onboardingCompleted
    ? [
        createMockTask(user.id, "Complete LLC registration", { status: "done", module: "business_starter" }),
        createMockTask(user.id, "Apply for EIN", { status: "in_progress", module: "business_starter" }),
        createMockTask(user.id, "Open business bank account", { status: "todo", module: "business_starter" }),
      ]
    : [];

  const streak = createMockStreak(user.id, credentials.onboardingCompleted);
  const achievements: MockAchievement[] = credentials.onboardingCompleted
    ? [createMockAchievement(user.id, "first_login"), createMockAchievement(user.id, "profile_complete")]
    : [];

  return {
    user,
    session,
    profile,
    subscription,
    roles,
    progress,
    tasks,
    streak,
    achievements,
  };
}
