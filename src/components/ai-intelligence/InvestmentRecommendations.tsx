import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Clock, DollarSign, AlertCircle, Eye, Brain } from 'lucide-react';
import { useAIMarketIntelligence } from '@/hooks/useAIMarketIntelligence';
import { useAuth } from '@/hooks/useAuth';

export function InvestmentRecommendations() {
  const { user } = useAuth();
  const {
    loading,
    recommendations,
    getInvestmentRecommendations,
    fetchUserRecommendations
  } = useAIMarketIntelligence();

  const [storedRecommendations, setStoredRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadStoredRecommendations();
    }
  }, [user?.id]);

  const loadStoredRecommendations = async () => {
    if (user?.id) {
      const stored = await fetchUserRecommendations(user.id);
      setStoredRecommendations(stored);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (user?.id) {
      await getInvestmentRecommendations(user.id);
      await loadStoredRecommendations();
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'bg-green-500 text-white';
      case 'sell':
        return 'bg-red-500 text-white';
      case 'hold':
        return 'bg-blue-500 text-white';
      case 'watch':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500 border-green-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      case 'high':
        return 'text-red-500 border-red-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  const displayRecommendations = recommendations.length > 0 ? recommendations : storedRecommendations;

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Authentication Required
            </h3>
            <p className="text-muted-foreground">
              Please sign in to access personalized investment recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Investment Recommendations</h2>
          <p className="text-muted-foreground">Personalized investment opportunities based on AI analysis</p>
        </div>
        <Button 
          onClick={handleGenerateRecommendations} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          <Brain className="w-4 h-4 mr-2" />
          {loading ? 'Analyzing...' : 'Generate Recommendations'}
        </Button>
      </div>

      {displayRecommendations.length > 0 ? (
        <div className="grid gap-6">
          {displayRecommendations.map((rec, index) => (
            <Card key={rec.property_id || index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Investment Opportunity #{index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getActionColor(rec.action)} variant="outline">
                      {rec.action.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getRiskLevelColor(rec.risk_level)}>
                      {rec.risk_level.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Expected ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      {rec.expected_roi ? `${rec.expected_roi.toFixed(1)}%` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Priority Score</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-primary">
                        {rec.priority_score}/100
                      </div>
                      <Progress value={rec.priority_score} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Timeline</span>
                    </div>
                    <div className="text-lg font-medium text-blue-500">
                      {rec.timing_analysis?.recommended_timeline || 'TBD'}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-0 bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Investment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location Score:</span>
                        <span className="font-medium">{rec.reasoning?.location_score || 'N/A'}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Infrastructure:</span>
                        <span className="font-medium">{rec.reasoning?.infrastructure_score || 'N/A'}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Market Conditions:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.reasoning?.market_conditions || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Timing:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.reasoning?.timing || 'Unknown'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Market Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Energy Demand:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.market_factors?.energy_demand || 'Stable'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Regulatory:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.market_factors?.regulatory_environment || 'Neutral'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Competition:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.market_factors?.competition_level || 'Moderate'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Market Cycle:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.timing_analysis?.market_cycle_position || 'Neutral'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Recommendation Type:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {rec.recommendation_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Recommendations Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Generate personalized investment recommendations based on your profile and market analysis
              </p>
              <Button onClick={handleGenerateRecommendations} disabled={loading}>
                <Brain className="w-4 h-4 mr-2" />
                Generate Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}