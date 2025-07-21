-- Complete GridBazaar/VoltScout Database Schema Migration
-- This script creates all tables, types, functions, and policies for the complete system

-- First, create custom types
CREATE TYPE public.alert_type AS ENUM ('property_match', 'price_change', 'new_listing', 'market_update');
CREATE TYPE public.property_type AS ENUM ('industrial', 'data_center', 'warehouse', 'manufacturing', 'office', 'retail', 'land', 'other');
CREATE TYPE public.property_status AS ENUM ('analyzing', 'available', 'under_contract', 'sold', 'off_market');
CREATE TYPE public.user_role AS ENUM ('admin', 'analyst', 'investor', 'broker');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES 
('listing-images', 'listing-images', true),
('profile-images', 'profile-images', true),
('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- GridBazaar profiles (if not exists)
CREATE TABLE IF NOT EXISTS public.gridbazaar_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  company_name text,
  phone_number text,
  bio text,
  role text NOT NULL DEFAULT 'buyer',
  seller_type text,
  website text,
  linkedin_url text,
  profile_image_url text,
  is_email_verified boolean NOT NULL DEFAULT false,
  is_id_verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- VoltScout approved users
CREATE TABLE IF NOT EXISTS public.voltscout_approved_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  approved_by uuid,
  approved_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Access and site requests
CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  platform_use text NOT NULL,
  additional_info text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by text,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text NOT NULL,
  power_requirement text NOT NULL,
  location text NOT NULL CHECK (location IN ('USA', 'Canada', 'Uganda')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- VoltMarket contact messages (if not exists)
CREATE TABLE IF NOT EXISTS public.voltmarket_contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL,
  listing_owner_id uuid NOT NULL,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- VoltMarket email verification tokens
CREATE TABLE IF NOT EXISTS public.voltmarket_email_verification_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Company analysis tables
CREATE TABLE IF NOT EXISTS public.ai_company_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  financial_outlook text,
  risk_assessment text,
  investment_recommendation text,
  power_consumption_analysis text,
  key_insights text[],
  distress_probability numeric,
  acquisition_readiness numeric,
  analyzed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_real_estate_assets (
  id text NOT NULL PRIMARY KEY,
  company_ticker text,
  company_name text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('Office', 'Data Center', 'Industrial', 'Other Industrial Asset')),
  location_description text NOT NULL,
  coordinates point,
  source text NOT NULL DEFAULT 'SEC Filing',
  raw_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Intelligence and analysis tables
CREATE TABLE IF NOT EXISTS public.distress_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  distress_level integer NOT NULL CHECK (distress_level >= 0 AND distress_level <= 100),
  alert_type text NOT NULL,
  signals text[] NOT NULL,
  potential_value numeric NOT NULL,
  power_capacity numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.industry_intelligence (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  ticker text,
  industry text NOT NULL,
  risk_level text,
  financial_health integer,
  market_cap bigint,
  power_intensity text,
  scanned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(company_name, industry)
);

CREATE TABLE IF NOT EXISTS public.industry_intel_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_session_id uuid,
  name text NOT NULL,
  address text,
  city text,
  state text,
  zip_code text,
  coordinates point,
  opportunity_type text NOT NULL,
  estimated_power_mw numeric DEFAULT 0,
  distress_score integer DEFAULT 0,
  status text DEFAULT 'active',
  data_sources jsonb DEFAULT '[]',
  opportunity_details jsonb DEFAULT '{}',
  ai_insights text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.linkedin_intelligence (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company text NOT NULL,
  content text NOT NULL,
  post_date timestamp with time zone NOT NULL,
  keywords text[],
  signals text[],
  discovered_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news_intelligence (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  source text NOT NULL,
  url text,
  published_at timestamp with time zone,
  keywords text[],
  discovered_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  insight_type text NOT NULL,
  source text NOT NULL,
  content text NOT NULL,
  keywords text[],
  discovered_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Financial and investment analysis tables
CREATE TABLE IF NOT EXISTS public.investment_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  overall_score integer NOT NULL,
  opportunity_score integer NOT NULL,
  risk_score integer NOT NULL,
  timing_score integer NOT NULL,
  confidence_level integer NOT NULL,
  recommendation text NOT NULL,
  key_factors text[],
  risk_factors text[],
  expected_roi_range jsonb,
  calculated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.market_timing_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  market_cycle_phase text NOT NULL,
  market_conditions_score integer NOT NULL,
  fire_sale_probability numeric,
  institutional_activity_level text,
  timing_recommendation text,
  key_timing_factors text[],
  optimal_acquisition_window jsonb,
  analysis_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.competitor_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  competitor_name text NOT NULL,
  market_share_estimate numeric,
  power_usage_comparison numeric,
  market_positioning text,
  competitive_advantages text[],
  competitive_weaknesses text[],
  analysis_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.esg_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  environmental_score integer NOT NULL,
  social_score integer NOT NULL,
  governance_score integer NOT NULL,
  overall_esg_score integer NOT NULL,
  carbon_footprint_mt numeric,
  renewable_energy_percent numeric,
  regulatory_compliance_score integer,
  sustainability_commitments text[],
  green_transition_opportunities text[],
  assessment_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.power_demand_forecasts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  forecast_date date NOT NULL,
  forecast_horizon_months integer NOT NULL,
  predicted_consumption_mw numeric NOT NULL,
  confidence_score integer NOT NULL,
  growth_assumptions jsonb,
  seasonal_factors jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Energy infrastructure tables (extend existing)
CREATE TABLE IF NOT EXISTS public.city_power_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  state text NOT NULL,
  total_substation_capacity_mva numeric NOT NULL,
  available_capacity_mva numeric NOT NULL,
  peak_demand_estimate_mw numeric NOT NULL,
  average_load_factor numeric NOT NULL,
  grid_reliability_score integer NOT NULL,
  energy_rate_estimate_per_mwh numeric NOT NULL,
  generation_sources jsonb,
  transmission_lines jsonb,
  utility_companies jsonb,
  market_conditions jsonb,
  regulatory_environment jsonb,
  expansion_opportunities jsonb,
  analysis_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User-specific tables
CREATE TABLE IF NOT EXISTS public.search_criteria (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  email_alerts boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_alert_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  frequency text DEFAULT 'immediate',
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recommendation_type text NOT NULL,
  target_companies text[],
  investment_thesis text,
  sector_allocation jsonb,
  geographic_allocation jsonb,
  risk_adjusted_return numeric,
  diversification_score integer NOT NULL,
  timing_recommendations jsonb,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Property-related supporting tables
CREATE TABLE IF NOT EXISTS public.brokers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  specialties text[],
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_brokers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL,
  broker_id uuid NOT NULL,
  is_listing_agent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL,
  user_id uuid NOT NULL,
  note text NOT NULL,
  is_private boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Scraping system tables
CREATE TABLE IF NOT EXISTS public.scraping_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  keywords text[] NOT NULL DEFAULT '{}',
  last_run timestamp with time zone,
  properties_found integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scraping_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL,
  source_name text NOT NULL,
  status text NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  properties_found integer DEFAULT 0,
  errors text[]
);

-- Energy cost calculations
CREATE TABLE IF NOT EXISTS public.energy_cost_calculations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid,
  tariff_id uuid,
  monthly_consumption_mwh numeric NOT NULL,
  peak_demand_mw numeric NOT NULL,
  calculated_monthly_cost numeric NOT NULL,
  calculation_details jsonb,
  calculation_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Crypto cache table
CREATE TABLE IF NOT EXISTS public.crypto_details_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol text NOT NULL UNIQUE,
  data jsonb NOT NULL,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Due diligence reports
CREATE TABLE IF NOT EXISTS public.due_diligence_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid,
  listing_id uuid,
  report_type text NOT NULL,
  executive_summary text,
  financial_analysis jsonb,
  risk_assessment jsonb,
  power_infrastructure_assessment jsonb,
  valuation_analysis jsonb,
  recommendations text[],
  report_data jsonb,
  generated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Verified heavy power sites
CREATE TABLE IF NOT EXISTS public.verified_heavy_power_sites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  coordinates point,
  power_capacity_mw numeric NOT NULL,
  site_type text NOT NULL,
  operational_status text NOT NULL DEFAULT 'operational',
  verification_method text NOT NULL,
  verification_source text,
  last_verified timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  metadata jsonb DEFAULT '{}',
  created_by uuid NOT NULL,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Additional database functions
CREATE OR REPLACE FUNCTION public.update_gridbazaar_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_industry_intel_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_voltscout_approved(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.voltscout_approved_users 
    WHERE voltscout_approved_users.user_id = is_voltscout_approved.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.clean_expired_verification_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.voltmarket_email_verification_tokens 
  WHERE expires_at < now() AND used_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_message_conversation_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Find or create conversation
  SELECT id INTO NEW.conversation_id
  FROM public.voltmarket_conversations
  WHERE listing_id = NEW.listing_id
    AND (
      (buyer_id = NEW.sender_id AND seller_id = NEW.recipient_id) OR
      (buyer_id = NEW.recipient_id AND seller_id = NEW.sender_id)
    );
  
  -- If no conversation exists, create one
  IF NEW.conversation_id IS NULL THEN
    INSERT INTO public.voltmarket_conversations (listing_id, buyer_id, seller_id)
    VALUES (NEW.listing_id, NEW.sender_id, NEW.recipient_id)
    RETURNING id INTO NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.soft_delete_verified_site(site_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = now(), updated_at = now()
  WHERE id = site_id AND created_by = auth.uid() AND deleted_at IS NULL;
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.bulk_delete_verified_sites(site_ids uuid[])
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = now(), updated_at = now()
  WHERE id = ANY(site_ids) AND created_by = auth.uid() AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_verified_site(site_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = NULL, updated_at = now()
  WHERE id = site_id AND created_by = auth.uid() AND deleted_at IS NOT NULL;
  
  RETURN FOUND;
END;
$$;

-- Create triggers for new tables
CREATE TRIGGER update_gridbazaar_profiles_updated_at_trigger
  BEFORE UPDATE ON public.gridbazaar_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_gridbazaar_profiles_updated_at();

CREATE TRIGGER update_intel_results_updated_at
  BEFORE UPDATE ON public.industry_intel_results
  FOR EACH ROW EXECUTE FUNCTION public.update_industry_intel_results_updated_at();

CREATE TRIGGER set_conversation_id_trigger
  BEFORE INSERT ON public.voltmarket_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_message_conversation_id();

-- Enable RLS on new tables
ALTER TABLE public.gridbazaar_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltscout_approved_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_company_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_real_estate_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_intel_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_timing_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_power_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_cost_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_details_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.due_diligence_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_heavy_power_sites ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for critical tables
CREATE POLICY "Users can manage their GridBazaar profile" ON public.gridbazaar_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their access requests" ON public.access_requests FOR SELECT USING (true);
CREATE POLICY "Users can create access requests" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view site access requests" ON public.site_access_requests FOR SELECT USING (true);
CREATE POLICY "Users can create site access requests" ON public.site_access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their VoltMarket contact messages" ON public.voltmarket_contact_messages FOR ALL USING (auth.uid() = listing_owner_id);
CREATE POLICY "Authenticated users can view analysis data" ON public.ai_company_analysis FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view company assets" ON public.company_real_estate_assets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view distress alerts" ON public.distress_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view industry intelligence" ON public.industry_intelligence FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view intel results" ON public.industry_intel_results FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their intel results" ON public.industry_intel_results FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can view verified sites" ON public.verified_heavy_power_sites FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "Users can manage their verified sites" ON public.verified_heavy_power_sites FOR ALL USING (auth.uid() = created_by);