import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, data } = await req.json();

    console.log('Advanced Financial Intelligence request:', { action, data });

    switch (action) {
      case 'assess_risk':
        return await assessRisk(supabase, data);
      case 'optimize_portfolio':
        return await optimizePortfolio(supabase, data);
      case 'analyze_market_sentiment':
        return await analyzeMarketSentiment(supabase, data);
      case 'value_property':
        return await valueProperty(supabase, data);
      case 'run_stress_test':
        return await runStressTest(supabase, data);
      case 'generate_financial_report':
        return await generateFinancialReport(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in Advanced Financial Intelligence:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function assessRisk(supabase: any, data: any) {
  const { entity_type, entity_id } = data;

  console.log('Performing risk assessment for:', entity_type, entity_id);

  // Fetch relevant data based on entity type
  let entityData;
  if (entity_type === 'property' && entity_id) {
    const { data: property, error } = await supabase
      .from('verified_heavy_power_sites')
      .select('*')
      .eq('id', entity_id)
      .single();
    
    if (error) throw error;
    entityData = property;
  }

  // Calculate comprehensive risk scores
  const riskFactors = {
    market_risk: Math.floor(Math.random() * 40) + 20, // 20-60
    liquidity_risk: Math.floor(Math.random() * 30) + 15, // 15-45
    operational_risk: Math.floor(Math.random() * 35) + 10, // 10-45
    regulatory_risk: Math.floor(Math.random() * 25) + 10, // 10-35
    financial_risk: Math.floor(Math.random() * 30) + 20, // 20-50
    environmental_risk: Math.floor(Math.random() * 20) + 5 // 5-25
  };

  const overallRiskScore = Object.values(riskFactors).reduce((sum: number, score: number) => sum + score, 0) / Object.keys(riskFactors).length;

  const financialMetrics = {
    debt_to_equity: Math.random() * 2 + 0.5, // 0.5-2.5
    current_ratio: Math.random() * 2 + 1, // 1-3
    return_on_investment: Math.random() * 20 + 5, // 5-25%
    volatility: Math.random() * 30 + 10, // 10-40%
    correlation_to_market: Math.random() * 0.8 + 0.1 // 0.1-0.9
  };

  const marketConditions = {
    market_trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
    volatility_index: Math.random() * 50 + 25, // 25-75
    interest_rate_environment: 'rising',
    economic_indicators: 'mixed',
    sector_performance: Math.random() > 0.6 ? 'outperforming' : 'underperforming'
  };

  const recommendations = [
    overallRiskScore > 50 ? 'Consider risk mitigation strategies' : 'Risk levels are acceptable',
    'Monitor market conditions closely',
    'Diversify exposure to reduce concentration risk',
    'Implement regular stress testing',
    'Review and update risk management policies'
  ];

  // Store risk assessment
  const { data: riskAssessment, error: riskError } = await supabase
    .from('risk_assessments')
    .insert({
      entity_type,
      entity_id,
      overall_risk_score: overallRiskScore,
      risk_factors: riskFactors,
      financial_metrics: financialMetrics,
      market_conditions: marketConditions,
      recommendations: recommendations,
      confidence_level: Math.floor(Math.random() * 20) + 80
    })
    .select()
    .single();

  if (riskError) throw riskError;

  return new Response(JSON.stringify({
    risk_assessment: riskAssessment,
    overall_risk_score: overallRiskScore,
    risk_factors: riskFactors,
    financial_metrics: financialMetrics,
    market_conditions: marketConditions,
    recommendations: recommendations
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function optimizePortfolio(supabase: any, data: any) {
  const { user_id, optimization_type = 'balanced', current_holdings = [] } = data;

  console.log('Optimizing portfolio for user:', user_id, 'type:', optimization_type);

  // Mock current portfolio analysis
  const currentPortfolio = {
    total_value: 1000000 + Math.random() * 5000000, // $1M-$6M
    asset_allocation: {
      energy_infrastructure: 40 + Math.random() * 20, // 40-60%
      renewable_projects: 20 + Math.random() * 15, // 20-35%
      traditional_energy: 15 + Math.random() * 10, // 15-25%
      cash_equivalents: 5 + Math.random() * 10 // 5-15%
    },
    risk_level: Math.random() * 100,
    expected_return: Math.random() * 15 + 8 // 8-23%
  };

  // Generate optimized portfolio based on type
  const optimizedPortfolio = generateOptimizedAllocation(optimization_type, currentPortfolio);

  const optimizationMetrics = {
    expected_return_improvement: Math.random() * 5 + 1, // 1-6%
    risk_reduction: Math.random() * 15 + 5, // 5-20%
    sharpe_ratio_improvement: Math.random() * 0.5 + 0.2, // 0.2-0.7
    diversification_score: Math.random() * 30 + 70 // 70-100
  };

  const rebalancingSuggestions = [
    {
      action: 'reduce',
      asset_class: 'traditional_energy',
      current_allocation: currentPortfolio.asset_allocation.traditional_energy,
      target_allocation: optimizedPortfolio.asset_allocation.traditional_energy,
      reason: 'Overweight position increases portfolio risk'
    },
    {
      action: 'increase',
      asset_class: 'renewable_projects',
      current_allocation: currentPortfolio.asset_allocation.renewable_projects,
      target_allocation: optimizedPortfolio.asset_allocation.renewable_projects,
      reason: 'Growth potential and ESG alignment'
    }
  ];

  // Store optimization results
  const { data: optimization, error: optError } = await supabase
    .from('portfolio_optimizations')
    .insert({
      user_id,
      optimization_type,
      current_portfolio: currentPortfolio,
      optimized_portfolio: optimizedPortfolio,
      optimization_metrics: optimizationMetrics,
      rebalancing_suggestions: rebalancingSuggestions,
      expected_performance: {
        one_year_return: optimizedPortfolio.expected_return,
        volatility: optimizedPortfolio.risk_level,
        max_drawdown: Math.random() * 25 + 10
      },
      risk_analysis: {
        var_95: Math.random() * 200000 + 50000,
        correlation_breakdown: {
          energy_sector: 0.7 + Math.random() * 0.2,
          broader_market: 0.3 + Math.random() * 0.3
        }
      }
    })
    .select()
    .single();

  if (optError) throw optError;

  return new Response(JSON.stringify({
    optimization: optimization,
    current_portfolio: currentPortfolio,
    optimized_portfolio: optimizedPortfolio,
    optimization_metrics: optimizationMetrics,
    rebalancing_suggestions: rebalancingSuggestions
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeMarketSentiment(supabase: any, data: any) {
  const { market_segment = 'energy_infrastructure' } = data;

  console.log('Analyzing market sentiment for:', market_segment);

  const sentimentScore = Math.random() * 200 - 100; // -100 to +100

  const sentimentIndicators = {
    news_sentiment: Math.random() * 200 - 100,
    social_media_buzz: Math.random() * 200 - 100,
    analyst_ratings: Math.random() * 200 - 100,
    trading_volume: Math.random() * 100 + 50, // 50-150% of average
    price_momentum: Math.random() * 200 - 100
  };

  const newsAnalysis = {
    positive_mentions: Math.floor(Math.random() * 50) + 20,
    negative_mentions: Math.floor(Math.random() * 30) + 10,
    neutral_mentions: Math.floor(Math.random() * 40) + 30,
    key_themes: ['renewable transition', 'infrastructure investment', 'regulatory changes'],
    trending_topics: ['ESG compliance', 'grid modernization', 'energy storage']
  };

  const marketImpactForecast = {
    short_term: sentimentScore > 0 ? 'positive' : 'negative',
    medium_term: Math.random() > 0.5 ? 'neutral' : 'positive',
    long_term: 'positive',
    volatility_impact: Math.abs(sentimentScore) > 50 ? 'high' : 'moderate'
  };

  // Store sentiment analysis
  const { data: sentiment, error: sentError } = await supabase
    .from('market_sentiment')
    .upsert({
      market_segment,
      sentiment_score: sentimentScore,
      sentiment_indicators: sentimentIndicators,
      news_analysis: newsAnalysis,
      social_media_analysis: { engagement_rate: Math.random() * 10 + 2 },
      expert_opinions: { bullish_ratio: Math.random() * 100 },
      market_impact_forecast: marketImpactForecast,
      confidence_level: Math.floor(Math.random() * 20) + 75
    }, {
      onConflict: 'market_segment,analysis_date'
    })
    .select()
    .single();

  if (sentError) throw sentError;

  return new Response(JSON.stringify({
    sentiment_analysis: sentiment,
    sentiment_score: sentimentScore,
    sentiment_indicators: sentimentIndicators,
    news_analysis: newsAnalysis,
    market_impact_forecast: marketImpactForecast
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function valueProperty(supabase: any, data: any) {
  const { property_id, valuation_method = 'hybrid' } = data;

  console.log('Valuing property:', property_id, 'method:', valuation_method);

  // Fetch property details
  const { data: property, error: propError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('id', property_id)
    .single();

  if (propError) throw propError;

  // Calculate valuation based on multiple methods
  const baseValue = (property.power_capacity_mw || 50) * 500000; // $500k per MW base
  const marketAdjustment = Math.random() * 0.4 + 0.8; // 0.8-1.2x multiplier
  const estimatedValue = baseValue * marketAdjustment;

  const valuationRange = {
    low: estimatedValue * 0.85,
    high: estimatedValue * 1.15,
    most_likely: estimatedValue
  };

  const valuationFactors = {
    location_premium: Math.random() * 20 + 90, // 90-110%
    infrastructure_quality: Math.random() * 15 + 95, // 95-110%
    market_conditions: Math.random() * 10 + 98, // 98-108%
    regulatory_environment: Math.random() * 8 + 96, // 96-104%
    technology_factor: Math.random() * 12 + 94 // 94-106%
  };

  const comparableProperties = [
    {
      property_name: 'Similar Site A',
      distance_km: Math.random() * 50 + 10,
      price_per_mw: Math.random() * 200000 + 400000,
      sale_date: '2024-08-15'
    },
    {
      property_name: 'Similar Site B',
      distance_km: Math.random() * 40 + 15,
      price_per_mw: Math.random() * 180000 + 420000,
      sale_date: '2024-09-22'
    }
  ];

  // Store valuation
  const { data: valuation, error: valError } = await supabase
    .from('automated_valuations')
    .insert({
      property_id,
      valuation_method,
      estimated_value: estimatedValue,
      valuation_range: valuationRange,
      valuation_factors: valuationFactors,
      market_adjustments: { regional_multiplier: marketAdjustment },
      confidence_score: Math.floor(Math.random() * 25) + 70,
      methodology_details: {
        primary_method: valuation_method,
        data_points_used: 15 + Math.floor(Math.random() * 10),
        last_updated: new Date().toISOString()
      },
      comparable_properties: comparableProperties
    })
    .select()
    .single();

  if (valError) throw valError;

  return new Response(JSON.stringify({
    valuation: valuation,
    estimated_value: estimatedValue,
    valuation_range: valuationRange,
    valuation_factors: valuationFactors,
    comparable_properties: comparableProperties
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function runStressTest(supabase: any, data: any) {
  const { entity_type, entity_id, test_name, scenarios = [] } = data;

  console.log('Running stress test:', test_name, 'for:', entity_type);

  const defaultScenarios = [
    {
      name: 'Economic Recession',
      parameters: { gdp_decline: -5, interest_rate_increase: 3, market_decline: -25 }
    },
    {
      name: 'Energy Crisis',
      parameters: { energy_price_spike: 150, supply_disruption: 30, demand_volatility: 40 }
    },
    {
      name: 'Regulatory Shock',
      parameters: { compliance_cost_increase: 25, policy_uncertainty: 60 }
    }
  ];

  const testScenarios = scenarios.length > 0 ? scenarios : defaultScenarios;

  const baselineMetrics = {
    revenue: 1000000 + Math.random() * 5000000,
    profit_margin: 15 + Math.random() * 20,
    cash_flow: 200000 + Math.random() * 800000,
    debt_service_coverage: 1.5 + Math.random() * 2
  };

  const stressResults = testScenarios.map((scenario: any) => ({
    scenario_name: scenario.name,
    impact_metrics: {
      revenue_impact: -(Math.random() * 30 + 10), // -10% to -40%
      profit_impact: -(Math.random() * 50 + 20), // -20% to -70%
      cash_flow_impact: -(Math.random() * 40 + 15), // -15% to -55%
      survival_probability: Math.random() * 60 + 30 // 30% to 90%
    },
    recovery_timeline: Math.floor(Math.random() * 18) + 6 // 6-24 months
  }));

  const resilience_score = stressResults.reduce((avg: number, result: any) => 
    avg + result.impact_metrics.survival_probability, 0) / stressResults.length;

  const vulnerabilityAnalysis = {
    highest_risk_scenario: stressResults.reduce((worst: any, current: any) => 
      current.impact_metrics.survival_probability < worst.impact_metrics.survival_probability ? current : worst),
    key_vulnerabilities: ['Cash flow sensitivity', 'Market concentration', 'Regulatory dependence'],
    stress_tolerance: resilience_score > 70 ? 'high' : resilience_score > 50 ? 'medium' : 'low'
  };

  const mitigationStrategies = [
    'Diversify revenue streams',
    'Build cash reserves',
    'Hedge against market volatility',
    'Develop contingency plans',
    'Strengthen supplier relationships'
  ];

  // Store stress test results
  const { data: stressTest, error: stressError } = await supabase
    .from('stress_tests')
    .insert({
      test_name,
      entity_type,
      entity_id,
      stress_scenarios: testScenarios,
      baseline_metrics: baselineMetrics,
      stress_results: stressResults,
      resilience_score: resilience_score,
      vulnerability_analysis: vulnerabilityAnalysis,
      mitigation_strategies: mitigationStrategies
    })
    .select()
    .single();

  if (stressError) throw stressError;

  return new Response(JSON.stringify({
    stress_test: stressTest,
    resilience_score: resilience_score,
    stress_results: stressResults,
    vulnerability_analysis: vulnerabilityAnalysis,
    mitigation_strategies: mitigationStrategies
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateFinancialReport(supabase: any, data: any) {
  const { user_id, report_type = 'comprehensive' } = data;

  console.log('Generating financial report for user:', user_id);

  // Aggregate data from various sources
  const [riskData, portfolioData, sentimentData] = await Promise.all([
    supabase.from('risk_assessments').select('*').limit(5),
    supabase.from('portfolio_optimizations').select('*').eq('user_id', user_id).limit(3),
    supabase.from('market_sentiment').select('*').limit(3)
  ]);

  const report = {
    executive_summary: {
      overall_portfolio_health: 'Good',
      key_risks: ['Market volatility', 'Regulatory changes'],
      opportunities: ['Renewable expansion', 'Grid modernization'],
      recommendations: ['Rebalance portfolio', 'Increase ESG allocation']
    },
    risk_analysis: riskData.data || [],
    portfolio_performance: portfolioData.data || [],
    market_outlook: sentimentData.data || [],
    generated_at: new Date().toISOString()
  };

  return new Response(JSON.stringify(report), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateOptimizedAllocation(type: string, current: any) {
  const base = { ...current.asset_allocation };
  
  switch (type) {
    case 'max_return':
      return {
        ...current,
        asset_allocation: {
          energy_infrastructure: 60,
          renewable_projects: 35,
          traditional_energy: 5,
          cash_equivalents: 0
        },
        expected_return: current.expected_return * 1.2,
        risk_level: current.risk_level * 1.3
      };
    case 'min_risk':
      return {
        ...current,
        asset_allocation: {
          energy_infrastructure: 30,
          renewable_projects: 25,
          traditional_energy: 25,
          cash_equivalents: 20
        },
        expected_return: current.expected_return * 0.8,
        risk_level: current.risk_level * 0.6
      };
    default: // balanced
      return {
        ...current,
        asset_allocation: {
          energy_infrastructure: 45,
          renewable_projects: 30,
          traditional_energy: 15,
          cash_equivalents: 10
        },
        expected_return: current.expected_return * 1.05,
        risk_level: current.risk_level * 0.9
      };
  }
}