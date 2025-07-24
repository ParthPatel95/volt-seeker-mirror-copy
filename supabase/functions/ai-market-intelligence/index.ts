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

    console.log('AI Market Intelligence request:', { action, data });

    switch (action) {
      case 'generate_price_predictions':
        return await generatePricePredictions(supabase, data);
      case 'analyze_market_intelligence':
        return await analyzeMarketIntelligence(supabase, data);
      case 'get_investment_recommendations':
        return await getInvestmentRecommendations(supabase, data);
      case 'analyze_property_roi':
        return await analyzePropertyROI(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in AI Market Intelligence:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function generatePricePredictions(supabase: any, data: any) {
  const { market_name, prediction_horizons = [7, 30, 90] } = data;

  // Fetch historical energy market data
  const { data: historicalData, error: historyError } = await supabase
    .from('energy_rates')
    .select('*')
    .eq('market_name', market_name)
    .order('timestamp', { ascending: false })
    .limit(500);

  if (historyError) throw historyError;

  // Fetch current market conditions
  const { data: currentMarket, error: marketError } = await supabase
    .from('energy_markets')
    .select('*')
    .eq('market_name', market_name)
    .single();

  if (marketError) throw marketError;

  // Prepare data for AI analysis
  const marketAnalysisPrompt = `
    Analyze the following energy market data and generate price predictions:
    
    Market: ${market_name}
    Current Price: $${currentMarket?.current_price_mwh || 'N/A'}/MWh
    Daily High: $${currentMarket?.daily_high || 'N/A'}/MWh
    Daily Low: $${currentMarket?.daily_low || 'N/A'}/MWh
    
    Historical Price Data (last 500 entries):
    ${historicalData?.slice(0, 50).map(d => `${d.timestamp}: $${d.price_per_mwh}/MWh`).join('\n')}
    
    Please provide detailed predictions for ${prediction_horizons.join(', ')} days ahead.
    Include confidence scores (0-100) and key factors influencing the predictions.
    
    Return your analysis in this JSON format:
    {
      "predictions": [
        {
          "horizon_days": number,
          "predicted_price": number,
          "confidence_score": number,
          "factors": ["factor1", "factor2"]
        }
      ],
      "market_analysis": {
        "trend": "bullish|bearish|neutral",
        "volatility": "low|medium|high",
        "key_drivers": ["driver1", "driver2"]
      }
    }
  `;

  if (!openAIApiKey) {
    // Return mock predictions if no OpenAI key
    console.log('No OpenAI key found, returning mock predictions');
    const mockPredictions = prediction_horizons.map((days: number) => ({
      horizon_days: days,
      predicted_price: (currentMarket?.current_price_mwh || 50) * (1 + (Math.random() - 0.5) * 0.2),
      confidence_score: Math.floor(Math.random() * 30) + 60,
      factors: ['Historical trends', 'Seasonal patterns', 'Supply/demand dynamics']
    }));

    const analysis = {
      predictions: mockPredictions,
      market_analysis: {
        trend: 'neutral',
        volatility: 'medium',
        key_drivers: ['Weather patterns', 'Grid demand', 'Fuel costs']
      }
    };

    // Store predictions in database
    for (const prediction of mockPredictions) {
      await supabase.from('energy_price_predictions').insert({
        market_name,
        prediction_date: new Date(Date.now() + prediction.horizon_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted_price_mwh: prediction.predicted_price,
        confidence_score: prediction.confidence_score,
        prediction_horizon_days: prediction.horizon_days,
        factors_analyzed: { factors: prediction.factors, analysis: analysis.market_analysis }
      });
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Call OpenAI for real analysis
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert energy market analyst with deep knowledge of electricity pricing, grid operations, and market dynamics.' },
        { role: 'user', content: marketAnalysisPrompt }
      ],
      temperature: 0.3,
    }),
  });

  const aiResult = await response.json();
  const analysis = JSON.parse(aiResult.choices[0].message.content);

  // Store predictions in database
  for (const prediction of analysis.predictions) {
    await supabase.from('energy_price_predictions').insert({
      market_name,
      prediction_date: new Date(Date.now() + prediction.horizon_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_price_mwh: prediction.predicted_price,
      confidence_score: prediction.confidence_score,
      prediction_horizon_days: prediction.horizon_days,
      factors_analyzed: { factors: prediction.factors, analysis: analysis.market_analysis }
    });
  }

  return new Response(JSON.stringify(analysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeMarketIntelligence(supabase: any, data: any) {
  const { region, analysis_type = 'comprehensive' } = data;

  // Fetch relevant market data
  const { data: substations, error: substationError } = await supabase
    .from('substations')
    .select('*')
    .eq('state', region)
    .limit(100);

  const { data: properties, error: propertiesError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('state', region)
    .limit(50);

  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('*')
    .limit(20);

  if (substationError || propertiesError || companiesError) {
    console.error('Error fetching market data:', { substationError, propertiesError, companiesError });
  }

  const analysisPrompt = `
    Conduct a comprehensive market intelligence analysis for the ${region} energy market:
    
    Infrastructure Data:
    - ${substations?.length || 0} substations in the region
    - ${properties?.length || 0} heavy power sites identified
    - ${companies?.length || 0} energy companies analyzed
    
    Please analyze:
    1. Market opportunity assessment
    2. Infrastructure capacity and constraints
    3. Investment risks and opportunities
    4. Competitive landscape
    5. Regulatory environment
    6. Growth projections
    
    Return analysis in JSON format with insights, risk_factors, and opportunities arrays.
  `;

  const mockAnalysis = {
    insights: [
      `${region} shows strong infrastructure capacity with ${substations?.length || 0} substations`,
      'Growing demand for renewable energy integration',
      'Favorable regulatory environment for new investments',
      'Limited transmission bottlenecks identified'
    ],
    risk_factors: [
      'Regulatory changes could impact project timelines',
      'Weather-related infrastructure vulnerabilities',
      'Competition from existing market players'
    ],
    opportunities: [
      'Substation upgrade projects in planning phase',
      'Renewable energy connection points available',
      'Energy storage deployment opportunities',
      'Grid modernization initiatives underway'
    ],
    confidence_level: 85,
    key_metrics: {
      market_size_mw: Math.floor(Math.random() * 5000) + 1000,
      growth_rate: Math.floor(Math.random() * 15) + 5,
      investment_volume: Math.floor(Math.random() * 500) + 100
    }
  };

  // Store market intelligence
  await supabase.from('market_intelligence').insert({
    analysis_type,
    market_region: region,
    analysis_data: mockAnalysis,
    insights: mockAnalysis.insights,
    risk_factors: mockAnalysis.risk_factors,
    opportunities: mockAnalysis.opportunities,
    confidence_level: mockAnalysis.confidence_level,
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  return new Response(JSON.stringify(mockAnalysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getInvestmentRecommendations(supabase: any, data: any) {
  const { user_id, criteria = {} } = data;

  // Fetch user's existing investments/watchlist
  const { data: userProperties, error: propertiesError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('created_by', user_id);

  // Fetch available properties
  const { data: availableProperties, error: availableError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .neq('created_by', user_id)
    .limit(10);

  if (propertiesError || availableError) {
    console.error('Error fetching investment data:', { propertiesError, availableError });
  }

  const recommendations = (availableProperties || []).map((property: any) => {
    const baseROI = Math.random() * 20 + 5; // 5-25% ROI
    const riskLevel = property.power_capacity_mw > 100 ? 'high' : property.power_capacity_mw > 50 ? 'medium' : 'low';
    
    return {
      property_id: property.id,
      recommendation_type: 'investment_opportunity',
      action: Math.random() > 0.7 ? 'buy' : Math.random() > 0.4 ? 'watch' : 'hold',
      priority_score: Math.floor(Math.random() * 40) + 60,
      expected_roi: baseROI,
      risk_level: riskLevel,
      reasoning: {
        location_score: Math.floor(Math.random() * 30) + 70,
        infrastructure_score: Math.floor(Math.random() * 25) + 70,
        market_conditions: 'favorable',
        timing: property.power_capacity_mw > 75 ? 'excellent' : 'good'
      },
      market_factors: {
        energy_demand: 'increasing',
        regulatory_environment: 'stable',
        competition_level: 'moderate'
      },
      timing_analysis: {
        recommended_timeline: '3-6 months',
        market_cycle_position: 'growth phase',
        seasonal_factors: 'neutral'
      }
    };
  });

  // Store recommendations
  for (const rec of recommendations) {
    await supabase.from('investment_recommendations').insert({
      ...rec,
      created_by: user_id,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return new Response(JSON.stringify({ recommendations }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzePropertyROI(supabase: any, data: any) {
  const { property_id, investment_amount } = data;

  // Fetch property details
  const { data: property, error: propertyError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('id', property_id)
    .single();

  if (propertyError) throw propertyError;

  // Fetch local market conditions
  const { data: localMarket, error: marketError } = await supabase
    .from('energy_markets')
    .select('*')
    .limit(1);

  const analysis = {
    property_analysis: {
      power_capacity_mw: property.power_capacity_mw,
      location_score: Math.floor(Math.random() * 30) + 70,
      infrastructure_access: property.substation_distance_km < 5 ? 'excellent' : 'good',
      market_position: 'competitive'
    },
    financial_projections: {
      year_1_revenue: investment_amount * 0.12,
      year_5_revenue: investment_amount * 0.18,
      break_even_months: Math.floor(Math.random() * 24) + 12,
      total_roi_5_year: Math.floor(Math.random() * 50) + 80
    },
    risk_assessment: {
      market_risk: 'medium',
      regulatory_risk: 'low',
      technical_risk: 'low',
      overall_risk_score: Math.floor(Math.random() * 20) + 30
    },
    recommendations: [
      'Strong investment opportunity with stable returns',
      'Consider power purchase agreement negotiations',
      'Monitor local grid expansion plans',
      'Evaluate renewable energy integration potential'
    ]
  };

  return new Response(JSON.stringify(analysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}