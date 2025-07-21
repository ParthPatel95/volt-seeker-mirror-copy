-- Add missing columns to companies table for corporate intelligence compatibility
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS power_usage_estimate numeric,
ADD COLUMN IF NOT EXISTS financial_health_score numeric,
ADD COLUMN IF NOT EXISTS current_ratio numeric,
ADD COLUMN IF NOT EXISTS debt_to_equity numeric,
ADD COLUMN IF NOT EXISTS revenue_growth numeric,
ADD COLUMN IF NOT EXISTS profit_margin numeric,
ADD COLUMN IF NOT EXISTS distress_signals text[],
ADD COLUMN IF NOT EXISTS locations jsonb;

-- Add missing columns to verified_heavy_power_sites table for industry intel compatibility
ALTER TABLE public.verified_heavy_power_sites 
ADD COLUMN IF NOT EXISTS satellite_image_url text,
ADD COLUMN IF NOT EXISTS capacity_utilization numeric,
ADD COLUMN IF NOT EXISTS transmission_access text,
ADD COLUMN IF NOT EXISTS substation_distance_km numeric,
ADD COLUMN IF NOT EXISTS year_built integer,
ADD COLUMN IF NOT EXISTS lot_size_acres numeric,
ADD COLUMN IF NOT EXISTS square_footage numeric,
ADD COLUMN IF NOT EXISTS listing_price numeric,
ADD COLUMN IF NOT EXISTS price_per_sqft numeric,
ADD COLUMN IF NOT EXISTS zoning text,
ADD COLUMN IF NOT EXISTS naics_code text,
ADD COLUMN IF NOT EXISTS satellite_analysis jsonb;

-- Create the missing site_scan_sessions table referenced in scanOrchestrator
CREATE TABLE IF NOT EXISTS public.site_scan_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jurisdiction text NOT NULL,
  scan_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid NOT NULL,
  config jsonb DEFAULT '{}',
  sites_discovered integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.site_scan_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their scan sessions" ON public.site_scan_sessions FOR ALL USING (auth.uid() = created_by);

-- Create trigger for site_scan_sessions updated_at
CREATE TRIGGER update_site_scan_sessions_updated_at
  BEFORE UPDATE ON public.site_scan_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();