-- Create core tables for the GridBazaar application

-- Properties table for real estate listings
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  property_type TEXT NOT NULL,
  square_footage INTEGER,
  lot_size_acres DECIMAL(10,2),
  asking_price DECIMAL(15,2),
  year_built INTEGER,
  power_capacity_mw DECIMAL(10,2),
  substation_distance_miles DECIMAL(8,2),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  source TEXT DEFAULT 'manual',
  listing_url TEXT,
  image_urls TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Substations table for power infrastructure
CREATE TABLE public.substations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  capacity_mva DECIMAL(10,2),
  voltage_kv INTEGER,
  owner TEXT,
  status TEXT DEFAULT 'active',
  substation_type TEXT,
  commissioned_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companies table for corporate intelligence
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT,
  industry TEXT,
  sector TEXT,
  market_cap DECIMAL(15,2),
  headquarters_location TEXT,
  website TEXT,
  description TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  financial_data JSONB,
  risk_factors TEXT[],
  competitive_advantages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts system table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scraped properties table
CREATE TABLE public.scraped_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  price DECIMAL(15,2),
  address TEXT,
  square_footage INTEGER,
  lot_size TEXT,
  property_type TEXT,
  description TEXT,
  images TEXT[],
  source_website TEXT,
  scraped_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- VoltScores table for property scoring
CREATE TABLE public.volt_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id),
  overall_score DECIMAL(5,2),
  location_score DECIMAL(5,2),
  infrastructure_score DECIMAL(5,2),
  economic_score DECIMAL(5,2),
  market_score DECIMAL(5,2),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  calculation_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company TEXT,
  role TEXT,
  phone TEXT,
  website TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraped_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volt_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Users can view all properties" 
ON public.properties FOR SELECT 
USING (true);

CREATE POLICY "Users can create properties" 
ON public.properties FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = created_by);

-- RLS Policies for substations
CREATE POLICY "Users can view all substations" 
ON public.substations FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create substations" 
ON public.substations FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for companies
CREATE POLICY "Users can view all companies" 
ON public.companies FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create companies" 
ON public.companies FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" 
ON public.alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create alerts" 
ON public.alerts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
ON public.alerts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
ON public.alerts FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for scraped properties
CREATE POLICY "Users can view all scraped properties" 
ON public.scraped_properties FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create scraped properties" 
ON public.scraped_properties FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for volt scores
CREATE POLICY "Users can view all volt scores" 
ON public.volt_scores FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create volt scores" 
ON public.volt_scores FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_substations_updated_at
  BEFORE UPDATE ON public.substations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scraped_properties_updated_at
  BEFORE UPDATE ON public.scraped_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volt_scores_updated_at
  BEFORE UPDATE ON public.volt_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_properties_location ON public.properties (latitude, longitude);
CREATE INDEX idx_properties_created_by ON public.properties (created_by);
CREATE INDEX idx_properties_property_type ON public.properties (property_type);
CREATE INDEX idx_substations_location ON public.substations (latitude, longitude);
CREATE INDEX idx_substations_capacity ON public.substations (capacity_mva);
CREATE INDEX idx_companies_industry ON public.companies (industry);
CREATE INDEX idx_companies_ticker ON public.companies (ticker);
CREATE INDEX idx_alerts_user_id ON public.alerts (user_id);
CREATE INDEX idx_alerts_is_read ON public.alerts (is_read);
CREATE INDEX idx_scraped_properties_source ON public.scraped_properties (source_website);
CREATE INDEX idx_volt_scores_property_id ON public.volt_scores (property_id);
CREATE INDEX idx_profiles_user_id ON public.profiles (user_id);