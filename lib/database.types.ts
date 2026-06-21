/**
 * Database type definitions for Creator Opportunities Hub
 * Maps 1:1 to supabase/schema.sql tables, enums, and views.
 *
 * For auto-generation from a live Supabase project, run:
 *   npx supabase gen types typescript --project-id <ref> > lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ──────────────────────────────────────────────────

export type OpportunityType =
  | "brand_deal"
  | "affiliate_program"
  | "sponsorship"
  | "ugc"
  | "creator_job"
  | "collaboration"
  | "ambassador_program"
  | "remote_work"
  | "paid_campaign";

export type OpportunityStatus =
  | "draft"
  | "active"
  | "paused"
  | "closed"
  | "expired";

export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type BudgetType =
  | "fixed"
  | "range"
  | "commission"
  | "hourly"
  | "monthly"
  | "negotiable";

export type LocationType = "remote" | "on_site" | "hybrid";

export type CompanySize = "startup" | "small" | "medium" | "large" | "enterprise";

export type UserRole = "creator" | "brand";

// ─── Tables ─────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          headline: string | null;
          platforms: string[];
          niches: string[];
          follower_count: number;
          country: string | null;
          city: string | null;
          website: string | null;
          youtube_url: string | null;
          tiktok_url: string | null;
          instagram_url: string | null;
          twitter_url: string | null;
          linkedin_url: string | null;
          role: UserRole;
          is_verified: boolean;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          headline?: string | null;
          platforms?: string[];
          niches?: string[];
          follower_count?: number;
          country?: string | null;
          city?: string | null;
          website?: string | null;
          youtube_url?: string | null;
          tiktok_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          role?: UserRole;
          is_verified?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          username?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          headline?: string | null;
          platforms?: string[];
          niches?: string[];
          follower_count?: number;
          country?: string | null;
          city?: string | null;
          website?: string | null;
          youtube_url?: string | null;
          tiktok_url?: string | null;
          instagram_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          role?: UserRole;
          is_verified?: boolean;
          is_public?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };

      brands: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          slug: string;
          logo_url: string | null;
          website: string;
          industry: string | null;
          description: string | null;
          company_size: CompanySize;
          country: string | null;
          city: string | null;
          contact_email: string | null;
          contact_name: string | null;
          social_twitter: string | null;
          social_linkedin: string | null;
          social_instagram: string | null;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          slug: string;
          logo_url?: string | null;
          website: string;
          industry?: string | null;
          description?: string | null;
          company_size?: CompanySize;
          country?: string | null;
          city?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          social_twitter?: string | null;
          social_linkedin?: string | null;
          social_instagram?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          slug?: string;
          logo_url?: string | null;
          website?: string;
          industry?: string | null;
          description?: string | null;
          company_size?: CompanySize;
          country?: string | null;
          city?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          social_twitter?: string | null;
          social_linkedin?: string | null;
          social_instagram?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };

      opportunities: {
        Row: {
          id: string;
          brand_id: string;
          created_by: string;
          title: string;
          slug: string;
          description: string;
          opportunity_type: OpportunityType;
          budget_min: number | null;
          budget_max: number | null;
          budget_type: BudgetType;
          currency: string;
          country: string | null;
          location_type: LocationType;
          requirements: string | null;
          deliverables: string | null;
          deadline: string | null;
          min_followers: number;
          platforms: string[];
          niches: string[];
          status: OpportunityStatus;
          is_featured: boolean;
          is_remote: boolean;
          views_count: number;
          applications_count: number;
          published_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          created_by: string;
          title: string;
          slug: string;
          description: string;
          opportunity_type: OpportunityType;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_type?: BudgetType;
          currency?: string;
          country?: string | null;
          location_type?: LocationType;
          requirements?: string | null;
          deliverables?: string | null;
          deadline?: string | null;
          min_followers?: number;
          platforms?: string[];
          niches?: string[];
          status?: OpportunityStatus;
          is_featured?: boolean;
          is_remote?: boolean;
          views_count?: number;
          applications_count?: number;
          published_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          opportunity_type?: OpportunityType;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_type?: BudgetType;
          currency?: string;
          country?: string | null;
          location_type?: LocationType;
          requirements?: string | null;
          deliverables?: string | null;
          deadline?: string | null;
          min_followers?: number;
          platforms?: string[];
          niches?: string[];
          status?: OpportunityStatus;
          is_featured?: boolean;
          is_remote?: boolean;
          views_count?: number;
          applications_count?: number;
          published_at?: string | null;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "opportunities_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "opportunities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };

      opportunity_categories: {
        Row: {
          opportunity_id: string;
          category_id: string;
        };
        Insert: {
          opportunity_id: string;
          category_id: string;
        };
        Update: {
          opportunity_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "opportunity_categories_opportunity_id_fkey";
            columns: ["opportunity_id"];
            isOneToOne: false;
            referencedRelation: "opportunities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "opportunity_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };

      applications: {
        Row: {
          id: string;
          opportunity_id: string;
          creator_id: string;
          cover_letter: string | null;
          portfolio_links: string[];
          proposed_budget: number | null;
          currency: string;
          status: ApplicationStatus;
          notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          creator_id: string;
          cover_letter?: string | null;
          portfolio_links?: string[];
          proposed_budget?: number | null;
          currency?: string;
          status?: ApplicationStatus;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          cover_letter?: string | null;
          portfolio_links?: string[];
          proposed_budget?: number | null;
          currency?: string;
          status?: ApplicationStatus;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey";
            columns: ["opportunity_id"];
            isOneToOne: false;
            referencedRelation: "opportunities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };

    Views: {
      featured_opportunities: {
        Row: {
          id: string;
          brand_id: string;
          created_by: string;
          title: string;
          slug: string;
          description: string;
          opportunity_type: OpportunityType;
          budget_min: number | null;
          budget_max: number | null;
          budget_type: BudgetType;
          currency: string;
          country: string | null;
          location_type: LocationType;
          status: OpportunityStatus;
          is_featured: boolean;
          published_at: string | null;
          views_count: number;
          applications_count: number;
          brand_name: string | null;
          brand_logo: string | null;
          brand_verified: boolean | null;
          category_names: string[] | null;
        };
        Relationships: [];
      };

      opportunity_details: {
        Row: {
          id: string;
          brand_id: string;
          created_by: string;
          title: string;
          slug: string;
          description: string;
          opportunity_type: OpportunityType;
          budget_min: number | null;
          budget_max: number | null;
          budget_type: BudgetType;
          currency: string;
          country: string | null;
          location_type: LocationType;
          status: OpportunityStatus;
          is_featured: boolean;
          published_at: string | null;
          views_count: number;
          applications_count: number;
          brand_name: string | null;
          brand_logo: string | null;
          brand_website: string | null;
          brand_verified: boolean | null;
          brand_contact_email: string | null;
          category_ids: string[] | null;
          category_names: string[] | null;
        };
        Relationships: [];
      };
    };

    Functions: {
      search_opportunities: {
        Args: { query: string; limit_count?: number };
        Returns: Database["public"]["Tables"]["opportunities"]["Row"][];
      };
      opportunities_by_category: {
        Args: { cat_slug: string; limit_count?: number };
        Returns: Database["public"]["Views"]["opportunity_details"]["Row"][];
      };
    };

    Enums: {
      opportunity_type: OpportunityType;
      opportunity_status: OpportunityStatus;
      application_status: ApplicationStatus;
      budget_type: BudgetType;
      location_type: LocationType;
      company_size: CompanySize;
      user_role: UserRole;
    };
  };
}

// ─── Convenience aliases ────────────────────────────────────

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
