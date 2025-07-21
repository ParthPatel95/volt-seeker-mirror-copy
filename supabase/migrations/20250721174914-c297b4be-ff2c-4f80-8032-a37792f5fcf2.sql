-- Create only missing tables and types for GridBazaar/VoltScout system
-- Skip existing types to avoid conflicts

-- Create custom types only if they don't exist
DO $$ BEGIN
    CREATE TYPE public.property_status AS ENUM ('analyzing', 'available', 'under_contract', 'sold', 'off_market');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'analyst', 'investor', 'broker');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create missing tables
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

CREATE TABLE IF NOT EXISTS public.voltscout_approved_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  approved_by uuid,
  approved_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

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

-- Create necessary functions
CREATE OR REPLACE FUNCTION public.update_gridbazaar_profiles_updated_at()
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

-- Enable RLS on new tables
ALTER TABLE public.gridbazaar_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltscout_approved_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_company_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_real_estate_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_intel_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_heavy_power_sites ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can manage their GridBazaar profile" ON public.gridbazaar_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view access requests" ON public.access_requests FOR SELECT USING (true);
CREATE POLICY "Public can create access requests" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view site access requests" ON public.site_access_requests FOR SELECT USING (true);
CREATE POLICY "Public can create site access requests" ON public.site_access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can manage VoltMarket contact messages" ON public.voltmarket_contact_messages FOR ALL USING (auth.uid() = listing_owner_id);
CREATE POLICY "Authenticated users can view AI analysis" ON public.ai_company_analysis FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view company assets" ON public.company_real_estate_assets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view distress alerts" ON public.distress_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view industry intelligence" ON public.industry_intelligence FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view intel results" ON public.industry_intel_results FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view verified sites" ON public.verified_heavy_power_sites FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "Users can manage their verified sites" ON public.verified_heavy_power_sites FOR ALL USING (auth.uid() = created_by);

-- Create triggers
CREATE TRIGGER update_gridbazaar_profiles_updated_at_trigger
  BEFORE UPDATE ON public.gridbazaar_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_gridbazaar_profiles_updated_at();