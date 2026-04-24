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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      fee_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          id: string
          related_id: string | null
          status: Database["public"]["Enums"]["fee_status"]
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          id?: string
          related_id?: string | null
          status?: Database["public"]["Enums"]["fee_status"]
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          fee_type?: Database["public"]["Enums"]["fee_type"]
          id?: string
          related_id?: string | null
          status?: Database["public"]["Enums"]["fee_status"]
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      listing_unlocks: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          paid: boolean
          unlock_level: number
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          paid?: boolean
          unlock_level?: number
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          paid?: boolean
          unlock_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_unlocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ai_integrity_notes: string | null
          ai_integrity_score: number | null
          asking_price: number | null
          category: Database["public"]["Enums"]["asset_category"]
          city: string | null
          contact_info: string | null
          created_at: string
          currency: string
          description: string
          id: string
          images: Json
          listing_fee_paid: boolean
          private_details: string | null
          public_summary: string | null
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          ai_integrity_notes?: string | null
          ai_integrity_score?: number | null
          asking_price?: number | null
          category: Database["public"]["Enums"]["asset_category"]
          city?: string | null
          contact_info?: string | null
          created_at?: string
          currency?: string
          description: string
          id?: string
          images?: Json
          listing_fee_paid?: boolean
          private_details?: string | null
          public_summary?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          ai_integrity_notes?: string | null
          ai_integrity_score?: number | null
          asking_price?: number | null
          category?: Database["public"]["Enums"]["asset_category"]
          city?: string | null
          contact_info?: string | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: Json
          listing_fee_paid?: boolean
          private_details?: string | null
          public_summary?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      offers: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          currency: string
          fee_paid: boolean
          id: string
          listing_id: string
          message: string | null
          parent_offer_id: string | null
          status: Database["public"]["Enums"]["offer_status"]
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          currency?: string
          fee_paid?: boolean
          id?: string
          listing_id: string
          message?: string | null
          parent_offer_id?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          currency?: string
          fee_paid?: boolean
          id?: string
          listing_id?: string
          message?: string | null
          parent_offer_id?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
        }
        Relationships: [
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_parent_offer_id_fkey"
            columns: ["parent_offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_paid: boolean
          created_at: string
          id: string
          listing_id: string | null
          notes: string | null
          referral_type: string
          requester_id: string
          status: string
        }
        Insert: {
          commission_paid?: boolean
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          referral_type: string
          requester_id: string
          status?: string
        }
        Update: {
          commission_paid?: boolean
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          referral_type?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_responses: {
        Row: {
          created_at: string
          fee_paid: boolean
          id: string
          message: string
          proposed_price: number | null
          responder_id: string
          rfq_id: string
        }
        Insert: {
          created_at?: string
          fee_paid?: boolean
          id?: string
          message: string
          proposed_price?: number | null
          responder_id: string
          rfq_id: string
        }
        Update: {
          created_at?: string
          fee_paid?: boolean
          id?: string
          message?: string
          proposed_price?: number | null
          responder_id?: string
          rfq_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_responses_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          buyer_id: string
          category: Database["public"]["Enums"]["asset_category"]
          city: string | null
          created_at: string
          currency: string
          description: string
          id: string
          status: Database["public"]["Enums"]["rfq_status"]
          title: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id: string
          category: Database["public"]["Enums"]["asset_category"]
          city?: string | null
          created_at?: string
          currency?: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["rfq_status"]
          title: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id?: string
          category?: Database["public"]["Enums"]["asset_category"]
          city?: string | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["rfq_status"]
          title?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          body: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          body: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          body?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
      asset_category:
        | "real_estate"
        | "vehicle"
        | "equipment"
        | "inventory"
        | "business"
        | "other"
      fee_status: "pending" | "paid" | "failed" | "refunded"
      fee_type:
        | "listing_fee"
        | "unlock_fee"
        | "offer_fee"
        | "rfq_response_fee"
        | "subscription"
        | "referral_commission"
      listing_status:
        | "draft"
        | "pending_review"
        | "active"
        | "sold"
        | "archived"
        | "rejected"
      offer_status:
        | "pending"
        | "countered"
        | "accepted"
        | "declined"
        | "withdrawn"
      rfq_status: "open" | "closed"
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
      app_role: ["admin", "user"],
      asset_category: [
        "real_estate",
        "vehicle",
        "equipment",
        "inventory",
        "business",
        "other",
      ],
      fee_status: ["pending", "paid", "failed", "refunded"],
      fee_type: [
        "listing_fee",
        "unlock_fee",
        "offer_fee",
        "rfq_response_fee",
        "subscription",
        "referral_commission",
      ],
      listing_status: [
        "draft",
        "pending_review",
        "active",
        "sold",
        "archived",
        "rejected",
      ],
      offer_status: [
        "pending",
        "countered",
        "accepted",
        "declined",
        "withdrawn",
      ],
      rfq_status: ["open", "closed"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
