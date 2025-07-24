-- Create table for computer vision analysis results
CREATE TABLE public.cv_property_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.verified_heavy_power_sites(id),
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('property_scoring', 'construction_monitoring', 'environmental_assessment', 'competitor_analysis')),
  satellite_image_url TEXT,
  analysis_results JSONB NOT NULL DEFAULT '{}',
  cv_scores JSONB NOT NULL DEFAULT '{}',
  confidence_level NUMERIC NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  detected_features JSONB NOT NULL DEFAULT '[]',
  recommendations JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  analysis_version TEXT NOT NULL DEFAULT 'v1.0'
);

-- Create table for construction progress monitoring
CREATE TABLE public.construction_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.verified_heavy_power_sites(id),
  monitoring_date DATE NOT NULL,
  progress_percentage NUMERIC NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  detected_changes JSONB NOT NULL DEFAULT '[]',
  construction_features JSONB NOT NULL DEFAULT '{}',
  satellite_comparison JSONB NOT NULL DEFAULT '{}',
  timeline_analysis JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create table for environmental impact analysis
CREATE TABLE public.environmental_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.verified_heavy_power_sites(id),
  analysis_date DATE NOT NULL,
  environmental_score NUMERIC NOT NULL CHECK (environmental_score >= 0 AND environmental_score <= 100),
  impact_factors JSONB NOT NULL DEFAULT '{}',
  vegetation_analysis JSONB NOT NULL DEFAULT '{}',
  water_proximity JSONB NOT NULL DEFAULT '{}',
  land_use_changes JSONB NOT NULL DEFAULT '{}',
  sustainability_metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on new tables
ALTER TABLE public.cv_property_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can view CV analysis" 
ON public.cv_property_analysis 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create CV analysis" 
ON public.cv_property_analysis 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view construction monitoring" 
ON public.construction_monitoring 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create construction monitoring" 
ON public.construction_monitoring 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view environmental analysis" 
ON public.environmental_analysis 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create environmental analysis" 
ON public.environmental_analysis 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_cv_analysis_property ON public.cv_property_analysis(property_id);
CREATE INDEX idx_cv_analysis_type ON public.cv_property_analysis(analysis_type);
CREATE INDEX idx_construction_monitoring_property ON public.construction_monitoring(property_id);
CREATE INDEX idx_environmental_analysis_property ON public.environmental_analysis(property_id);