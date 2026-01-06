export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          goal: string | null
          id: string
          ip_address: string | null
          message: string | null
          name: string
          stage: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          goal?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          name: string
          stage?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          goal?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          name?: string
          stage?: string | null
        }
        Relationships: []
      }
      credit_scores: {
        Row: {
          bureau: string
          created_at: string
          id: string
          notes: string | null
          score: number | null
          score_date: string
          user_id: string
        }
        Insert: {
          bureau: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          score_date: string
          user_id: string
        }
        Update: {
          bureau?: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          score_date?: string
          user_id?: string
        }
        Relationships: []
      }
      digital_cv: {
        Row: {
          bio: string | null
          contact_email: string | null
          created_at: string
          goals: string | null
          headline: string | null
          id: string
          is_published: boolean | null
          links: Json | null
          projects: Json | null
          seo_description: string | null
          seo_title: string | null
          show_email_publicly: boolean
          skills: string[] | null
          slug: string | null
          social_image_url: string | null
          template: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          goals?: string | null
          headline?: string | null
          id?: string
          is_published?: boolean | null
          links?: Json | null
          projects?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          show_email_publicly?: boolean
          skills?: string[] | null
          slug?: string | null
          social_image_url?: string | null
          template?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          goals?: string | null
          headline?: string | null
          id?: string
          is_published?: boolean | null
          links?: Json | null
          projects?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          show_email_publicly?: boolean
          skills?: string[] | null
          slug?: string | null
          social_image_url?: string | null
          template?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          business_stage: string | null
          created_at: string
          full_name: string | null
          has_ein: boolean | null
          has_llc: boolean | null
          id: string
          industry: string | null
          onboarding_completed: boolean | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          business_stage?: string | null
          created_at?: string
          full_name?: string | null
          has_ein?: boolean | null
          has_llc?: boolean | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          business_stage?: string | null
          created_at?: string
          full_name?: string | null
          has_ein?: boolean | null
          has_llc?: boolean | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          module: string
          notes: string | null
          step: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module: string
          notes?: string | null
          step: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module?: string
          notes?: string | null
          step?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          description: string | null
          discount_percent: number | null
          expires_at: string | null
          free_months: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          tier_upgrade: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          free_months?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier_upgrade?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          free_months?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier_upgrade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          content: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean | null
          read_time_minutes: number | null
          sort_order: number | null
          tier_required: Database["public"]["Enums"]["subscription_plan"]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          read_time_minutes?: number | null
          sort_order?: number | null
          tier_required?: Database["public"]["Enums"]["subscription_plan"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          read_time_minutes?: number | null
          sort_order?: number | null
          tier_required?: Database["public"]["Enums"]["subscription_plan"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          message: string
          module: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message: string
          module?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message?: string
          module?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tradelines: {
        Row: {
          account_type: string
          created_at: string
          credit_limit: number | null
          current_balance: number | null
          id: string
          notes: string | null
          opened_date: string | null
          payment_status: string | null
          reports_to: string[] | null
          updated_at: string
          user_id: string
          vendor_name: string
        }
        Insert: {
          account_type: string
          created_at?: string
          credit_limit?: number | null
          current_balance?: number | null
          id?: string
          notes?: string | null
          opened_date?: string | null
          payment_status?: string | null
          reports_to?: string[] | null
          updated_at?: string
          user_id: string
          vendor_name: string
        }
        Update: {
          account_type?: string
          created_at?: string
          credit_limit?: number | null
          current_balance?: number | null
          id?: string
          notes?: string | null
          opened_date?: string | null
          payment_status?: string | null
          reports_to?: string[] | null
          updated_at?: string
          user_id?: string
          vendor_name?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          earned_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          id: string
          last_login_date: string | null
          last_task_date: string | null
          login_streak_current: number
          login_streak_longest: number
          task_streak_current: number
          task_streak_longest: number
          total_login_days: number
          total_tasks_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_login_date?: string | null
          last_task_date?: string | null
          login_streak_current?: number
          login_streak_longest?: number
          task_streak_current?: number
          task_streak_longest?: number
          total_login_days?: number
          total_tasks_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login_date?: string | null
          last_task_date?: string | null
          login_streak_current?: number
          login_streak_longest?: number
          task_streak_current?: number
          task_streak_longest?: number
          total_login_days?: number
          total_tasks_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          module: string | null
          priority: string | null
          status: string
          step: string | null
          title: string
          trello_card_id: string | null
          trello_synced_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          module?: string | null
          priority?: string | null
          status?: string
          step?: string | null
          title: string
          trello_card_id?: string | null
          trello_synced_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          module?: string | null
          priority?: string | null
          status?: string
          step?: string | null
          title?: string
          trello_card_id?: string | null
          trello_synced_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_plan: "free" | "start" | "build" | "scale"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      subscription_plan: ["free", "start", "build", "scale"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
