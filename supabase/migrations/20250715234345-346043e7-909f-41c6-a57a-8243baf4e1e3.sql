-- ===========================================
-- COMPLETE DATABASE MIGRATION SCRIPT
-- ===========================================

-- 1. CREATE CUSTOM TYPES (ENUMS)
-- ===========================================

CREATE TYPE public.alert_type AS ENUM ('new_property', 'price_change', 'status_change', 'high_voltscore');
CREATE TYPE public.property_status AS ENUM ('available', 'under_contract', 'sold', 'off_market', 'analyzing');
CREATE TYPE public.voltmarket_equipment_condition AS ENUM ('new', 'used', 'refurbished');
CREATE TYPE public.voltmarket_equipment_type AS ENUM ('asic', 'gpu', 'cooling', 'generator', 'ups', 'transformer', 'other');
CREATE TYPE public.voltmarket_nda_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.voltmarket_property_type AS ENUM ('data_center', 'industrial', 'warehouse', 'land', 'office', 'other');
CREATE TYPE public.voltmarket_seller_type AS ENUM ('site_owner', 'broker', 'realtor', 'equipment_vendor');
CREATE TYPE public.voltmarket_user_role AS ENUM ('buyer', 'seller', 'admin');

-- 2. CREATE STORAGE BUCKETS
-- ===========================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('listing-images', 'listing-images', true),
  ('profile-images', 'profile-images', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ADD MISSING VOLTMARKET TABLES
-- ===========================================

-- VoltMarket messages table
CREATE TABLE IF NOT EXISTS public.voltmarket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  conversation_id UUID,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Energy rates table
CREATE TABLE IF NOT EXISTS public.energy_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  rate_type TEXT NOT NULL,
  price_per_mwh NUMERIC NOT NULL,
  node_id TEXT,
  node_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- BTC ROI calculations table
CREATE TABLE IF NOT EXISTS public.btc_roi_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_name TEXT NOT NULL,
  calculation_type TEXT NOT NULL,
  form_data JSONB NOT NULL,
  network_data JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- VoltMarket verification documents table
CREATE TABLE IF NOT EXISTS public.voltmarket_verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verification_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to existing tables if they don't exist
DO $$ 
BEGIN
  -- Add columns to voltmarket_reviews if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voltmarket_reviews' AND column_name = 'reviewed_user_id') THEN
    ALTER TABLE public.voltmarket_reviews ADD COLUMN reviewed_user_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voltmarket_reviews' AND column_name = 'review_text') THEN
    ALTER TABLE public.voltmarket_reviews ADD COLUMN review_text TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voltmarket_reviews' AND column_name = 'transaction_verified') THEN
    ALTER TABLE public.voltmarket_reviews ADD COLUMN transaction_verified BOOLEAN DEFAULT false;
  END IF;

  -- Add columns to voltmarket_saved_searches if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voltmarket_saved_searches' AND column_name = 'search_name') THEN
    ALTER TABLE public.voltmarket_saved_searches ADD COLUMN search_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voltmarket_saved_searches' AND column_name = 'notification_enabled') THEN
    ALTER TABLE public.voltmarket_saved_searches ADD COLUMN notification_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.voltmarket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btc_roi_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_verification_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view messages they're involved in" ON public.voltmarket_messages
FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Anyone can view energy rates" ON public.energy_rates
FOR SELECT USING (true);

CREATE POLICY "Users can manage their BTC calculations" ON public.btc_roi_calculations
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their verification documents" ON public.voltmarket_verification_documents
FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.voltmarket_verification WHERE id = verification_id));

-- Add triggers for updated_at columns
CREATE TRIGGER update_btc_roi_calculations_updated_at
BEFORE UPDATE ON public.btc_roi_calculations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();