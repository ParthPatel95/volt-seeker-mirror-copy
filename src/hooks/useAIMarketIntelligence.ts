import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricePrediction {
  horizon_days: number;
  predicted_price: number;
  confidence_score: number;
  factors: string[];
}

interface MarketAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility: 'low' | 'medium' | 'high';
  key_drivers: string[];
}

interface InvestmentRecommendation {
  property_id: string;
  recommendation_type: string;
  action: 'buy' | 'sell' | 'hold' | 'watch';
  priority_score: number;
  expected_roi: number;
  risk_level: 'low' | 'medium' | 'high';
  reasoning: any;
  market_factors: any;
  timing_analysis: any;
}

interface MarketIntelligence {
  insights: string[];
  risk_factors: string[];
  opportunities: string[];
  confidence_level: number;
  key_metrics: {
    market_size_mw: number;
    growth_rate: number;
    investment_volume: number;
  };
}

export function useAIMarketIntelligence() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<{
    predictions: PricePrediction[];
    market_analysis: MarketAnalysis;
  } | null>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const { toast } = useToast();

  const generatePricePredictions = async (marketName: string, horizons?: number[]) => {
    setLoading(true);
    try {
      console.log('Generating price predictions for:', marketName);
      
      const { data, error } = await supabase.functions.invoke('ai-market-intelligence', {
        body: {
          action: 'generate_price_predictions',
          data: {
            market_name: marketName,
            prediction_horizons: horizons || [7, 30, 90]
          }
        }
      });

      if (error) throw error;

      setPredictions(data);
      toast({
        title: "Predictions Generated",
        description: `AI analysis complete for ${marketName} market`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating predictions:', error);
      toast({
        title: "Prediction Error",
        description: error.message || "Failed to generate price predictions",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeMarketIntelligence = async (region: string, analysisType = 'comprehensive') => {
    setLoading(true);
    try {
      console.log('Analyzing market intelligence for:', region);
      
      const { data, error } = await supabase.functions.invoke('ai-market-intelligence', {
        body: {
          action: 'analyze_market_intelligence',
          data: {
            region,
            analysis_type: analysisType
          }
        }
      });

      if (error) throw error;

      setMarketIntelligence(data);
      toast({
        title: "Market Analysis Complete",
        description: `Comprehensive analysis for ${region} region completed`,
      });

      return data;
    } catch (error: any) {
      console.error('Error analyzing market:', error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze market intelligence",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentRecommendations = async (userId: string, criteria?: any) => {
    setLoading(true);
    try {
      console.log('Getting investment recommendations for user:', userId);
      
      const { data, error } = await supabase.functions.invoke('ai-market-intelligence', {
        body: {
          action: 'get_investment_recommendations',
          data: {
            user_id: userId,
            criteria
          }
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations);
      toast({
        title: "Recommendations Ready",
        description: `Found ${data.recommendations.length} investment opportunities`,
      });

      return data.recommendations;
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: error.message || "Failed to get investment recommendations",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzePropertyROI = async (propertyId: string, investmentAmount: number) => {
    setLoading(true);
    try {
      console.log('Analyzing property ROI for:', propertyId);
      
      const { data, error } = await supabase.functions.invoke('ai-market-intelligence', {
        body: {
          action: 'analyze_property_roi',
          data: {
            property_id: propertyId,
            investment_amount: investmentAmount
          }
        }
      });

      if (error) throw error;

      toast({
        title: "ROI Analysis Complete",
        description: "Property investment analysis ready",
      });

      return data;
    } catch (error: any) {
      console.error('Error analyzing ROI:', error);
      toast({
        title: "ROI Analysis Error",
        description: error.message || "Failed to analyze property ROI",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStoredPredictions = async (marketName: string) => {
    try {
      const { data, error } = await supabase
        .from('energy_price_predictions')
        .select('*')
        .eq('market_name', marketName)
        .gte('prediction_date', new Date().toISOString().split('T')[0])
        .order('prediction_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stored predictions:', error);
      return [];
    }
  };

  const fetchMarketIntelligence = async (region: string) => {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('market_region', region)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      return null;
    }
  };

  const fetchUserRecommendations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investment_recommendations')
        .select('*')
        .eq('created_by', userId)
        .gte('valid_until', new Date().toISOString())
        .order('priority_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  };

  return {
    loading,
    predictions,
    marketIntelligence,
    recommendations,
    generatePricePredictions,
    analyzeMarketIntelligence,
    getInvestmentRecommendations,
    analyzePropertyROI,
    fetchStoredPredictions,
    fetchMarketIntelligence,
    fetchUserRecommendations,
    setPredictions,
    setMarketIntelligence,
    setRecommendations
  };
}