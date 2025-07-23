-- Create enum for portfolio types
CREATE TYPE public.voltmarket_portfolio_type AS ENUM ('investment', 'development', 'trading', 'research');

-- Create enum for risk tolerance
CREATE TYPE public.voltmarket_risk_tolerance AS ENUM ('conservative', 'moderate', 'aggressive', 'speculative');

-- Create enum for portfolio item types
CREATE TYPE public.voltmarket_portfolio_item_type AS ENUM ('listing', 'investment', 'opportunity', 'research');

-- Create enum for portfolio item status
CREATE TYPE public.voltmarket_portfolio_item_status AS ENUM ('active', 'sold', 'under_contract', 'monitoring');

-- Create portfolios table
CREATE TABLE public.voltmarket_portfolios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    portfolio_type voltmarket_portfolio_type NOT NULL,
    risk_tolerance voltmarket_risk_tolerance NOT NULL,
    target_allocation JSONB DEFAULT '{}'::jsonb,
    total_value NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio items table
CREATE TABLE public.voltmarket_portfolio_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES public.voltmarket_portfolios(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.voltmarket_listings(id) ON DELETE SET NULL,
    item_type voltmarket_portfolio_item_type NOT NULL,
    name TEXT NOT NULL,
    acquisition_price NUMERIC,
    current_value NUMERIC,
    acquisition_date DATE,
    status voltmarket_portfolio_item_status NOT NULL DEFAULT 'active',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.voltmarket_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios
CREATE POLICY "Users can view their own portfolios"
ON public.voltmarket_portfolios
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios"
ON public.voltmarket_portfolios
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
ON public.voltmarket_portfolios
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
ON public.voltmarket_portfolios
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for portfolio items
CREATE POLICY "Users can view their own portfolio items"
ON public.voltmarket_portfolio_items
FOR SELECT
USING (auth.uid() IN (
    SELECT user_id FROM public.voltmarket_portfolios 
    WHERE id = voltmarket_portfolio_items.portfolio_id
));

CREATE POLICY "Users can create items in their own portfolios"
ON public.voltmarket_portfolio_items
FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.voltmarket_portfolios 
    WHERE id = voltmarket_portfolio_items.portfolio_id
));

CREATE POLICY "Users can update items in their own portfolios"
ON public.voltmarket_portfolio_items
FOR UPDATE
USING (auth.uid() IN (
    SELECT user_id FROM public.voltmarket_portfolios 
    WHERE id = voltmarket_portfolio_items.portfolio_id
));

CREATE POLICY "Users can delete items in their own portfolios"
ON public.voltmarket_portfolio_items
FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM public.voltmarket_portfolios 
    WHERE id = voltmarket_portfolio_items.portfolio_id
));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voltmarket_portfolios_updated_at
    BEFORE UPDATE ON public.voltmarket_portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voltmarket_portfolio_items_updated_at
    BEFORE UPDATE ON public.voltmarket_portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_voltmarket_portfolios_user_id ON public.voltmarket_portfolios(user_id);
CREATE INDEX idx_voltmarket_portfolio_items_portfolio_id ON public.voltmarket_portfolio_items(portfolio_id);
CREATE INDEX idx_voltmarket_portfolio_items_listing_id ON public.voltmarket_portfolio_items(listing_id);