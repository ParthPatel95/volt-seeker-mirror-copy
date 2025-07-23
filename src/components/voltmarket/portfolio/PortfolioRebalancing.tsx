import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, AlertTriangle, TrendingUp, Target, CheckCircle, ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  name: string;
  current_value?: number;
  metadata: {
    sector?: string;
    riskLevel?: string;
    location?: string;
  };
}

interface RebalancingProps {
  items: PortfolioItem[];
  targetAllocation: Record<string, number>;
}

interface RebalancingRecommendation {
  type: 'overweight' | 'underweight' | 'balanced';
  sector: string;
  currentAllocation: number;
  targetAllocation: number;
  difference: number;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export const PortfolioRebalancing: React.FC<RebalancingProps> = ({ items, targetAllocation = {} }) => {
  const analysis = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + (item.current_value || 0), 0);
    
    // Calculate current allocation by sector
    const sectorAllocation = items.reduce((acc, item) => {
      const sector = item.metadata.sector || 'Other';
      acc[sector] = (acc[sector] || 0) + (item.current_value || 0);
      return acc;
    }, {} as Record<string, number>);

    // Convert to percentages
    const currentAllocationPercent = Object.entries(sectorAllocation).reduce((acc, [sector, value]) => {
      acc[sector] = totalValue > 0 ? (value / totalValue) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);

    // Default target allocation if none provided
    const defaultTargets = {
      'Solar': 30,
      'Wind': 25,
      'Storage': 20,
      'Grid': 15,
      'Other': 10
    };

    const targets = Object.keys(targetAllocation).length > 0 ? targetAllocation : defaultTargets;

    // Generate recommendations
    const recommendations: RebalancingRecommendation[] = [];
    
    Object.entries(targets).forEach(([sector, target]) => {
      const current = currentAllocationPercent[sector] || 0;
      const difference = current - target;
      
      let type: 'overweight' | 'underweight' | 'balanced';
      let action: string;
      let priority: 'high' | 'medium' | 'low';

      if (Math.abs(difference) <= 2) {
        type = 'balanced';
        action = 'No action needed';
        priority = 'low';
      } else if (difference > 0) {
        type = 'overweight';
        action = `Reduce by ${difference.toFixed(1)}%`;
        priority = difference > 10 ? 'high' : difference > 5 ? 'medium' : 'low';
      } else {
        type = 'underweight';
        action = `Increase by ${Math.abs(difference).toFixed(1)}%`;
        priority = Math.abs(difference) > 10 ? 'high' : Math.abs(difference) > 5 ? 'medium' : 'low';
      }

      recommendations.push({
        type,
        sector,
        currentAllocation: current,
        targetAllocation: target,
        difference,
        action,
        priority
      });
    });

    // Sort by priority and difference
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return Math.abs(b.difference) - Math.abs(a.difference);
    });

    return {
      currentAllocationPercent,
      targets,
      recommendations,
      totalValue,
      rebalanceScore: calculateRebalanceScore(recommendations)
    };
  }, [items, targetAllocation]);

  const calculateRebalanceScore = (recommendations: RebalancingRecommendation[]) => {
    const totalDeviation = recommendations.reduce((sum, rec) => sum + Math.abs(rec.difference), 0);
    return Math.max(0, 100 - totalDeviation * 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overweight': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'underweight': return <TrendingUp className="h-4 w-4 text-blue-500 rotate-180" />;
      case 'balanced': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Portfolio Rebalancing Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.rebalanceScore}/100</div>
              <div className="text-sm text-muted-foreground">Balance Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.recommendations.filter(r => r.priority === 'high').length}</div>
              <div className="text-sm text-muted-foreground">High Priority Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${analysis.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
            </div>
          </div>

          {analysis.rebalanceScore < 80 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your portfolio allocation deviates significantly from target. Consider rebalancing to optimize risk-adjusted returns.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current vs Target Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analysis.targets).map(([sector, target]) => {
              const current = analysis.currentAllocationPercent[sector] || 0;
              const difference = current - target;
              
              return (
                <div key={sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{sector}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {current.toFixed(1)}% / {target}%
                      </span>
                      {Math.abs(difference) > 2 && (
                        <Badge variant={difference > 0 ? 'destructive' : 'secondary'} className="text-xs">
                          {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={current} className="h-3" />
                    <div 
                      className="absolute top-0 h-3 border-l-2 border-primary"
                      style={{ left: `${target}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rebalancing Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTypeIcon(rec.type)}
                  <div>
                    <div className="font-medium">{rec.sector}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {rec.currentAllocation.toFixed(1)}% → Target: {rec.targetAllocation}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={getPriorityBadgeVariant(rec.priority)} className="capitalize">
                    {rec.priority}
                  </Badge>
                  <span className="text-sm font-medium">{rec.action}</span>
                  {rec.type !== 'balanced' && (
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {analysis.recommendations.filter(r => r.type !== 'balanced').length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="flex gap-2">
                <Button size="sm">Auto-Rebalance</Button>
                <Button variant="outline" size="sm">Generate Trade List</Button>
                <Button variant="outline" size="sm">Schedule Review</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};