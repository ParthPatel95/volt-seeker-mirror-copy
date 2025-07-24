import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RiskAssessment {
  risk_assessment: any;
  overall_risk_score: number;
  risk_factors: any;
  financial_metrics: any;
  market_conditions: any;
  recommendations: string[];
}

interface PortfolioOptimization {
  optimization: any;
  current_portfolio: any;
  optimized_portfolio: any;
  optimization_metrics: any;
  rebalancing_suggestions: any[];
}

interface MarketSentiment {
  sentiment_analysis: any;
  sentiment_score: number;
  sentiment_indicators: any;
  news_analysis: any;
  market_impact_forecast: any;
}

interface PropertyValuation {
  valuation: any;
  estimated_value: number;
  valuation_range: any;
  valuation_factors: any;
  comparable_properties: any[];
}

interface StressTest {
  stress_test: any;
  resilience_score: number;
  stress_results: any[];
  vulnerability_analysis: any;
  mitigation_strategies: string[];
}

export function useAdvancedFinancialIntelligence() {
  const [loading, setLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [portfolioOptimization, setPortfolioOptimization] = useState<PortfolioOptimization | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [propertyValuation, setPropertyValuation] = useState<PropertyValuation | null>(null);
  const [stressTest, setStressTest] = useState<StressTest | null>(null);
  const { toast } = useToast();

  const assessRisk = async (entityType: string, entityId?: string) => {
    setLoading(true);
    try {
      console.log('Starting risk assessment for:', entityType, entityId);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'assess_risk',
          data: {
            entity_type: entityType,
            entity_id: entityId
          }
        }
      });

      if (error) throw error;

      setRiskAssessment(data);
      toast({
        title: "Risk Assessment Complete",
        description: `Overall risk score: ${data.overall_risk_score.toFixed(1)}%`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in risk assessment:', error);
      toast({
        title: "Risk Assessment Error",
        description: error.message || "Failed to assess risk",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const optimizePortfolio = async (userId: string, optimizationType = 'balanced', currentHoldings = []) => {
    setLoading(true);
    try {
      console.log('Starting portfolio optimization for:', userId);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'optimize_portfolio',
          data: {
            user_id: userId,
            optimization_type: optimizationType,
            current_holdings: currentHoldings
          }
        }
      });

      if (error) throw error;

      setPortfolioOptimization(data);
      toast({
        title: "Portfolio Optimization Complete",
        description: `Expected return improvement: ${data.optimization_metrics.expected_return_improvement.toFixed(1)}%`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in portfolio optimization:', error);
      toast({
        title: "Portfolio Optimization Error",
        description: error.message || "Failed to optimize portfolio",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeMarketSentiment = async (marketSegment = 'energy_infrastructure') => {
    setLoading(true);
    try {
      console.log('Analyzing market sentiment for:', marketSegment);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'analyze_market_sentiment',
          data: {
            market_segment: marketSegment
          }
        }
      });

      if (error) throw error;

      setMarketSentiment(data);
      toast({
        title: "Market Sentiment Analysis Complete",
        description: `Sentiment score: ${data.sentiment_score > 0 ? '+' : ''}${data.sentiment_score.toFixed(1)}`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in market sentiment analysis:', error);
      toast({
        title: "Market Sentiment Error",
        description: error.message || "Failed to analyze market sentiment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const valueProperty = async (propertyId: string, valuationMethod = 'hybrid') => {
    setLoading(true);
    try {
      console.log('Valuing property:', propertyId);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'value_property',
          data: {
            property_id: propertyId,
            valuation_method: valuationMethod
          }
        }
      });

      if (error) throw error;

      setPropertyValuation(data);
      toast({
        title: "Property Valuation Complete",
        description: `Estimated value: $${(data.estimated_value / 1000000).toFixed(1)}M`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in property valuation:', error);
      toast({
        title: "Property Valuation Error",
        description: error.message || "Failed to value property",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const runStressTest = async (entityType: string, entityId: string, testName: string, scenarios = []) => {
    setLoading(true);
    try {
      console.log('Running stress test:', testName);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'run_stress_test',
          data: {
            entity_type: entityType,
            entity_id: entityId,
            test_name: testName,
            scenarios: scenarios
          }
        }
      });

      if (error) throw error;

      setStressTest(data);
      toast({
        title: "Stress Test Complete",
        description: `Resilience score: ${data.resilience_score.toFixed(1)}%`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in stress test:', error);
      toast({
        title: "Stress Test Error",
        description: error.message || "Failed to run stress test",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateFinancialReport = async (userId: string, reportType = 'comprehensive') => {
    setLoading(true);
    try {
      console.log('Generating financial report for:', userId);
      
      const { data, error } = await supabase.functions.invoke('advanced-financial-intelligence', {
        body: {
          action: 'generate_financial_report',
          data: {
            user_id: userId,
            report_type: reportType
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Financial Report Generated",
        description: "Comprehensive financial analysis complete",
      });

      return data;
    } catch (error: any) {
      console.error('Error generating financial report:', error);
      toast({
        title: "Report Generation Error",
        description: error.message || "Failed to generate financial report",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Data fetching functions
  const fetchRiskAssessments = async (entityType?: string, entityId?: string) => {
    try {
      let query = supabase.from('risk_assessments').select('*');
      
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching risk assessments:', error);
      return [];
    }
  };

  const fetchPortfolioOptimizations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_optimizations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching portfolio optimizations:', error);
      return [];
    }
  };

  const fetchMarketSentiment = async (marketSegment?: string) => {
    try {
      let query = supabase.from('market_sentiment').select('*');
      
      if (marketSegment) query = query.eq('market_segment', marketSegment);
      
      const { data, error } = await query
        .order('analysis_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      return [];
    }
  };

  const fetchPropertyValuations = async (propertyId?: string) => {
    try {
      let query = supabase.from('automated_valuations').select('*');
      
      if (propertyId) query = query.eq('property_id', propertyId);
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching property valuations:', error);
      return [];
    }
  };

  const fetchStressTests = async (entityType?: string, entityId?: string) => {
    try {
      let query = supabase.from('stress_tests').select('*');
      
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stress tests:', error);
      return [];
    }
  };

  return {
    loading,
    riskAssessment,
    portfolioOptimization,
    marketSentiment,
    propertyValuation,
    stressTest,
    assessRisk,
    optimizePortfolio,
    analyzeMarketSentiment,
    valueProperty,
    runStressTest,
    generateFinancialReport,
    fetchRiskAssessments,
    fetchPortfolioOptimizations,
    fetchMarketSentiment,
    fetchPropertyValuations,
    fetchStressTests,
    setRiskAssessment,
    setPortfolioOptimization,
    setMarketSentiment,
    setPropertyValuation,
    setStressTest
  };
}