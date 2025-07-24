-- Create table for energy price predictions
CREATE TABLE public.energy_price_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_name TEXT NOT NULL,
  prediction_date DATE NOT NULL,
  predicted_price_mwh NUMERIC NOT NULL,
  confidence_score NUMERIC NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  prediction_horizon_days INTEGER NOT NULL,
  model_version TEXT NOT NULL DEFAULT 'v1.0',
  factors_analyzed JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(market_name, prediction_date, prediction_horizon_days)
);

-- Create table for market intelligence and analysis
CREATE TABLE public.market_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_type TEXT NOT NULL,
  market_region TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  insights JSONB NOT NULL DEFAULT '{}',
  risk_factors JSONB NOT NULL DEFAULT '[]',
  opportunities JSONB NOT NULL DEFAULT '[]',
  confidence_level NUMERIC NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create table for investment recommendations
CREATE TABLE public.investment_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID,
  recommendation_type TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell', 'hold', 'watch')),
  priority_score NUMERIC NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
  expected_roi NUMERIC,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  reasoning JSONB NOT NULL,
  market_factors JSONB NOT NULL DEFAULT '{}',
  timing_analysis JSONB NOT NULL DEFAULT '{}',
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS on all new tables
ALTER TABLE public.energy_price_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for energy_price_predictions
CREATE POLICY "Anyone can view energy predictions" 
ON public.energy_price_predictions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create predictions" 
ON public.energy_price_predictions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for market_intelligence
CREATE POLICY "Authenticated users can view market intelligence" 
ON public.market_intelligence 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create market intelligence" 
ON public.market_intelligence 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for investment_recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.investment_recommendations 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own recommendations" 
ON public.investment_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own recommendations" 
ON public.investment_recommendations 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX idx_energy_predictions_market_date ON public.energy_price_predictions(market_name, prediction_date);
CREATE INDEX idx_market_intelligence_region_type ON public.market_intelligence(market_region, analysis_type);
CREATE INDEX idx_investment_recommendations_user ON public.investment_recommendations(created_by);
CREATE INDEX idx_investment_recommendations_property ON public.investment_recommendations(property_id);

-- Create function to clean up old predictions
CREATE OR REPLACE FUNCTION public.cleanup_old_predictions()
RETURNS void AS $$
BEGIN
  -- Delete predictions older than 1 year
  DELETE FROM public.energy_price_predictions 
  WHERE created_at < now() - interval '1 year';
  
  -- Delete expired market intelligence
  DELETE FROM public.market_intelligence 
  WHERE valid_until < now();
  
  -- Delete expired investment recommendations
  DELETE FROM public.investment_recommendations 
  WHERE valid_until < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;