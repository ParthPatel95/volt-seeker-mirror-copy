-- Add missing user_alert_preferences table and fix schema issues

CREATE TABLE IF NOT EXISTS public.user_alert_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  frequency text DEFAULT 'immediate',
  quiet_hours_start time,
  quiet_hours_end time,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_alert_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their alert preferences" ON public.user_alert_preferences FOR ALL USING (auth.uid() = user_id);

-- Update verified_heavy_power_sites to include missing columns for industry intel compatibility
ALTER TABLE public.verified_heavy_power_sites 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS facility_type text,
ADD COLUMN IF NOT EXISTS industry_type text,
ADD COLUMN IF NOT EXISTS business_status text,
ADD COLUMN IF NOT EXISTS confidence_level numeric,
ADD COLUMN IF NOT EXISTS power_potential numeric,
ADD COLUMN IF NOT EXISTS validation_status text,
ADD COLUMN IF NOT EXISTS estimated_free_mw numeric,
ADD COLUMN IF NOT EXISTS idle_score integer;

-- Add satellite_analysis to metadata if not exists (using JSONB structure)
-- This will be handled through metadata column as JSONB

-- Create trigger for user_alert_preferences updated_at
CREATE TRIGGER update_user_alert_preferences_updated_at
  BEFORE UPDATE ON public.user_alert_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();