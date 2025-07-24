-- Create table for real-time risk assessments
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('property', 'portfolio', 'company', 'market')),
  entity_id UUID,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_risk_score NUMERIC NOT NULL CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  risk_factors JSONB NOT NULL DEFAULT '{}',
  financial_metrics JSONB NOT NULL DEFAULT '{}',
  market_conditions JSONB NOT NULL DEFAULT '{}',
  stress_test_results JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_level NUMERIC NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days')
);

-- Create table for portfolio optimization
CREATE TABLE public.portfolio_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  optimization_type TEXT NOT NULL CHECK (optimization_type IN ('risk_adjusted', 'max_return', 'min_risk', 'balanced')),
  current_portfolio JSONB NOT NULL DEFAULT '{}',
  optimized_portfolio JSONB NOT NULL DEFAULT '{}',
  optimization_metrics JSONB NOT NULL DEFAULT '{}',
  rebalancing_suggestions JSONB NOT NULL DEFAULT '[]',
  expected_performance JSONB NOT NULL DEFAULT '{}',
  risk_analysis JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Create table for market sentiment analysis
CREATE TABLE public.market_sentiment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_segment TEXT NOT NULL,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sentiment_score NUMERIC NOT NULL CHECK (sentiment_score >= -100 AND sentiment_score <= 100),
  sentiment_indicators JSONB NOT NULL DEFAULT '{}',
  news_analysis JSONB NOT NULL DEFAULT '{}',
  social_media_analysis JSONB NOT NULL DEFAULT '{}',
  expert_opinions JSONB NOT NULL DEFAULT '{}',
  market_impact_forecast JSONB NOT NULL DEFAULT '{}',
  confidence_level NUMERIC NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(market_segment, analysis_date)
);

-- Create table for automated property valuations
CREATE TABLE public.automated_valuations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.verified_heavy_power_sites(id),
  valuation_method TEXT NOT NULL CHECK (valuation_method IN ('dcf', 'comparable_sales', 'income_approach', 'ml_model', 'hybrid')),
  estimated_value NUMERIC NOT NULL,
  valuation_range JSONB NOT NULL DEFAULT '{}',
  valuation_factors JSONB NOT NULL DEFAULT '{}',
  market_adjustments JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  methodology_details JSONB NOT NULL DEFAULT '{}',
  comparable_properties JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '90 days')
);

-- Create table for financial stress testing
CREATE TABLE public.stress_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('property', 'portfolio', 'company')),
  entity_id UUID,
  stress_scenarios JSONB NOT NULL DEFAULT '[]',
  baseline_metrics JSONB NOT NULL DEFAULT '{}',
  stress_results JSONB NOT NULL DEFAULT '{}',
  resilience_score NUMERIC NOT NULL CHECK (resilience_score >= 0 AND resilience_score <= 100),
  vulnerability_analysis JSONB NOT NULL DEFAULT '{}',
  mitigation_strategies JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all new tables
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_sentiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_tests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for risk_assessments
CREATE POLICY "Authenticated users can view risk assessments" 
ON public.risk_assessments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create risk assessments" 
ON public.risk_assessments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for portfolio_optimizations
CREATE POLICY "Users can view their own portfolio optimizations" 
ON public.portfolio_optimizations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolio optimizations" 
ON public.portfolio_optimizations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for market_sentiment
CREATE POLICY "Anyone can view market sentiment" 
ON public.market_sentiment 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create market sentiment" 
ON public.market_sentiment 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for automated_valuations
CREATE POLICY "Authenticated users can view automated valuations" 
ON public.automated_valuations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create automated valuations" 
ON public.automated_valuations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for stress_tests
CREATE POLICY "Users can view their own stress tests" 
ON public.stress_tests 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own stress tests" 
ON public.stress_tests 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Create indexes for performance
CREATE INDEX idx_risk_assessments_entity ON public.risk_assessments(entity_type, entity_id);
CREATE INDEX idx_risk_assessments_date ON public.risk_assessments(assessment_date);
CREATE INDEX idx_portfolio_optimizations_user ON public.portfolio_optimizations(user_id);
CREATE INDEX idx_market_sentiment_segment_date ON public.market_sentiment(market_segment, analysis_date);
CREATE INDEX idx_automated_valuations_property ON public.automated_valuations(property_id);
CREATE INDEX idx_stress_tests_entity ON public.stress_tests(entity_type, entity_id);