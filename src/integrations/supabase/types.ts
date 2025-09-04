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
      automated_valuations: {
        Row: {
          comparable_properties: Json
          confidence_score: number
          created_at: string
          created_by: string | null
          estimated_value: number
          id: string
          market_adjustments: Json
          methodology_details: Json
          property_id: string | null
          valid_until: string
          valuation_factors: Json
          valuation_method: string
          valuation_range: Json
        }
        Insert: {
          comparable_properties?: Json
          confidence_score: number
          created_at?: string
          created_by?: string | null
          estimated_value: number
          id?: string
          market_adjustments?: Json
          methodology_details?: Json
          property_id?: string | null
          valid_until?: string
          valuation_factors?: Json
          valuation_method: string
          valuation_range?: Json
        }
        Update: {
          comparable_properties?: Json
          confidence_score?: number
          created_at?: string
          created_by?: string | null
          estimated_value?: number
          id?: string
          market_adjustments?: Json
          methodology_details?: Json
          property_id?: string | null
          valid_until?: string
          valuation_factors?: Json
          valuation_method?: string
          valuation_range?: Json
        }
        Relationships: [
          {
            foreignKeyName: "automated_valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "verified_heavy_power_sites"
            referencedColumns: ["id"]
          },
        ]
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
      channel_members: {
        Row: {
          channel_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "collaboration_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      city_power_analysis: {
        Row: {
          available_capacity_mva: number | null
          average_load_factor: number | null
          city: string
          created_at: string
          created_by: string | null
          energy_rate_estimate_per_mwh: number | null
          id: string
          industrial_clusters: Json | null
          peak_demand_estimate_mw: number | null
          regulatory_environment: Json | null
          renewable_potential: Json | null
          state: string
          total_substation_capacity_mva: number | null
          transmission_constraints: string[] | null
          updated_at: string
        }
        Insert: {
          available_capacity_mva?: number | null
          average_load_factor?: number | null
          city: string
          created_at?: string
          created_by?: string | null
          energy_rate_estimate_per_mwh?: number | null
          id?: string
          industrial_clusters?: Json | null
          peak_demand_estimate_mw?: number | null
          regulatory_environment?: Json | null
          renewable_potential?: Json | null
          state: string
          total_substation_capacity_mva?: number | null
          transmission_constraints?: string[] | null
          updated_at?: string
        }
        Update: {
          available_capacity_mva?: number | null
          average_load_factor?: number | null
          city?: string
          created_at?: string
          created_by?: string | null
          energy_rate_estimate_per_mwh?: number | null
          id?: string
          industrial_clusters?: Json | null
          peak_demand_estimate_mw?: number | null
          regulatory_environment?: Json | null
          renewable_potential?: Json | null
          state?: string
          total_substation_capacity_mva?: number | null
          transmission_constraints?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      collaboration_channels: {
        Row: {
          channel_type: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          member_count: number | null
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          channel_type?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          channel_type?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          analyzed_at: string | null
          competitive_advantages: string[] | null
          created_at: string
          current_ratio: number | null
          debt_to_equity: number | null
          description: string | null
          distress_signals: string[] | null
          financial_data: Json | null
          financial_health_score: number | null
          headquarters_location: string | null
          id: string
          industry: string | null
          locations: Json | null
          market_cap: number | null
          name: string
          power_usage_estimate: number | null
          profit_margin: number | null
          revenue_growth: number | null
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
          current_ratio?: number | null
          debt_to_equity?: number | null
          description?: string | null
          distress_signals?: string[] | null
          financial_data?: Json | null
          financial_health_score?: number | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          locations?: Json | null
          market_cap?: number | null
          name: string
          power_usage_estimate?: number | null
          profit_margin?: number | null
          revenue_growth?: number | null
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
          current_ratio?: number | null
          debt_to_equity?: number | null
          description?: string | null
          distress_signals?: string[] | null
          financial_data?: Json | null
          financial_health_score?: number | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          locations?: Json | null
          market_cap?: number | null
          name?: string
          power_usage_estimate?: number | null
          profit_margin?: number | null
          revenue_growth?: number | null
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
      construction_monitoring: {
        Row: {
          construction_features: Json
          created_at: string
          created_by: string | null
          detected_changes: Json
          id: string
          monitoring_date: string
          progress_percentage: number
          property_id: string | null
          satellite_comparison: Json
          timeline_analysis: Json
        }
        Insert: {
          construction_features?: Json
          created_at?: string
          created_by?: string | null
          detected_changes?: Json
          id?: string
          monitoring_date: string
          progress_percentage: number
          property_id?: string | null
          satellite_comparison?: Json
          timeline_analysis?: Json
        }
        Update: {
          construction_features?: Json
          created_at?: string
          created_by?: string | null
          detected_changes?: Json
          id?: string
          monitoring_date?: string
          progress_percentage?: number
          property_id?: string | null
          satellite_comparison?: Json
          timeline_analysis?: Json
        }
        Relationships: [
          {
            foreignKeyName: "construction_monitoring_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "verified_heavy_power_sites"
            referencedColumns: ["id"]
          },
        ]
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
      cv_property_analysis: {
        Row: {
          analysis_results: Json
          analysis_type: string
          analysis_version: string
          confidence_level: number
          created_at: string
          created_by: string | null
          cv_scores: Json
          detected_features: Json
          id: string
          property_id: string | null
          recommendations: Json
          satellite_image_url: string | null
        }
        Insert: {
          analysis_results?: Json
          analysis_type: string
          analysis_version?: string
          confidence_level: number
          created_at?: string
          created_by?: string | null
          cv_scores?: Json
          detected_features?: Json
          id?: string
          property_id?: string | null
          recommendations?: Json
          satellite_image_url?: string | null
        }
        Update: {
          analysis_results?: Json
          analysis_type?: string
          analysis_version?: string
          confidence_level?: number
          created_at?: string
          created_by?: string | null
          cv_scores?: Json
          detected_features?: Json
          id?: string
          property_id?: string | null
          recommendations?: Json
          satellite_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_property_analysis_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "verified_heavy_power_sites"
            referencedColumns: ["id"]
          },
        ]
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
      email_verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          updated_at: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          updated_at?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          updated_at?: string
          used_at?: string | null
          user_id?: string
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
      energy_price_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          created_by: string | null
          factors_analyzed: Json
          id: string
          market_name: string
          model_version: string
          predicted_price_mwh: number
          prediction_date: string
          prediction_horizon_days: number
        }
        Insert: {
          confidence_score: number
          created_at?: string
          created_by?: string | null
          factors_analyzed?: Json
          id?: string
          market_name: string
          model_version?: string
          predicted_price_mwh: number
          prediction_date: string
          prediction_horizon_days: number
        }
        Update: {
          confidence_score?: number
          created_at?: string
          created_by?: string | null
          factors_analyzed?: Json
          id?: string
          market_name?: string
          model_version?: string
          predicted_price_mwh?: number
          prediction_date?: string
          prediction_horizon_days?: number
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
      environmental_analysis: {
        Row: {
          analysis_date: string
          created_at: string
          created_by: string | null
          environmental_score: number
          id: string
          impact_factors: Json
          land_use_changes: Json
          property_id: string | null
          sustainability_metrics: Json
          vegetation_analysis: Json
          water_proximity: Json
        }
        Insert: {
          analysis_date: string
          created_at?: string
          created_by?: string | null
          environmental_score: number
          id?: string
          impact_factors?: Json
          land_use_changes?: Json
          property_id?: string | null
          sustainability_metrics?: Json
          vegetation_analysis?: Json
          water_proximity?: Json
        }
        Update: {
          analysis_date?: string
          created_at?: string
          created_by?: string | null
          environmental_score?: number
          id?: string
          impact_factors?: Json
          land_use_changes?: Json
          property_id?: string | null
          sustainability_metrics?: Json
          vegetation_analysis?: Json
          water_proximity?: Json
        }
        Relationships: [
          {
            foreignKeyName: "environmental_analysis_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "verified_heavy_power_sites"
            referencedColumns: ["id"]
          },
        ]
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
      investment_recommendations: {
        Row: {
          action: string
          created_at: string
          created_by: string
          expected_roi: number | null
          id: string
          market_factors: Json
          priority_score: number
          property_id: string | null
          reasoning: Json
          recommendation_type: string
          risk_level: string
          timing_analysis: Json
          valid_until: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by: string
          expected_roi?: number | null
          id?: string
          market_factors?: Json
          priority_score: number
          property_id?: string | null
          reasoning: Json
          recommendation_type: string
          risk_level: string
          timing_analysis?: Json
          valid_until: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string
          expected_roi?: number | null
          id?: string
          market_factors?: Json
          priority_score?: number
          property_id?: string | null
          reasoning?: Json
          recommendation_type?: string
          risk_level?: string
          timing_analysis?: Json
          valid_until?: string
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          achievements_count: number | null
          category: string
          created_at: string
          id: string
          period_end: string | null
          period_start: string | null
          period_type: string | null
          rank_position: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_count?: number | null
          category: string
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          period_type?: string | null
          rank_position?: number | null
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_count?: number | null
          category?: string
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          period_type?: string | null
          rank_position?: number | null
          score?: number
          updated_at?: string
          user_id?: string
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
      market_intelligence: {
        Row: {
          analysis_data: Json
          analysis_type: string
          confidence_level: number
          created_at: string
          created_by: string | null
          id: string
          insights: Json
          market_region: string
          opportunities: Json
          risk_factors: Json
          valid_until: string
        }
        Insert: {
          analysis_data: Json
          analysis_type: string
          confidence_level: number
          created_at?: string
          created_by?: string | null
          id?: string
          insights?: Json
          market_region: string
          opportunities?: Json
          risk_factors?: Json
          valid_until: string
        }
        Update: {
          analysis_data?: Json
          analysis_type?: string
          confidence_level?: number
          created_at?: string
          created_by?: string | null
          id?: string
          insights?: Json
          market_region?: string
          opportunities?: Json
          risk_factors?: Json
          valid_until?: string
        }
        Relationships: []
      }
      market_sentiment: {
        Row: {
          analysis_date: string
          confidence_level: number
          created_at: string
          expert_opinions: Json
          id: string
          market_impact_forecast: Json
          market_segment: string
          news_analysis: Json
          sentiment_indicators: Json
          sentiment_score: number
          social_media_analysis: Json
        }
        Insert: {
          analysis_date?: string
          confidence_level: number
          created_at?: string
          expert_opinions?: Json
          id?: string
          market_impact_forecast?: Json
          market_segment: string
          news_analysis?: Json
          sentiment_indicators?: Json
          sentiment_score: number
          social_media_analysis?: Json
        }
        Update: {
          analysis_date?: string
          confidence_level?: number
          created_at?: string
          expert_opinions?: Json
          id?: string
          market_impact_forecast?: Json
          market_segment?: string
          news_analysis?: Json
          sentiment_indicators?: Json
          sentiment_score?: number
          social_media_analysis?: Json
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
      portfolio_optimizations: {
        Row: {
          created_at: string
          current_portfolio: Json
          expected_performance: Json
          id: string
          optimization_metrics: Json
          optimization_type: string
          optimized_portfolio: Json
          rebalancing_suggestions: Json
          risk_analysis: Json
          user_id: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          current_portfolio?: Json
          expected_performance?: Json
          id?: string
          optimization_metrics?: Json
          optimization_type: string
          optimized_portfolio?: Json
          rebalancing_suggestions?: Json
          risk_analysis?: Json
          user_id: string
          valid_until?: string
        }
        Update: {
          created_at?: string
          current_portfolio?: Json
          expected_performance?: Json
          id?: string
          optimization_metrics?: Json
          optimization_type?: string
          optimized_portfolio?: Json
          rebalancing_suggestions?: Json
          risk_analysis?: Json
          user_id?: string
          valid_until?: string
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
      real_time_messages: {
        Row: {
          attachments: Json | null
          channel_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          channel_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          id: string
          points_cost: number
          redeemed_at: string
          redemption_data: Json | null
          reward_name: string
          reward_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          points_cost: number
          redeemed_at?: string
          redemption_data?: Json | null
          reward_name: string
          reward_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          points_cost?: number
          redeemed_at?: string
          redemption_data?: Json | null
          reward_name?: string
          reward_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          assessment_date: string
          confidence_level: number
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string
          financial_metrics: Json
          id: string
          market_conditions: Json
          overall_risk_score: number
          recommendations: Json
          risk_factors: Json
          stress_test_results: Json
          valid_until: string
        }
        Insert: {
          assessment_date?: string
          confidence_level: number
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type: string
          financial_metrics?: Json
          id?: string
          market_conditions?: Json
          overall_risk_score: number
          recommendations?: Json
          risk_factors?: Json
          stress_test_results?: Json
          valid_until?: string
        }
        Update: {
          assessment_date?: string
          confidence_level?: number
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string
          financial_metrics?: Json
          id?: string
          market_conditions?: Json
          overall_risk_score?: number
          recommendations?: Json
          risk_factors?: Json
          stress_test_results?: Json
          valid_until?: string
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
      site_scan_sessions: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string
          created_by: string
          id: string
          jurisdiction: string
          scan_type: string
          sites_discovered: number | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by: string
          id?: string
          jurisdiction: string
          scan_type: string
          sites_discovered?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          jurisdiction?: string
          scan_type?: string
          sites_discovered?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          replies_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          replies_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          replies_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      social_hashtags: {
        Row: {
          created_at: string
          id: string
          posts_count: number | null
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          posts_count?: number | null
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          posts_count?: number | null
          tag?: string
        }
        Relationships: []
      }
      social_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      social_notifications: {
        Row: {
          comment_id: string | null
          content: string | null
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean | null
          post_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          content?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          post_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          comment_id?: string | null
          content?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          post_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          attachments: Json | null
          comments_count: number | null
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          mentions: string[] | null
          post_type: string
          replies_count: number | null
          reply_to_id: string | null
          repost_of_id: string | null
          reposts_count: number | null
          shares_count: number | null
          tags: string[] | null
          updated_at: string
          user_id: string
          views_count: number | null
          visibility: string | null
        }
        Insert: {
          attachments?: Json | null
          comments_count?: number | null
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          mentions?: string[] | null
          post_type?: string
          replies_count?: number | null
          reply_to_id?: string | null
          repost_of_id?: string | null
          reposts_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          visibility?: string | null
        }
        Update: {
          attachments?: Json | null
          comments_count?: number | null
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          mentions?: string[] | null
          post_type?: string
          replies_count?: number | null
          reply_to_id?: string | null
          repost_of_id?: string | null
          reposts_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_repost_of_id_fkey"
            columns: ["repost_of_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          followers_count: number | null
          following_count: number | null
          header_url: string | null
          id: string
          likes_count: number | null
          location: string | null
          posts_count: number | null
          updated_at: string
          user_id: string
          username: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          followers_count?: number | null
          following_count?: number | null
          header_url?: string | null
          id?: string
          likes_count?: number | null
          location?: string | null
          posts_count?: number | null
          updated_at?: string
          user_id: string
          username: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          followers_count?: number | null
          following_count?: number | null
          header_url?: string | null
          id?: string
          likes_count?: number | null
          location?: string | null
          posts_count?: number | null
          updated_at?: string
          user_id?: string
          username?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      social_reposts: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      stress_tests: {
        Row: {
          baseline_metrics: Json
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string
          id: string
          mitigation_strategies: Json
          resilience_score: number
          stress_results: Json
          stress_scenarios: Json
          test_name: string
          vulnerability_analysis: Json
        }
        Insert: {
          baseline_metrics?: Json
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          mitigation_strategies?: Json
          resilience_score: number
          stress_results?: Json
          stress_scenarios?: Json
          test_name: string
          vulnerability_analysis?: Json
        }
        Update: {
          baseline_metrics?: Json
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          mitigation_strategies?: Json
          resilience_score?: number
          stress_results?: Json
          stress_scenarios?: Json
          test_name?: string
          vulnerability_analysis?: Json
        }
        Relationships: []
      }
      substations: {
        Row: {
          capacity_mva: number | null
          capacity_utilization: number | null
          city: string | null
          commissioned_date: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          owner: string | null
          state: string | null
          status: string | null
          substation_type: string | null
          transmission_lines: number | null
          updated_at: string
          utility_owner: string | null
          voltage_kv: number | null
          voltage_level: string | null
        }
        Insert: {
          capacity_mva?: number | null
          capacity_utilization?: number | null
          city?: string | null
          commissioned_date?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner?: string | null
          state?: string | null
          status?: string | null
          substation_type?: string | null
          transmission_lines?: number | null
          updated_at?: string
          utility_owner?: string | null
          voltage_kv?: number | null
          voltage_level?: string | null
        }
        Update: {
          capacity_mva?: number | null
          capacity_utilization?: number | null
          city?: string | null
          commissioned_date?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner?: string | null
          state?: string | null
          status?: string | null
          substation_type?: string | null
          transmission_lines?: number | null
          updated_at?: string
          utility_owner?: string | null
          voltage_kv?: number | null
          voltage_level?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          badge_icon: string | null
          description: string | null
          earned_at: string
          id: string
          points_earned: number | null
          requirements_met: Json | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          badge_icon?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points_earned?: number | null
          requirements_met?: Json | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          badge_icon?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points_earned?: number | null
          requirements_met?: Json | null
          user_id?: string
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
      user_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          priority?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          current_level: number | null
          experience_points: number | null
          id: string
          last_activity_date: string | null
          lifetime_stats: Json | null
          streak_days: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number | null
          experience_points?: number | null
          id?: string
          last_activity_date?: string | null
          lifetime_stats?: Json | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number | null
          experience_points?: number | null
          id?: string
          last_activity_date?: string | null
          lifetime_stats?: Json | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verified_heavy_power_sites: {
        Row: {
          address: string
          business_status: string | null
          capacity_utilization: number | null
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
          listing_price: number | null
          lot_size_acres: number | null
          metadata: Json | null
          naics_code: string | null
          name: string | null
          notes: string | null
          operational_status: string
          power_capacity_mw: number
          power_potential: number | null
          price_per_sqft: number | null
          satellite_analysis: Json | null
          satellite_image_url: string | null
          site_name: string
          site_type: string
          square_footage: number | null
          state: string
          substation_distance_km: number | null
          transmission_access: string | null
          updated_at: string
          validation_status: string | null
          verification_method: string
          verification_source: string | null
          year_built: number | null
          zip_code: string | null
          zoning: string | null
        }
        Insert: {
          address: string
          business_status?: string | null
          capacity_utilization?: number | null
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
          listing_price?: number | null
          lot_size_acres?: number | null
          metadata?: Json | null
          naics_code?: string | null
          name?: string | null
          notes?: string | null
          operational_status?: string
          power_capacity_mw: number
          power_potential?: number | null
          price_per_sqft?: number | null
          satellite_analysis?: Json | null
          satellite_image_url?: string | null
          site_name: string
          site_type: string
          square_footage?: number | null
          state: string
          substation_distance_km?: number | null
          transmission_access?: string | null
          updated_at?: string
          validation_status?: string | null
          verification_method: string
          verification_source?: string | null
          year_built?: number | null
          zip_code?: string | null
          zoning?: string | null
        }
        Update: {
          address?: string
          business_status?: string | null
          capacity_utilization?: number | null
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
          listing_price?: number | null
          lot_size_acres?: number | null
          metadata?: Json | null
          naics_code?: string | null
          name?: string | null
          notes?: string | null
          operational_status?: string
          power_capacity_mw?: number
          power_potential?: number | null
          price_per_sqft?: number | null
          satellite_analysis?: Json | null
          satellite_image_url?: string | null
          site_name?: string
          site_type?: string
          square_footage?: number | null
          state?: string
          substation_distance_km?: number | null
          transmission_access?: string | null
          updated_at?: string
          validation_status?: string | null
          verification_method?: string
          verification_source?: string | null
          year_built?: number | null
          zip_code?: string | null
          zoning?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_voltmarket_contact_messages_listing"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_listings"
            referencedColumns: ["id"]
          },
        ]
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
      voltmarket_email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          subject: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          subject: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          subject?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      voltmarket_email_verification_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voltmarket_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
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
          available_power_mw: number | null
          brand: string | null
          cooling_type: string | null
          created_at: string
          description: string | null
          equipment_condition: string | null
          equipment_type: string | null
          facility_tier: string | null
          hosting_types: string[] | null
          id: string
          is_location_confidential: boolean | null
          latitude: number | null
          lease_rate: number | null
          listing_type: string
          location: string
          longitude: number | null
          manufacture_year: number | null
          minimum_commitment_months: number | null
          model: string | null
          power_capacity_mw: number | null
          power_rate_per_kw: number | null
          property_type: string | null
          quantity: number | null
          seller_id: string
          shipping_terms: string | null
          specs: Json | null
          square_footage: number | null
          status: Database["public"]["Enums"]["voltmarket_listing_status"]
          title: string
          updated_at: string
        }
        Insert: {
          asking_price: number
          available_power_mw?: number | null
          brand?: string | null
          cooling_type?: string | null
          created_at?: string
          description?: string | null
          equipment_condition?: string | null
          equipment_type?: string | null
          facility_tier?: string | null
          hosting_types?: string[] | null
          id?: string
          is_location_confidential?: boolean | null
          latitude?: number | null
          lease_rate?: number | null
          listing_type: string
          location: string
          longitude?: number | null
          manufacture_year?: number | null
          minimum_commitment_months?: number | null
          model?: string | null
          power_capacity_mw?: number | null
          power_rate_per_kw?: number | null
          property_type?: string | null
          quantity?: number | null
          seller_id: string
          shipping_terms?: string | null
          specs?: Json | null
          square_footage?: number | null
          status?: Database["public"]["Enums"]["voltmarket_listing_status"]
          title: string
          updated_at?: string
        }
        Update: {
          asking_price?: number
          available_power_mw?: number | null
          brand?: string | null
          cooling_type?: string | null
          created_at?: string
          description?: string | null
          equipment_condition?: string | null
          equipment_type?: string | null
          facility_tier?: string | null
          hosting_types?: string[] | null
          id?: string
          is_location_confidential?: boolean | null
          latitude?: number | null
          lease_rate?: number | null
          listing_type?: string
          location?: string
          longitude?: number | null
          manufacture_year?: number | null
          minimum_commitment_months?: number | null
          model?: string | null
          power_capacity_mw?: number | null
          power_rate_per_kw?: number | null
          property_type?: string | null
          quantity?: number | null
          seller_id?: string
          shipping_terms?: string | null
          specs?: Json | null
          square_footage?: number | null
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
          created_at: string
          id: string
          listing_id: string
          requested_at: string
          requester_id: string
          responded_at: string | null
          seller_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          requested_at?: string
          requester_id: string
          responded_at?: string | null
          seller_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          requested_at?: string
          requester_id?: string
          responded_at?: string | null
          seller_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_voltmarket_nda_requests_listing"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voltmarket_nda_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voltmarket_nda_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "gridbazaar_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          return_percentage: number | null
          risk_tolerance: string | null
          target_allocation: Json | null
          total_return: number | null
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
          return_percentage?: number | null
          risk_tolerance?: string | null
          target_allocation?: Json | null
          total_return?: number | null
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
          return_percentage?: number | null
          risk_tolerance?: string | null
          target_allocation?: Json | null
          total_return?: number | null
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
      voltmarket_social_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      voltmarket_social_posts: {
        Row: {
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          media_urls: string[] | null
          post_type: string
          related_listing_id: string | null
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          post_type?: string
          related_listing_id?: string | null
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          post_type?: string
          related_listing_id?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string
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
        Relationships: [
          {
            foreignKeyName: "fk_voltmarket_watchlist_listing_id"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "voltmarket_listings"
            referencedColumns: ["id"]
          },
        ]
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
      cleanup_old_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment: {
        Args: { column_name: string; row_id: string; table_name: string }
        Returns: undefined
      }
      increment_user_points: {
        Args: { p_points: number; p_user_id: string }
        Returns: undefined
      }
      is_voltscout_approved: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_user_progress: {
        Args: { p_action_type: string; p_points: number; p_user_id: string }
        Returns: undefined
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
