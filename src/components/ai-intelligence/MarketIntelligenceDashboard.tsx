import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Brain, TrendingUp, AlertTriangle, Target, Activity } from 'lucide-react';
import { useAIMarketIntelligence } from '@/hooks/useAIMarketIntelligence';

const US_REGIONS = [
  'Texas',
  'California',
  'New York',
  'Florida',
  'Pennsylvania',
  'Illinois',
  'Ohio',
  'Georgia',
  'North Carolina',
  'Michigan'
];

export function MarketIntelligenceDashboard() {
  const [selectedRegion, setSelectedRegion] = useState(US_REGIONS[0]);
  const {
    loading,
    marketIntelligence,
    analyzeMarketIntelligence,
    fetchMarketIntelligence
  } = useAIMarketIntelligence();

  const [storedIntelligence, setStoredIntelligence] = useState<any>(null);

  useEffect(() => {
    loadStoredIntelligence();
  }, [selectedRegion]);

  const loadStoredIntelligence = async () => {
    const stored = await fetchMarketIntelligence(selectedRegion);
    setStoredIntelligence(stored);
  };

  const handleAnalyzeMarket = async () => {
    await analyzeMarketIntelligence(selectedRegion);
    await loadStoredIntelligence();
  };

  const displayData = marketIntelligence || storedIntelligence;

  const getConfidenceColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Market Intelligence</h2>
          <p className="text-muted-foreground">Comprehensive regional energy market analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {US_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAnalyzeMarket} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            <Brain className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Analyze Market'}
          </Button>
        </div>
      </div>

      {displayData && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart className="w-4 h-4 text-primary" />
                  Market Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {displayData.key_metrics?.market_size_mw?.toLocaleString() || 'N/A'} MW
                </div>
                <p className="text-sm text-muted-foreground">Total capacity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {displayData.key_metrics?.growth_rate || 'N/A'}%
                </div>
                <p className="text-sm text-muted-foreground">Annual growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="w-4 h-4 text-blue-500" />
                  Investment Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  ${displayData.key_metrics?.investment_volume?.toLocaleString() || 'N/A'}M
                </div>
                <p className="text-sm text-muted-foreground">Annual investment</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Insights
                  <Badge 
                    className={`ml-auto ${getConfidenceColor(displayData.confidence_level)} text-white`}
                  >
                    {displayData.confidence_level}% Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayData.insights?.map((insight: string, index: number) => (
                  <div key={`insight-${index}`} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Activity className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Investment Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayData.opportunities?.map((opportunity: string, index: number) => (
                  <div key={`opportunity-${index}`} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{opportunity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {displayData.risk_factors?.map((risk: string, index: number) => (
                  <div key={`alert-${index}`} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{risk}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Risk Level</span>
                  <span className="text-sm text-muted-foreground">
                    {100 - displayData.confidence_level}% Risk Score
                  </span>
                </div>
                <Progress 
                  value={100 - displayData.confidence_level} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {storedIntelligence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Analysis Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analysis Type:</span>
                    <span className="font-medium capitalize">{storedIntelligence.analysis_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="font-medium">
                      {new Date(storedIntelligence.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="font-medium">
                      {new Date(storedIntelligence.valid_until).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!displayData && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Analysis Available
              </h3>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive market intelligence for {selectedRegion}
              </p>
              <Button onClick={handleAnalyzeMarket} disabled={loading}>
                <Brain className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}