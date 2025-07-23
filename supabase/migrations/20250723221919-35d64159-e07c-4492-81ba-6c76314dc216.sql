-- Create missing tables that the frontend is expecting

-- Create voltmarket_portfolios table (this appears to be queried but doesn't exist)
CREATE TABLE IF NOT EXISTS public.voltmarket_portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_value NUMERIC DEFAULT 0,
  holdings JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.voltmarket_portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own portfolios" 
ON public.voltmarket_portfolios 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix voltmarket_contact_messages table to have proper foreign key relationship with voltmarket_listings
ALTER TABLE public.voltmarket_contact_messages 
ADD CONSTRAINT fk_voltmarket_contact_messages_listing 
FOREIGN KEY (listing_id) REFERENCES public.voltmarket_listings(id) ON DELETE CASCADE;