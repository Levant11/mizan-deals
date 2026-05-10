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
      admin_logs: {
        Row: {
          action: string | null
          admin_id: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action?: string | null
          admin_id: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string | null
          admin_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reviews: {
        Row: {
          admin_decision: string | null
          ai_flags: Json | null
          ai_risk_score: number | null
          ai_status: string | null
          ai_summary: string | null
          created_at: string
          id: string
          listing_id: string
          raw_response: Json | null
          reviewed_by_admin: string | null
        }
        Insert: {
          admin_decision?: string | null
          ai_flags?: Json | null
          ai_risk_score?: number | null
          ai_status?: string | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          listing_id: string
          raw_response?: Json | null
          reviewed_by_admin?: string | null
        }
        Update: {
          admin_decision?: string | null
          ai_flags?: Json | null
          ai_risk_score?: number | null
          ai_status?: string | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          raw_response?: Json | null
          reviewed_by_admin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_reviewed_by_admin_fkey"
            columns: ["reviewed_by_admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_photos: {
        Row: {
          created_at: string
          id: string
          image_hash: string | null
          is_primary: boolean
          listing_id: string
          storage_path: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_hash?: string | null
          is_primary?: boolean
          listing_id: string
          storage_path?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_hash?: string | null
          is_primary?: boolean
          listing_id?: string
          storage_path?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ai_flags: Json
          ai_risk_score: number
          ai_status: string
          category: string | null
          city: string | null
          created_at: string
          currency: string
          description: string | null
          exact_address: string | null
          expires_at: string | null
          gps_lat: number | null
          gps_lng: number | null
          high_value_locked: boolean
          id: string
          neighborhood: string | null
          offers_count: number
          operator_verified: boolean
          package_type: string | null
          price_max: number | null
          price_min: number | null
          seller_id: string
          status: string
          title: string | null
          unlocks_count: number
          updated_at: string
          urgency: string | null
          views_count: number
        }
        Insert: {
          ai_flags?: Json
          ai_risk_score?: number
          ai_status?: string
          category?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exact_address?: string | null
          expires_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          high_value_locked?: boolean
          id?: string
          neighborhood?: string | null
          offers_count?: number
          operator_verified?: boolean
          package_type?: string | null
          price_max?: number | null
          price_min?: number | null
          seller_id: string
          status?: string
          title?: string | null
          unlocks_count?: number
          updated_at?: string
          urgency?: string | null
          views_count?: number
        }
        Update: {
          ai_flags?: Json
          ai_risk_score?: number
          ai_status?: string
          category?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exact_address?: string | null
          expires_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          high_value_locked?: boolean
          id?: string
          neighborhood?: string | null
          offers_count?: number
          operator_verified?: boolean
          package_type?: string | null
          price_max?: number | null
          price_min?: number | null
          seller_id?: string
          status?: string
          title?: string | null
          unlocks_count?: number
          updated_at?: string
          urgency?: string | null
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          related_entity_id: string | null
          related_entity_type: string | null
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string
          created_at: string
          fee_paid: number
          id: string
          is_first_free: boolean
          listing_id: string
          message: string | null
          offered_price: number | null
          parent_offer_id: string | null
          seller_id: string
          status: string
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          fee_paid?: number
          id?: string
          is_first_free?: boolean
          listing_id: string
          message?: string | null
          offered_price?: number | null
          parent_offer_id?: string | null
          seller_id: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          fee_paid?: number
          id?: string
          is_first_free?: boolean
          listing_id?: string
          message?: string | null
          offered_price?: number | null
          parent_offer_id?: string | null
          seller_id?: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_parent_offer_id_fkey"
            columns: ["parent_offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_requests: {
        Row: {
          created_at: string
          estimated_fee: number | null
          id: string
          listing_id: string | null
          message: string | null
          partner_id: string
          referral_commission: number | null
          requester_id: string
          rfq_id: string | null
          service_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_fee?: number | null
          id?: string
          listing_id?: string | null
          message?: string | null
          partner_id: string
          referral_commission?: number | null
          requester_id: string
          rfq_id?: string | null
          service_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_fee?: number | null
          id?: string
          listing_id?: string | null
          message?: string | null
          partner_id?: string
          referral_commission?: number | null
          requester_id?: string
          rfq_id?: string | null
          service_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          categories: string[] | null
          cities: string[] | null
          company_name: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          partner_type: string | null
          phone: string | null
          profile_id: string | null
          status: string
          whatsapp: string | null
        }
        Insert: {
          categories?: string[] | null
          cities?: string[] | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          partner_type?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
          whatsapp?: string | null
        }
        Update: {
          categories?: string[] | null
          cities?: string[] | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          partner_type?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_ratings: {
        Row: {
          category: string | null
          created_at: string
          feedback: string | null
          id: string
          rating_score: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating_score: number
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          language: string
          phone: string | null
          updated_at: string
          verification_status: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          language?: string
          phone?: string | null
          updated_at?: string
          verification_status?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          language?: string
          phone?: string | null
          updated_at?: string
          verification_status?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      rfq_responses: {
        Row: {
          created_at: string
          custom_message: string | null
          fee_paid: number
          id: string
          listing_id: string | null
          response_type: string | null
          rfq_id: string
          seller_id: string
          status: string
          stripe_payment_id: string | null
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          fee_paid?: number
          id?: string
          listing_id?: string | null
          response_type?: string | null
          rfq_id: string
          seller_id: string
          status?: string
          stripe_payment_id?: string | null
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          fee_paid?: number
          id?: string
          listing_id?: string | null
          response_type?: string | null
          rfq_id?: string
          seller_id?: string
          status?: string
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfq_responses_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_responses_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_responses_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_responses_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          buyer_id: string
          category: string | null
          city: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          neighborhood: string | null
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id: string
          category?: string | null
          city?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          neighborhood?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id?: string
          category?: string | null
          city?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          neighborhood?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alerts_enabled: boolean
          category: string | null
          city: string | null
          created_at: string
          id: string
          keywords: string | null
          name: string | null
          neighborhood: string | null
          price_max: number | null
          price_min: number | null
          user_id: string
        }
        Insert: {
          alerts_enabled?: boolean
          category?: string | null
          city?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          name?: string | null
          neighborhood?: string | null
          price_max?: number | null
          price_min?: number | null
          user_id: string
        }
        Update: {
          alerts_enabled?: boolean
          category?: string | null
          city?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          name?: string | null
          neighborhood?: string | null
          price_max?: number | null
          price_min?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          level1_unlocks_limit: number | null
          level1_unlocks_used: number
          level2_unlocks_limit: number | null
          level2_unlocks_used: number
          offers_limit: number | null
          offers_used: number
          plan: string | null
          status: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          level1_unlocks_limit?: number | null
          level1_unlocks_used?: number
          level2_unlocks_limit?: number | null
          level2_unlocks_used?: number
          offers_limit?: number | null
          offers_used?: number
          plan?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          level1_unlocks_limit?: number | null
          level1_unlocks_used?: number
          level2_unlocks_limit?: number | null
          level2_unlocks_used?: number
          offers_limit?: number | null
          offers_used?: number
          plan?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          attachments: Json
          created_at: string
          id: string
          is_internal_note: boolean
          message: string | null
          sender_id: string
          ticket_id: string
        }
        Insert: {
          attachments?: Json
          created_at?: string
          id?: string
          is_internal_note?: boolean
          message?: string | null
          sender_id: string
          ticket_id: string
        }
        Update: {
          attachments?: Json
          created_at?: string
          id?: string
          is_internal_note?: boolean
          message?: string | null
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_admin_id: string | null
          category: string | null
          created_at: string
          id: string
          priority: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_admin_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_admin_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_admin_id_fkey"
            columns: ["assigned_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          id: string
          metadata: Json
          related_listing_id: string | null
          related_offer_id: string | null
          related_rfq_response_id: string | null
          related_unlock_id: string | null
          status: string | null
          stripe_payment_id: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          related_listing_id?: string | null
          related_offer_id?: string | null
          related_rfq_response_id?: string | null
          related_unlock_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          related_listing_id?: string | null
          related_offer_id?: string | null
          related_rfq_response_id?: string | null
          related_unlock_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_listing_id_fkey"
            columns: ["related_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_listing_id_fkey"
            columns: ["related_listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_offer_id_fkey"
            columns: ["related_offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_rfq_response_id_fkey"
            columns: ["related_rfq_response_id"]
            isOneToOne: false
            referencedRelation: "rfq_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_unlock_id_fkey"
            columns: ["related_unlock_id"]
            isOneToOne: false
            referencedRelation: "unlocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unlocks: {
        Row: {
          amount_paid: number | null
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          payment_status: string | null
          stripe_payment_id: string | null
          unlock_level: string
        }
        Insert: {
          amount_paid?: number | null
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          payment_status?: string | null
          stripe_payment_id?: string | null
          unlock_level: string
        }
        Update: {
          amount_paid?: number | null
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          payment_status?: string | null
          stripe_payment_id?: string | null
          unlock_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocks_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      listings_public: {
        Row: {
          ai_status: string | null
          category: string | null
          city: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          exact_address: string | null
          expires_at: string | null
          gps_lat: number | null
          gps_lng: number | null
          high_value_locked: boolean | null
          id: string | null
          neighborhood: string | null
          offers_count: number | null
          operator_verified: boolean | null
          package_type: string | null
          price_max: number | null
          price_min: number | null
          seller_avatar: string | null
          seller_email: string | null
          seller_id: string | null
          seller_name: string | null
          seller_phone: string | null
          seller_verification_status: string | null
          seller_whatsapp: string | null
          status: string | null
          title: string | null
          unlocks_count: number | null
          urgency: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_unlock: {
        Args: { _buyer_id: string; _level?: string; _listing_id: string }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
