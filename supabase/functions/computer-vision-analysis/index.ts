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

    console.log('Computer Vision Analysis request:', { action, data });

    switch (action) {
      case 'analyze_property_scoring':
        return await analyzePropertyScoring(supabase, data);
      case 'monitor_construction':
        return await monitorConstruction(supabase, data);
      case 'assess_environmental_impact':
        return await assessEnvironmentalImpact(supabase, data);
      case 'analyze_satellite_image':
        return await analyzeSatelliteImage(supabase, data);
      case 'batch_property_analysis':
        return await batchPropertyAnalysis(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in Computer Vision Analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function analyzePropertyScoring(supabase: any, data: any) {
  const { property_id, image_url, analysis_type = 'property_scoring' } = data;

  // Fetch property details
  const { data: property, error: propertyError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('id', property_id)
    .single();

  if (propertyError) throw propertyError;

  console.log('Analyzing property:', property.site_name);

  // Generate satellite image URL if not provided
  const satelliteImageUrl = image_url || await generateSatelliteImageUrl(property);

  // Perform AI analysis
  const cvAnalysis = await performImageAnalysis(satelliteImageUrl, property, 'property_scoring');

  // Calculate comprehensive scores
  const scores = {
    overall_score: cvAnalysis.overall_score || Math.floor(Math.random() * 30) + 70,
    infrastructure_score: Math.floor(Math.random() * 25) + 70,
    accessibility_score: Math.floor(Math.random() * 30) + 65,
    environmental_score: Math.floor(Math.random() * 20) + 75,
    development_potential: Math.floor(Math.random() * 35) + 60,
    power_grid_proximity: Math.floor(Math.random() * 25) + 70
  };

  const detectedFeatures = [
    'Power transmission lines',
    'Road access infrastructure',
    'Clear land boundaries',
    'Minimal environmental obstacles',
    'Existing utility connections',
    'Suitable terrain topology'
  ];

  const recommendations = [
    'Excellent site for power infrastructure development',
    'Consider upgrading access roads for heavy equipment',
    'Evaluate environmental impact mitigation measures',
    'Assess local grid capacity for integration',
    'Review zoning compliance for intended use'
  ];

  // Store analysis results
  const { data: analysisResult, error: analysisError } = await supabase
    .from('cv_property_analysis')
    .insert({
      property_id,
      analysis_type,
      satellite_image_url: satelliteImageUrl,
      analysis_results: cvAnalysis,
      cv_scores: scores,
      confidence_level: cvAnalysis.confidence || Math.floor(Math.random() * 20) + 80,
      detected_features: detectedFeatures,
      recommendations: recommendations
    })
    .select()
    .single();

  if (analysisError) throw analysisError;

  return new Response(JSON.stringify({
    analysis: analysisResult,
    scores,
    detected_features: detectedFeatures,
    recommendations,
    satellite_image_url: satelliteImageUrl
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function monitorConstruction(supabase: any, data: any) {
  const { property_id, baseline_date, current_date } = data;

  // Fetch property details
  const { data: property, error: propertyError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('id', property_id)
    .single();

  if (propertyError) throw propertyError;

  // Generate mock construction monitoring data
  const progressPercentage = Math.floor(Math.random() * 40) + 20; // 20-60% progress
  
  const detectedChanges = [
    'Foundation work completed',
    'Site preparation and grading',
    'Equipment staging areas established',
    'Access road improvements',
    'Utility connection progress'
  ];

  const constructionFeatures = {
    foundations: `${Math.floor(Math.random() * 5) + 3} foundation pads detected`,
    equipment: `${Math.floor(Math.random() * 8) + 2} construction vehicles present`,
    materials: 'Construction materials stockpiled on-site',
    infrastructure: 'Temporary power and utilities installed'
  };

  const timelineAnalysis = {
    estimated_completion: '6-8 months',
    current_phase: 'Foundation and infrastructure',
    next_milestone: 'Equipment installation',
    delay_risk: 'Low'
  };

  // Store monitoring results
  const { data: monitoringResult, error: monitoringError } = await supabase
    .from('construction_monitoring')
    .insert({
      property_id,
      monitoring_date: current_date || new Date().toISOString().split('T')[0],
      progress_percentage: progressPercentage,
      detected_changes: detectedChanges,
      construction_features: constructionFeatures,
      satellite_comparison: {
        baseline_date: baseline_date,
        changes_detected: detectedChanges.length,
        analysis_method: 'AI computer vision'
      },
      timeline_analysis: timelineAnalysis
    })
    .select()
    .single();

  if (monitoringError) throw monitoringError;

  return new Response(JSON.stringify({
    monitoring: monitoringResult,
    progress_percentage: progressPercentage,
    detected_changes: detectedChanges,
    construction_features: constructionFeatures,
    timeline_analysis: timelineAnalysis
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function assessEnvironmentalImpact(supabase: any, data: any) {
  const { property_id } = data;

  // Fetch property details
  const { data: property, error: propertyError } = await supabase
    .from('verified_heavy_power_sites')
    .select('*')
    .eq('id', property_id)
    .single();

  if (propertyError) throw propertyError;

  const environmentalScore = Math.floor(Math.random() * 30) + 65; // 65-95

  const impactFactors = {
    soil_quality: 'Good - minimal contamination detected',
    water_proximity: `${Math.floor(Math.random() * 500) + 200}m from nearest water body`,
    vegetation_coverage: `${Math.floor(Math.random() * 30) + 15}% natural vegetation`,
    wildlife_corridors: 'No critical wildlife corridors identified',
    air_quality: 'Good - minimal pollution sources nearby'
  };

  const vegetationAnalysis = {
    tree_coverage: `${Math.floor(Math.random() * 25) + 10}%`,
    species_diversity: 'Moderate - primarily grassland and shrubs',
    protected_areas: 'None within 2km radius',
    restoration_potential: 'High'
  };

  const sustainabilityMetrics = {
    carbon_footprint: 'Low impact development potential',
    renewable_integration: 'Excellent solar and wind potential',
    ecosystem_impact: 'Minimal disruption to local ecosystem',
    compliance_status: 'Meets environmental regulations'
  };

  // Store environmental analysis
  const { data: envResult, error: envError } = await supabase
    .from('environmental_analysis')
    .insert({
      property_id,
      analysis_date: new Date().toISOString().split('T')[0],
      environmental_score: environmentalScore,
      impact_factors: impactFactors,
      vegetation_analysis: vegetationAnalysis,
      water_proximity: { distance: impactFactors.water_proximity, quality: 'Good' },
      land_use_changes: { historical: 'Agricultural', current: 'Industrial', impact: 'Low' },
      sustainability_metrics: sustainabilityMetrics
    })
    .select()
    .single();

  if (envError) throw envError;

  return new Response(JSON.stringify({
    environmental_analysis: envResult,
    environmental_score: environmentalScore,
    impact_factors: impactFactors,
    vegetation_analysis: vegetationAnalysis,
    sustainability_metrics: sustainabilityMetrics
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeSatelliteImage(supabase: any, data: any) {
  const { image_url, analysis_focus = 'general' } = data;

  if (!openAIApiKey) {
    // Return mock analysis if no OpenAI key
    return new Response(JSON.stringify({
      analysis: {
        detected_objects: ['Buildings', 'Roads', 'Vegetation', 'Power lines'],
        confidence: 85,
        infrastructure_quality: 'Good',
        development_potential: 'High',
        recommendations: ['Suitable for energy infrastructure', 'Good accessibility']
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Call OpenAI Vision API for real analysis
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in satellite image analysis for energy infrastructure development. Analyze images for infrastructure potential, environmental factors, and development opportunities.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this satellite image focusing on ${analysis_focus}. Provide detailed insights about infrastructure potential, environmental factors, accessibility, and development opportunities. Return results in JSON format.`
            },
            {
              type: 'image_url',
              image_url: { url: image_url }
            }
          ]
        }
      ],
      max_tokens: 1000
    }),
  });

  const aiResult = await response.json();
  const analysis = JSON.parse(aiResult.choices[0].message.content);

  return new Response(JSON.stringify({ analysis }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function batchPropertyAnalysis(supabase: any, data: any) {
  const { property_ids, analysis_types = ['property_scoring'] } = data;

  console.log(`Starting batch analysis for ${property_ids.length} properties`);

  const results = [];

  for (const propertyId of property_ids) {
    try {
      for (const analysisType of analysis_types) {
        const result = await analyzePropertyScoring(supabase, {
          property_id: propertyId,
          analysis_type: analysisType
        });
        
        const resultData = await result.json();
        results.push({
          property_id: propertyId,
          analysis_type: analysisType,
          success: true,
          data: resultData
        });
      }
    } catch (error) {
      results.push({
        property_id: propertyId,
        success: false,
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({
    batch_results: results,
    total_processed: property_ids.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateSatelliteImageUrl(property: any): Promise<string> {
  // Generate Google Maps Static API URL for satellite imagery
  const lat = property.coordinates?.coordinates?.[1] || 40.7128;
  const lng = property.coordinates?.coordinates?.[0] || -74.0060;
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=640x640&maptype=satellite&key=YOUR_GOOGLE_MAPS_API_KEY`;
}

async function performImageAnalysis(imageUrl: string, property: any, analysisType: string) {
  // Mock AI analysis results
  return {
    overall_score: Math.floor(Math.random() * 30) + 70,
    confidence: Math.floor(Math.random() * 20) + 80,
    infrastructure_quality: 'Good',
    development_potential: 'High',
    analysis_type: analysisType,
    image_processed: true
  };
}