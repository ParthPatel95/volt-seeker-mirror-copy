-- Create missing city_power_analysis table
CREATE TABLE IF NOT EXISTS public.city_power_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  state text NOT NULL,
  total_substation_capacity_mva numeric DEFAULT 0,
  available_capacity_mva numeric DEFAULT 0,
  average_load_factor numeric DEFAULT 0.75,
  peak_demand_estimate_mw numeric DEFAULT 0,
  energy_rate_estimate_per_mwh numeric DEFAULT 50,
  transmission_constraints text[],
  industrial_clusters jsonb DEFAULT '[]',
  renewable_potential jsonb DEFAULT '{}',
  regulatory_environment jsonb DEFAULT '{}',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_power_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all city power analysis" ON public.city_power_analysis FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create city power analysis" ON public.city_power_analysis FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for city_power_analysis updated_at
CREATE TRIGGER update_city_power_analysis_updated_at
  BEFORE UPDATE ON public.city_power_analysis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing columns to substations table to match the Substation interface
ALTER TABLE public.substations 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS voltage_level text,
ADD COLUMN IF NOT EXISTS utility_owner text,
ADD COLUMN IF NOT EXISTS transmission_lines integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS capacity_utilization numeric DEFAULT 0.75;