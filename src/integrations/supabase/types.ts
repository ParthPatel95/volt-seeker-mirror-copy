export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          additional_info: string | null
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          platform_use: string
          reviewed_at: string | null
          reviewed_by: string | null
          role: string
          status: string
        }
        Insert: {
          additional_info?: string | null
          company: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          platform_use: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role: string
          status?: string
        }
        Update: {
          additional_info?: string | null
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          platform_use?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string
          status?: string
        }
        Relationships: []
      }
      ai_company_analysis: {
        Row: {
          acquisition_readiness: number | null
          analyzed_at: string
          company_name: string
          created_at: string
          distress_probability: number | null
          financial_outlook: string | null
          id: string
          investment_recommendation: string | null
          key_insights: string[] | null
          power_consumption_analysis: string | null
          risk_assessment: string | null
        }
        Insert: {
          acquisition_readiness?: number | null
          analyzed_at?: string
          company_name: string
          created_at?: string
          distress_probability?: number | null
          financial_outlook?: string | null
          id?: string
          investment_recommendation?: string | null
          key_insights?: string[] | null
          power_consumption_analysis?: string | null
          risk_assessment?: string | null
        }
        Update: {
          acquisition_readiness?: number | null
          analyzed_at?: string
          company_name?: string
          created_at?: string
          distress_probability?: number | null
          financial_outlook?: string | null
          id?: string
          investment_recommendation?: string | null
          key_insights?: string[] | null
          power_consumption_analysis?: string | null
          risk_assessment?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          severity: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          severity?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          severity?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      btc_roi_calculations: {
        Row: {
          calculation_type: string
          created_at: string
          form_data: Json
          id: string
          network_data: Json
          results: Json
          site_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calculation_type: string
          created_at?: string
          form_data: Json
          id?: string
          network_data: Json
          results: Json
          site_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calculation_type?: string
          created_at?: string
          form_data?: Json
          id?: string
          network_data?: Json
          results?: Json
          site_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          analyzed_at: string | null
          competitive_advantages: string[] | null
          created_at: string
          description: string | null
          financial_data: Json | null
          headquarters_location: string | null
          id: string
          industry: string | null
          market_cap: number | null
          name: string
          risk_factors: string[] | null
          sector: string | null
          ticker: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          analyzed_at?: string | null
          competitive_advantages?: string[] | null
          created_at?: string
          description?: string | null
          financial_data?: Json | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          market_cap?: number | null
          name: string
          risk_factors?: string[] | null
          sector?: string | null
          ticker?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          analyzed_at?: string | null
          competitive_advantages?: string[] | null
          created_at?: string
          description?: string | null
          financial_data?: Json | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          market_cap?: number | null
          name?: string
          risk_factors?: string[] | null
          sector?: string | null
          ticker?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_real_estate_assets: {
        Row: {
          company_name: string
          company_ticker: string | null
          coordinates: unknown | null
          created_at: string
          id: string
          location_description: string
          property_type: string
          raw_text: string | null
          source: string
          updated_at: string
        }
        Insert: {
          company_name: string
          company_ticker?: string | null
          coordinates?: unknown | null
          created_at?: string
          id: string
          location_description: string
          property_type: string
          raw_text?: string | null
          source?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          company_ticker?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          location_description?: string
          property_type?: string
          raw_text?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_insights: {
        Row: {
          company_name: string
          content: string
          discovered_at: string
          id: string
          insight_type: string
          keywords: string[] | null
          source: string
        }
        Insert: {
          company_name: string
          content: string
          discovered_at?: string
          id?: string
          insight_type: string
          keywords?: string[] | null
          source: string
        }
        Update: {
          company_name?: string
          content?: string
          discovered_at?: string
          id?: string
          insight_type?: string
          keywords?: string[] | null
          source?: string
        }
        Relationships: []
      }
      distress_alerts: {
        Row: {
          alert_type: string
          company_name: string
          created_at: string
          distress_level: number
          id: string
          potential_value: number
          power_capacity: number
          signals: string[]
        }
        Insert: {
          alert_type: string
          company_name: string
          created_at?: string
          distress_level: number
          id?: string
          potential_value: number
          power_capacity: number
          signals: string[]
        }
        Update: {
          alert_type?: string
          company_name?: string
          created_at?: string
          distress_level?: number
          id?: string
          potential_value?: number
          power_capacity?: number
          signals?: string[]
        }
        Relationships: []
      }
      energy_markets: {
        Row: {
          created_at: string
          current_price_mwh: number | null
          daily_high: number | null
          daily_low: number | null
          id: string
          market_name: string
          market_status: string | null
          price_timestamp: string | null
          region: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_price_mwh?: number | null
          daily_high?: number | null
          daily_low?: number | null
          id?: string
          market_name: string
          market_status?: string | null
          price_timestamp?: string | null
          region?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_price_mwh?: number | null
          daily_high?: number | null
          daily_low?: number | null
          id?: string
          market_name?: string
          market_status?: string | null
          price_timestamp?: string | null
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      energy_rates: {
        Row: {
          created_at: string
          id: string
          market_name: string
          node_id: string | null
          node_name: string | null
          price_per_mwh: number
          rate_type: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          market_name: string
          node_id?: string | null
          node_name?: string | null
          price_per_mwh: number
          rate_type: string
          timestamp: string
        }
        Update: {
          created_at?: string
          id?: string
          market_name?: string
          node_id?: string | null
          node_name?: string | null
          price_per_mwh?: number
          rate_type?: string
          timestamp?: string
        }
        Relationships: []
      }
      gridbazaar_profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          id: string
          is_email_verified: boolean
          is_id_verified: boolean
          linkedin_url: string | null
          phone_number: string | null
          profile_image_url: string | null
          role: string
          seller_type: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          is_email_verified?: boolean
          is_id_verified?: boolean
          linkedin_url?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: string
          seller_type?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          is_email_verified?: boolean
          is_id_verified?: boolean
          linkedin_url?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: string
          seller_type?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      industry_intel_results: {
        Row: {
          address: string | null
          ai_insights: string | null
          city: string | null
          coordinates: unknown | null
          created_at: string
          created_by: string | null
          data_sources: Json | null
          distress_score: number | null
          estimated_power_mw: number | null
          id: string
          name: string
          opportunity_details: Json | null
          opportunity_type: string
          scan_session_id: string | null
          state: string | null
          status: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          ai_insights?: string | null
          city?: string | null
          coordinates?: unknown | null
          created_at?: string
          created_by?: string | null
          data_sources?: Json | null
          distress_score?: number | null
          estimated_power_mw?: number | null
          id?: string
          name: string
          opportunity_details?: Json | null
          opportunity_type: string
          scan_session_id?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          ai_insights?: string | null
          city?: string | null
          coordinates?: unknown | null
          created_at?: string
          created_by?: string | null
          data_sources?: Json | null
          distress_score?: number | null
          estimated_power_mw?: number | null
          id?: string
          name?: string
          opportunity_details?: Json | null
          opportunity_type?: string
          scan_session_id?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      industry_intelligence: {
        Row: {
          company_name: string
          financial_health: number | null
          id: string
          industry: string
          market_cap: number | null
          power_intensity: string | null
          risk_level: string | null
          scanned_at: string
          ticker: string | null
        }
        Insert: {
          company_name: string
          financial_health?: number | null
          id?: string
          industry: string
          market_cap?: number | null
          power_intensity?: string | null
          risk_level?: string | null
          scanned_at?: string
          ticker?: string | null
        }
        Update: {
          company_name?: string
          financial_health?: number | null
          id?: string
          industry?: string
          market_cap?: number | null
          power_intensity?: string | null
          risk_level?: string | null
          scanned_at?: string
          ticker?: string | null
        }
        Relationships: []
      }
      linkedin_intelligence: {
        Row: {
          company: string
          content: string
          discovered_at: string
          id: string
          keywords: string[] | null
          post_date: string
          signals: string[] | null
        }
        Insert: {
          company: string
          content: string
          discovered_at?: string
          id?: string
          keywords?: string[] | null
          post_date: string
          signals?: string[] | null
        }
        Update: {
          company?: string
          content?: string
          discovered_at?: string
          id?: string
          keywords?: string[] | null
          post_date?: string
          signals?: string[] | null
        }
        Relationships: []
      }
      news_intelligence: {
        Row: {
          content: string
          discovered_at: string
          id: string
          keywords: string[] | null
          published_at: string | null
          source: string
          title: string
          url: string | null
        }
        Insert: {
          content: string
          discovered_at?: string
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          source: string
          title: string
          url?: string | null
        }
        Update: {
          content?: string
          discovered_at?: string
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          source?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          role: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          asking_price: number | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_urls: string[] | null
          latitude: number | null
          listing_url: string | null
          longitude: number | null
          lot_size_acres: number | null
          power_capacity_mw: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          source: string | null
          square_footage: number | null
          state: string | null
          status: string | null
          substation_distance_miles: number | null
          updated_at: string
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          asking_price?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          listing_url?: string | null
          longitude?: number | null
          lot_size_acres?: number | null
          power_capacity_mw?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          source?: string | null
          square_footage?: number | null
          state?: string | null
          status?: string | null
          substation_distance_miles?: number | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          asking_price?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          listing_url?: string | null
          longitude?: number | null
          lot_size_acres?: number | null
          power_capacity_mw?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          source?: string | null
          square_footage?: number | null
          state?: string | null
          status?: string | null
          substation_distance_miles?: number | null
          updated_at?: string
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      scraped_properties: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          lot_size: string | null
          price: number | null
          property_type: string | null
          scraped_data: Json | null
          source_website: string | null
          square_footage: number | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          lot_size?: string | null
          price?: number | null
          property_type?: string | null
          scraped_data?: Json | null
          source_website?: string | null
          square_footage?: number | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          lot_size?: string | null
          price?: number | null
          property_type?: string | null
          scraped_data?: Json | null
          source_website?: string | null
          square_footage?: number | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      site_access_requests: {
        Row: {
          company_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          location: string
          phone: string
          power_requirement: string
          status: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          location: string
          phone: string
          power_requirement: string
          status?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string
          phone?: string
          power_requirement?: string
          status?: string
        }
        Relationships: []
      }
      substations: {
        Row: {
          capacity_mva: number | null
          commissioned_date: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          owner: string | null
          status: string | null
          substation_type: string | null
          updated_at: string
          voltage_kv: number | null
        }
        Insert: {
          capacity_mva?: number | null
          commissioned_date?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner?: string | null
          status?: string | null
          substation_type?: string | null
          updated_at?: string
          voltage_kv?: number | null
        }
        Update: {
          capacity_mva?: number | null
          commissioned_date?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner?: string | null
          status?: string | null
          substation_type?: string | null
          updated_at?: string
          voltage_kv?: number | null
        }
        Relationships: []
      }
      user_alert_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          frequency: string | null
          id: string
          is_active: boolean | null
          push_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verified_heavy_power_sites: {
        Row: {
          address: string
          business_status: string | null
          city: string
          confidence_level: number | null
          coordinates: unknown | null
          created_at: string
          created_by: string
          deleted_at: string | null
          estimated_free_mw: number | null
          facility_type: string | null
          id: string
          idle_score: number | null
          industry_type: string | null
          last_verified: string
          metadata: Json | null
          name: string | null
          notes: string | null
          operational_status: string
          power_capacity_mw: number
          power_potential: number | null
          site_name: string
          site_type: string
          state: string
          updated_at: string
          validation_status: string | null
          verification_method: string
          verification_source: string | null
          zip_code: string | null
        }
        Insert: {
          address: string
          business_status?: string | null
          city: string
          confidence_level?: number | null
          coordinates?: unknown | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          estimated_free_mw?: number | null
          facility_type?: string | null
          id?: string
          idle_score?: number | null
          industry_type?: string | null
          last_verified?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          operational_status?: string
          power_capacity_mw: number
          power_potential?: number | null
          site_name: string
          site_type: string
          state: string
          updated_at?: string
          validation_status?: string | null
          verification_method: string
          verification_source?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          business_status?: string | null
          city?: string
          confidence_level?: number | null
          coordinates?: unknown | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          estimated_free_mw?: number | null
          facility_type?: string | null
          id?: string
          idle_score?: number | null
          industry_type?: string | null
          last_verified?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          operational_status?: string
          power_capacity_mw?: number
          power_potential?: number | null
          site_name?: string
          site_type?: string
          state?: string
          updated_at?: string
          validation_status?: string | null
          verification_method?: string
          verification_source?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      volt_scores: {
        Row: {
          calculated_at: string
          calculation_data: Json | null
          created_at: string
          economic_score: number | null
          id: string
          infrastructure_score: number | null
          location_score: number | null
          market_score: number | null
          overall_score: number | null
          property_id: string | null
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          calculation_data?: Json | null
          created_at?: string
          economic_score?: number | null
          id?: string
          infrastructure_score?: number | null
          location_score?: number | null
          market_score?: number | null
          overall_score?: number | null
          property_id?: string | null
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          calculation_data?: Json | null
          created_at?: string
          economic_score?: number | null
          id?: string
          infrastructure_score?: number | null
          location_score?: number | null
          market_score?: number | null
          overall_score?: number | null
          property_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volt_scores_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      voltmarket_analytics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voltmarket_contact_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          listing_id: string
          listing_owner_id: string
          message: string
          sender_email: string
          sender_name: string
          sender_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          listing_id: string
          listing_owner_id: string
          message: string
          sender_email: string
          sender_name: string
          sender_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          listing_id?: string
          listing_owner_id?: string
          message?: string
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
        }
        Relationships: []
      }
      voltmarket_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          listing_id: string | null
          participant_ids: string[]
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          participant_ids: string[]
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          participant_ids?: string[]
          title?: string | null
        }
        Relationships: []
      }
      voltmarket_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["voltmarket_document_type"]
          file_name: string
          file_size: number
          file_type: string | null
          file_url: string
          id: string
          is_private: boolean
          listing_id: string | null
          updated_at: string
          uploader_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: Database["public"]["Enums"]["voltmarket_document_type"]
          file_name: string
          file_size: number
          file_type?: string | null
          file_url: string
          id?: string
          is_private?: boolean
          listing_id?: string | null
          updated_at?: string
          uploader_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["voltmarket_document_type"]
          file_name?: string
          file_size?: number
          file_type?: string | null
          file_url?: string
          id?: string
          is_private?: boolean
          listing_id?: string | null
          updated_at?: string
          uploader_id?: string
        }
        Relationships: []
      }
      voltmarket_due_diligence: {
        Row: {
          buyer_id: string
          completed_at: string | null
          documents: Json | null
          id: string
          listing_id: string
          notes: string | null
          started_at: string
          status: string
        }
        Insert: {
          buyer_id: string
          completed_at?: string | null
          documents?: Json | null
          id?: string
          listing_id: string
          notes?: string | null
          started_at?: string
          status?: string
        }
        Update: {
          buyer_id?: string
          completed_at?: string | null
          documents?: Json | null
          id?: string
          listing_id?: string
          notes?: string | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      voltmarket_listing_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          listing_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          listing_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          listing_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_voltmarket_listing_images_listing_id"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      voltmarket_listings: {
        Row: {
          asking_price: number
          created_at: string
          description: string | null
          id: string
          listing_type: string
          location: string
          power_capacity_mw: number | null
          seller_id: string
          status: Database["public"]["Enums"]["voltmarket_listing_status"]
          title: string
          updated_at: string
        }
        Insert: {
          asking_price: number
          created_at?: string
          description?: string | null
          id?: string
          listing_type: string
          location: string
          power_capacity_mw?: number | null
          seller_id: string
          status?: Database["public"]["Enums"]["voltmarket_listing_status"]
          title: string
          updated_at?: string
        }
        Update: {
          asking_price?: number
          created_at?: string
          description?: string | null
          id?: string
          listing_type?: string
          location?: string
          power_capacity_mw?: number | null
          seller_id?: string
          status?: Database["public"]["Enums"]["voltmarket_listing_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      voltmarket_lois: {
        Row: {
          additional_notes: string | null
          buyer_id: string
          conditions: string | null
          id: string
          listing_id: string
          offered_price: number
          responded_at: string | null
          seller_id: string
          status: Database["public"]["Enums"]["voltmarket_loi_status"]
          submitted_at: string
          timeline_days: number | null
        }
        Insert: {
          additional_notes?: string | null
          buyer_id: string
          conditions?: string | null
          id?: string
          listing_id: string
          offered_price: number
          responded_at?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["voltmarket_loi_status"]
          submitted_at?: string
          timeline_days?: number | null
        }
        Update: {
          additional_notes?: string | null
          buyer_id?: string
          conditions?: string | null
          id?: string
          listing_id?: string
          offered_price?: number
          responded_at?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["voltmarket_loi_status"]
          submitted_at?: string
          timeline_days?: number | null
        }
        Relationships: []
      }
      voltmarket_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          listing_id: string
          message: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          listing_id: string
          message: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          listing_id?: string
          message?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      voltmarket_nda_requests: {
        Row: {
          id: string
          listing_id: string
          requested_at: string
          requester_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          id?: string
          listing_id: string
          requested_at?: string
          requester_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          id?: string
          listing_id?: string
          requested_at?: string
          requester_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      voltmarket_portfolio_items: {
        Row: {
          acquisition_date: string | null
          acquisition_price: number | null
          added_at: string
          current_value: number | null
          id: string
          item_type: string
          listing_id: string | null
          metadata: Json | null
          name: string
          notes: string | null
          portfolio_id: string
          status: string
          updated_at: string
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          added_at?: string
          current_value?: number | null
          id?: string
          item_type?: string
          listing_id?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          portfolio_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          added_at?: string
          current_value?: number | null
          id?: string
          item_type?: string
          listing_id?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          portfolio_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_portfolio"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      voltmarket_portfolios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          portfolio_type: string
          risk_tolerance: string | null
          target_allocation: Json | null
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          portfolio_type?: string
          risk_tolerance?: string | null
          target_allocation?: Json | null
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          portfolio_type?: string
          risk_tolerance?: string | null
          target_allocation?: Json | null
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voltmarket_profiles: {
        Row: {
          accredited_investor: boolean | null
          address: string | null
          business_license: string | null
          city: string | null
          company_name: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          id: string
          investment_capacity_usd: number | null
          investment_timeline: string | null
          is_email_verified: boolean | null
          is_id_verified: boolean | null
          linkedin_url: string | null
          phone: string | null
          preferred_investment_types: string[] | null
          role: string | null
          state: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          zip_code: string | null
        }
        Insert: {
          accredited_investor?: boolean | null
          address?: string | null
          business_license?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          id?: string
          investment_capacity_usd?: number | null
          investment_timeline?: string | null
          is_email_verified?: boolean | null
          is_id_verified?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          preferred_investment_types?: string[] | null
          role?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          zip_code?: string | null
        }
        Update: {
          accredited_investor?: boolean | null
          address?: string | null
          business_license?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          id?: string
          investment_capacity_usd?: number | null
          investment_timeline?: string | null
          is_email_verified?: boolean | null
          is_id_verified?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          preferred_investment_types?: string[] | null
          role?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      voltmarket_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          rating: number
          review_text: string | null
          reviewed_user_id: string | null
          reviewer_id: string
          transaction_verified: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          review_text?: string | null
          reviewed_user_id?: string | null
          reviewer_id: string
          transaction_verified?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          review_text?: string | null
          reviewed_user_id?: string | null
          reviewer_id?: string
          transaction_verified?: boolean | null
        }
        Relationships: []
      }
      voltmarket_saved_searches: {
        Row: {
          created_at: string
          id: string
          name: string
          notification_enabled: boolean | null
          notifications_enabled: boolean | null
          search_criteria: Json
          search_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notification_enabled?: boolean | null
          notifications_enabled?: boolean | null
          search_criteria: Json
          search_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notification_enabled?: boolean | null
          notifications_enabled?: boolean | null
          search_criteria?: Json
          search_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voltmarket_verification: {
        Row: {
          documents: Json | null
          id: string
          status: Database["public"]["Enums"]["voltmarket_verification_status"]
          submitted_at: string
          user_id: string
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          documents?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["voltmarket_verification_status"]
          submitted_at?: string
          user_id: string
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          documents?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["voltmarket_verification_status"]
          submitted_at?: string
          user_id?: string
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      voltmarket_verification_documents: {
        Row: {
          document_type: string
          file_path: string
          filename: string
          id: string
          uploaded_at: string | null
          verification_id: string
        }
        Insert: {
          document_type: string
          file_path: string
          filename: string
          id?: string
          uploaded_at?: string | null
          verification_id: string
        }
        Update: {
          document_type?: string
          file_path?: string
          filename?: string
          id?: string
          uploaded_at?: string | null
          verification_id?: string
        }
        Relationships: []
      }
      voltmarket_watchlist: {
        Row: {
          added_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: []
      }
      voltscout_approved_users: {
        Row: {
          approved_at: string
          approved_by: string | null
          created_at: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_voltscout_approved: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_type:
        | "new_property"
        | "price_change"
        | "status_change"
        | "high_voltscore"
      app_role: "admin" | "moderator" | "user"
      property_status:
        | "available"
        | "under_contract"
        | "sold"
        | "off_market"
        | "analyzing"
      property_type:
        | "residential"
        | "commercial"
        | "industrial"
        | "land"
        | "mixed_use"
        | "agricultural"
        | "warehouse"
        | "data_center"
        | "solar_farm"
        | "wind_farm"
        | "other"
      user_role: "admin" | "analyst" | "investor" | "broker"
      voltmarket_document_type:
        | "financial"
        | "legal"
        | "technical"
        | "marketing"
        | "due_diligence"
        | "other"
      voltmarket_equipment_condition: "new" | "used" | "refurbished"
      voltmarket_equipment_type:
        | "asic"
        | "gpu"
        | "cooling"
        | "generator"
        | "ups"
        | "transformer"
        | "other"
      voltmarket_listing_status:
        | "active"
        | "sold"
        | "under_contract"
        | "withdrawn"
      voltmarket_loi_status: "pending" | "accepted" | "rejected"
      voltmarket_nda_status: "pending" | "approved" | "rejected"
      voltmarket_property_type:
        | "data_center"
        | "industrial"
        | "warehouse"
        | "land"
        | "office"
        | "other"
      voltmarket_seller_type:
        | "site_owner"
        | "broker"
        | "realtor"
        | "equipment_vendor"
      voltmarket_user_role: "buyer" | "seller" | "admin"
      voltmarket_verification_status: "pending" | "verified" | "rejected"
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
      alert_type: [
        "new_property",
        "price_change",
        "status_change",
        "high_voltscore",
      ],
      app_role: ["admin", "moderator", "user"],
      property_status: [
        "available",
        "under_contract",
        "sold",
        "off_market",
        "analyzing",
      ],
      property_type: [
        "residential",
        "commercial",
        "industrial",
        "land",
        "mixed_use",
        "agricultural",
        "warehouse",
        "data_center",
        "solar_farm",
        "wind_farm",
        "other",
      ],
      user_role: ["admin", "analyst", "investor", "broker"],
      voltmarket_document_type: [
        "financial",
        "legal",
        "technical",
        "marketing",
        "due_diligence",
        "other",
      ],
      voltmarket_equipment_condition: ["new", "used", "refurbished"],
      voltmarket_equipment_type: [
        "asic",
        "gpu",
        "cooling",
        "generator",
        "ups",
        "transformer",
        "other",
      ],
      voltmarket_listing_status: [
        "active",
        "sold",
        "under_contract",
        "withdrawn",
      ],
      voltmarket_loi_status: ["pending", "accepted", "rejected"],
      voltmarket_nda_status: ["pending", "approved", "rejected"],
      voltmarket_property_type: [
        "data_center",
        "industrial",
        "warehouse",
        "land",
        "office",
        "other",
      ],
      voltmarket_seller_type: [
        "site_owner",
        "broker",
        "realtor",
        "equipment_vendor",
      ],
      voltmarket_user_role: ["buyer", "seller", "admin"],
      voltmarket_verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
