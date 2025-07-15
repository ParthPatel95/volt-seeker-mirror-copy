-- Add missing enums and tables

-- Create property_type enum
CREATE TYPE public.property_type AS ENUM (
  'residential',
  'commercial',
  'industrial',
  'land',
  'mixed_use',
  'agricultural',
  'warehouse',
  'data_center',
  'solar_farm',
  'wind_farm',
  'other'
);

-- Add property_type to properties table
ALTER TABLE public.properties 
ALTER COLUMN property_type TYPE property_type USING property_type::property_type;

-- Create voltmarket_profiles table
CREATE TABLE public.voltmarket_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role TEXT DEFAULT 'user',
  is_id_verified BOOLEAN DEFAULT false,
  is_email_verified BOOLEAN DEFAULT false,
  company_name TEXT,
  contact_person TEXT,
  phone TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  business_license TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  investment_capacity_usd NUMERIC,
  preferred_investment_types TEXT[],
  investment_timeline TEXT,
  accredited_investor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on voltmarket_profiles
ALTER TABLE public.voltmarket_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for voltmarket_profiles
CREATE POLICY "Users can view their own voltmarket profile"
ON public.voltmarket_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voltmarket profile"
ON public.voltmarket_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voltmarket profile"
ON public.voltmarket_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create energy_markets table
CREATE TABLE public.energy_markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_name TEXT NOT NULL,
  region TEXT,
  current_price_mwh NUMERIC,
  price_timestamp TIMESTAMP WITH TIME ZONE,
  daily_high NUMERIC,
  daily_low NUMERIC,
  market_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on energy_markets
ALTER TABLE public.energy_markets ENABLE ROW LEVEL SECURITY;

-- Create policy for energy_markets (public read access)
CREATE POLICY "Anyone can view energy markets"
ON public.energy_markets
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can create energy market data"
ON public.energy_markets
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Add timestamp triggers
CREATE TRIGGER update_voltmarket_profiles_updated_at
BEFORE UPDATE ON public.voltmarket_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_energy_markets_updated_at
BEFORE UPDATE ON public.energy_markets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();