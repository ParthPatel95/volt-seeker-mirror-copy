import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Scan, Camera, MapPin, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useComputerVision } from '@/hooks/useComputerVision';
import { supabase } from '@/integrations/supabase/client';

export function PropertyScoringDashboard() {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  
  const {
    loading,
    cvAnalysis,
    analyzePropertyScoring,
    fetchStoredAnalysis
  } = useComputerVision();

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadAnalysisHistory();
    }
  }, [selectedProperty]);

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('verified_heavy_power_sites')
      .select('id, site_name, city, state, power_capacity_mw')
      .limit(50);

    if (!error && data) {
      setProperties(data);
      if (data.length > 0) {
        setSelectedProperty(data[0].id);
      }
    }
  };

  const loadAnalysisHistory = async () => {
    const history = await fetchStoredAnalysis(selectedProperty, 'property_scoring');
    setAnalysisHistory(history);
  };

  const handleAnalyzeProperty = async () => {
    if (selectedProperty) {
      await analyzePropertyScoring(selectedProperty);
      await loadAnalysisHistory();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Property Scoring</h2>
          <p className="text-muted-foreground">Computer vision analysis for property evaluation</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.site_name} - {property.city}, {property.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAnalyzeProperty} 
            disabled={loading || !selectedProperty}
            className="bg-primary hover:bg-primary/90"
          >
            <Scan className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Analyze Property'}
          </Button>
        </div>
      </div>

      {selectedPropertyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {selectedPropertyData.site_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Power Capacity: {selectedPropertyData.power_capacity_mw} MW</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Location: {selectedPropertyData.city}, {selectedPropertyData.state}
              </div>
              <div className="text-sm text-muted-foreground">
                Analysis History: {analysisHistory.length} records
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {cvAnalysis && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(cvAnalysis.scores.overall_score)}`}>
                  {cvAnalysis.scores.overall_score}%
                </div>
                <Progress 
                  value={cvAnalysis.scores.overall_score} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(cvAnalysis.scores.infrastructure_score)}`}>
                  {cvAnalysis.scores.infrastructure_score}%
                </div>
                <Progress 
                  value={cvAnalysis.scores.infrastructure_score} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Development Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(cvAnalysis.scores.development_potential)}`}>
                  {cvAnalysis.scores.development_potential}%
                </div>
                <Progress 
                  value={cvAnalysis.scores.development_potential} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Detected Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvAnalysis.detected_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Scoring Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(cvAnalysis.scores).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <Badge 
                        className={`${getScoreBgColor(value as number)} text-white`}
                      >
                        {value}%
                      </Badge>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">
                      Analysis #{analysis.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleDateString()} - 
                      Confidence: {analysis.confidence_level}%
                    </div>
                  </div>
                  <Badge 
                    className={`${getScoreBgColor(analysis.cv_scores?.overall_score || 0)} text-white`}
                  >
                    {analysis.cv_scores?.overall_score || 0}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!cvAnalysis && !loading && selectedProperty && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Ready for Analysis
              </h3>
              <p className="text-muted-foreground mb-4">
                Start AI-powered property scoring for {selectedPropertyData?.site_name}
              </p>
              <Button onClick={handleAnalyzeProperty} disabled={loading}>
                <Scan className="w-4 h-4 mr-2" />
                Begin Computer Vision Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}