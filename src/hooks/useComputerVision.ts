import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CVAnalysisResult {
  analysis: any;
  scores: {
    overall_score: number;
    infrastructure_score: number;
    accessibility_score: number;
    environmental_score: number;
    development_potential: number;
    power_grid_proximity: number;
  };
  detected_features: string[];
  recommendations: string[];
  satellite_image_url: string;
}

interface ConstructionMonitoring {
  monitoring: any;
  progress_percentage: number;
  detected_changes: string[];
  construction_features: any;
  timeline_analysis: any;
}

interface EnvironmentalAnalysis {
  environmental_analysis: any;
  environmental_score: number;
  impact_factors: any;
  vegetation_analysis: any;
  sustainability_metrics: any;
}

export function useComputerVision() {
  const [loading, setLoading] = useState(false);
  const [cvAnalysis, setCVAnalysis] = useState<CVAnalysisResult | null>(null);
  const [constructionData, setConstructionData] = useState<ConstructionMonitoring | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalAnalysis | null>(null);
  const { toast } = useToast();

  const analyzePropertyScoring = async (propertyId: string, imageUrl?: string) => {
    setLoading(true);
    try {
      console.log('Starting property scoring analysis for:', propertyId);
      
      const { data, error } = await supabase.functions.invoke('computer-vision-analysis', {
        body: {
          action: 'analyze_property_scoring',
          data: {
            property_id: propertyId,
            image_url: imageUrl,
            analysis_type: 'property_scoring'
          }
        }
      });

      if (error) throw error;

      setCVAnalysis(data);
      toast({
        title: "Property Analysis Complete",
        description: `AI scoring complete with ${data.scores.overall_score}% overall score`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in property scoring:', error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze property",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const monitorConstruction = async (propertyId: string, baselineDate?: string) => {
    setLoading(true);
    try {
      console.log('Starting construction monitoring for:', propertyId);
      
      const { data, error } = await supabase.functions.invoke('computer-vision-analysis', {
        body: {
          action: 'monitor_construction',
          data: {
            property_id: propertyId,
            baseline_date: baselineDate,
            current_date: new Date().toISOString().split('T')[0]
          }
        }
      });

      if (error) throw error;

      setConstructionData(data);
      toast({
        title: "Construction Monitoring Complete",
        description: `Progress: ${data.progress_percentage}% - ${data.detected_changes.length} changes detected`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in construction monitoring:', error);
      toast({
        title: "Monitoring Error",
        description: error.message || "Failed to monitor construction",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assessEnvironmentalImpact = async (propertyId: string) => {
    setLoading(true);
    try {
      console.log('Starting environmental assessment for:', propertyId);
      
      const { data, error } = await supabase.functions.invoke('computer-vision-analysis', {
        body: {
          action: 'assess_environmental_impact',
          data: {
            property_id: propertyId
          }
        }
      });

      if (error) throw error;

      setEnvironmentalData(data);
      toast({
        title: "Environmental Assessment Complete",
        description: `Environmental score: ${data.environmental_score}%`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in environmental assessment:', error);
      toast({
        title: "Assessment Error",
        description: error.message || "Failed to assess environmental impact",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeSatelliteImage = async (imageUrl: string, analysisFocus = 'general') => {
    setLoading(true);
    try {
      console.log('Analyzing satellite image:', imageUrl);
      
      const { data, error } = await supabase.functions.invoke('computer-vision-analysis', {
        body: {
          action: 'analyze_satellite_image',
          data: {
            image_url: imageUrl,
            analysis_focus: analysisFocus
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Image Analysis Complete",
        description: "Satellite image analysis completed successfully",
      });

      return data.analysis;
    } catch (error: any) {
      console.error('Error in satellite image analysis:', error);
      toast({
        title: "Image Analysis Error",
        description: error.message || "Failed to analyze satellite image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const batchAnalyzeProperties = async (propertyIds: string[], analysisTypes: string[] = ['property_scoring']) => {
    setLoading(true);
    try {
      console.log('Starting batch analysis for', propertyIds.length, 'properties');
      
      const { data, error } = await supabase.functions.invoke('computer-vision-analysis', {
        body: {
          action: 'batch_property_analysis',
          data: {
            property_ids: propertyIds,
            analysis_types: analysisTypes
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Batch Analysis Complete",
        description: `Processed ${data.successful}/${data.total_processed} properties successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('Error in batch analysis:', error);
      toast({
        title: "Batch Analysis Error",
        description: error.message || "Failed to complete batch analysis",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStoredAnalysis = async (propertyId: string, analysisType?: string) => {
    try {
      let query = supabase
        .from('cv_property_analysis')
        .select('*')
        .eq('property_id', propertyId);

      if (analysisType) {
        query = query.eq('analysis_type', analysisType);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stored analysis:', error);
      return [];
    }
  };

  const fetchConstructionHistory = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('construction_monitoring')
        .select('*')
        .eq('property_id', propertyId)
        .order('monitoring_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching construction history:', error);
      return [];
    }
  };

  const fetchEnvironmentalHistory = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('environmental_analysis')
        .select('*')
        .eq('property_id', propertyId)
        .order('analysis_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching environmental history:', error);
      return [];
    }
  };

  return {
    loading,
    cvAnalysis,
    constructionData,
    environmentalData,
    analyzePropertyScoring,
    monitorConstruction,
    assessEnvironmentalImpact,
    analyzeSatelliteImage,
    batchAnalyzeProperties,
    fetchStoredAnalysis,
    fetchConstructionHistory,
    fetchEnvironmentalHistory,
    setCVAnalysis,
    setConstructionData,
    setEnvironmentalData
  };
}