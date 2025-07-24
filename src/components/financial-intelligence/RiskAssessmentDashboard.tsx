import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, BarChart3 } from 'lucide-react';
import { useAdvancedFinancialIntelligence } from '@/hooks/useAdvancedFinancialIntelligence';

const ENTITY_TYPES = ['property', 'portfolio', 'company', 'market'];

export function RiskAssessmentDashboard() {
  const [selectedEntityType, setSelectedEntityType] = useState(ENTITY_TYPES[0]);
  const [historicalAssessments, setHistoricalAssessments] = useState<any[]>([]);
  
  const {
    loading,
    riskAssessment,
    assessRisk,
    fetchRiskAssessments
  } = useAdvancedFinancialIntelligence();

  useEffect(() => {
    loadHistoricalData();
  }, [selectedEntityType]);

  const loadHistoricalData = async () => {
    const assessments = await fetchRiskAssessments(selectedEntityType);
    setHistoricalAssessments(assessments);
  };

  const handleRunAssessment = async () => {
    await assessRisk(selectedEntityType);
    await loadHistoricalData();
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskLevelBg = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Risk Assessment</h2>
          <p className="text-muted-foreground">Real-time risk analysis with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRunAssessment} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            <Shield className="w-4 h-4 mr-2" />
            {loading ? 'Assessing...' : 'Run Assessment'}
          </Button>
        </div>
      </div>

      {riskAssessment && (
        <>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Overall Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getRiskLevelColor(riskAssessment.overall_risk_score)}`}>
                  {riskAssessment.overall_risk_score.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getRiskLevel(riskAssessment.overall_risk_score)}
                </div>
                <Progress 
                  value={riskAssessment.overall_risk_score} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Market Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskLevelColor(riskAssessment.risk_factors.market_risk)}`}>
                  {riskAssessment.risk_factors.market_risk}%
                </div>
                <Progress 
                  value={riskAssessment.risk_factors.market_risk} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Financial Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskLevelColor(riskAssessment.risk_factors.financial_risk)}`}>
                  {riskAssessment.risk_factors.financial_risk}%
                </div>
                <Progress 
                  value={riskAssessment.risk_factors.financial_risk} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Operational Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskLevelColor(riskAssessment.risk_factors.operational_risk)}`}>
                  {riskAssessment.risk_factors.operational_risk}%
                </div>
                <Progress 
                  value={riskAssessment.risk_factors.operational_risk} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Risk Analysis & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Risk Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(riskAssessment.risk_factors).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium">{String(value)}%</span>
                        </div>
                        <Progress value={Number(value)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">AI Recommendations</h4>
                  <div className="space-y-2">
                    {riskAssessment.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!riskAssessment && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Ready for Risk Assessment
              </h3>
              <p className="text-muted-foreground mb-4">
                Run comprehensive risk analysis for {selectedEntityType} entities
              </p>
              <Button onClick={handleRunAssessment} disabled={loading}>
                <Shield className="w-4 h-4 mr-2" />
                Start Risk Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}