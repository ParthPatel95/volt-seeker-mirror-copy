-- Create voltmarket_portfolios table if it doesn't have the right structure
ALTER TABLE voltmarket_portfolios 
ADD COLUMN IF NOT EXISTS total_return NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS return_percentage NUMERIC DEFAULT 0;

-- Create voltmarket_portfolio_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS voltmarket_portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL,
  listing_id UUID NULL,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('listing', 'investment', 'opportunity', 'research')),
  acquisition_price NUMERIC NULL,
  current_value NUMERIC NULL,
  acquisition_date TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'under_contract', 'monitoring')),
  notes TEXT NULL,
  metadata JSONB DEFAULT '{}',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on portfolios table
ALTER TABLE voltmarket_portfolios ENABLE ROW LEVEL SECURITY;

-- Enable RLS on portfolio_items table  
ALTER TABLE voltmarket_portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios
CREATE POLICY "Users can view their own portfolios" 
ON voltmarket_portfolios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios" 
ON voltmarket_portfolios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
ON voltmarket_portfolios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
ON voltmarket_portfolios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for portfolio items
CREATE POLICY "Users can view portfolio items they own" 
ON voltmarket_portfolio_items 
FOR SELECT 
USING (
  portfolio_id IN (
    SELECT id FROM voltmarket_portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create portfolio items for their portfolios" 
ON voltmarket_portfolio_items 
FOR INSERT 
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM voltmarket_portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update portfolio items they own" 
ON voltmarket_portfolio_items 
FOR UPDATE 
USING (
  portfolio_id IN (
    SELECT id FROM voltmarket_portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete portfolio items they own" 
ON voltmarket_portfolio_items 
FOR DELETE 
USING (
  portfolio_id IN (
    SELECT id FROM voltmarket_portfolios WHERE user_id = auth.uid()
  )
);

-- Create updated_at trigger for portfolio items
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON voltmarket_portfolio_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();