import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Portfolio, PortfolioItem } from '@/types/portfolio';
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics';

interface PortfolioOverviewProps {
  portfolio: Portfolio;
  items: PortfolioItem[];
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio, items }) => {
  const { metrics } = usePortfolioMetrics(items, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReturnColor = (percentage: number) => {
    if (percentage > 0) return 'text-emerald-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatCurrency(metrics.totalValue)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Value</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 ${getReturnColor(metrics.returnPercentage)}`}>
                {metrics.returnPercentage >= 0 ? 
                  <TrendingUp className="h-5 w-5" /> : 
                  <TrendingDown className="h-5 w-5" />
                }
                {metrics.returnPercentage >= 0 ? '+' : ''}
                {metrics.returnPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Return</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {metrics.activeItems}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Items</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {metrics.diversificationScore}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Diversification Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Details */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-foreground">Portfolio Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Portfolio Type</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {portfolio.portfolio_type}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Tolerance</span>
                <Badge 
                  variant="outline" 
                  className={`border-2 ${
                    portfolio.risk_tolerance === 'low' ? 'border-green-200 text-green-700 bg-green-50' :
                    portfolio.risk_tolerance === 'moderate' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    'border-red-200 text-red-700 bg-red-50'
                  }`}
                >
                  {portfolio.risk_tolerance}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="font-medium text-foreground">{metrics.winRate.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                <span className="font-medium text-foreground">{metrics.sharpeRatio.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volatility</span>
                <span className="font-medium text-foreground">{metrics.volatility.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                <span className="font-medium text-red-600">{metrics.maxDrawdown.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};