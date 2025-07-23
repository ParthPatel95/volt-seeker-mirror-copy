import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, AlertTriangle, Award, Zap } from 'lucide-react';
import { Portfolio, PortfolioItem } from '@/types/portfolio';

interface PortfolioAnalyticsProps {
  portfolio: Portfolio;
  items: PortfolioItem[];
}

const SECTOR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({ portfolio, items }) => {
  const analytics = useMemo(() => {
    if (!portfolio || !items) {
      return {
        totalValue: 0,
        totalReturn: 0,
        returnPercentage: 0,
        activeItems: [],
        sectorData: [],
        riskDistribution: [],
        performanceData: []
      };
    }

    const activeItems = items.filter(item => item.status === 'active');
    const totalAcquisitionValue = activeItems.reduce((sum, item) => sum + (item.acquisition_price || 0), 0);
    const totalCurrentValue = activeItems.reduce((sum, item) => sum + (item.current_value || 0), 0);
    const totalReturn = totalCurrentValue - totalAcquisitionValue;
    const returnPercentage = totalAcquisitionValue > 0 ? (totalReturn / totalAcquisitionValue) * 100 : 0;

    // Sector allocation
    const sectorAllocation = activeItems.reduce((acc, item) => {
      const sector = item.metadata.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + (item.current_value || 0);
      return acc;
    }, {} as Record<string, number>);

    const sectorData = Object.entries(sectorAllocation).map(([sector, value]) => ({
      name: sector,
      value,
      percentage: totalCurrentValue > 0 ? (value / totalCurrentValue) * 100 : 0
    }));

    // Risk distribution
    const riskDistribution = activeItems.reduce((acc, item) => {
      const risk = item.metadata.riskLevel || 'moderate';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Performance metrics
    const averageReturn = activeItems.length > 0 ? 
      activeItems.reduce((sum, item) => {
        const itemReturn = item.acquisition_price && item.current_value ? 
          ((item.current_value - item.acquisition_price) / item.acquisition_price) * 100 : 0;
        return sum + itemReturn;
      }, 0) / activeItems.length : 0;

    // Diversification score (0-100)
    const diversificationScore = Math.min(100, Object.keys(sectorAllocation).length * 20);

    // Generate mock performance data for chart
    const performanceData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      value: totalCurrentValue * (0.9 + Math.random() * 0.2),
      benchmark: totalCurrentValue * (0.92 + Math.random() * 0.16)
    }));

    return {
      totalAcquisitionValue,
      totalCurrentValue,
      totalReturn,
      returnPercentage,
      activeItems: activeItems.length,
      totalActiveItems: activeItems.length,
      sectorData,
      riskDistribution,
      averageReturn,
      diversificationScore,
      performanceData
    };
  }, [items]);

  const getReturnColor = (percentage: number) => {
    if (percentage > 0) return 'text-emerald-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${analytics.totalCurrentValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className={`text-2xl font-bold ${getReturnColor(analytics.returnPercentage)}`}>
                  {analytics.returnPercentage >= 0 ? '+' : ''}
                  {analytics.returnPercentage.toFixed(1)}%
                </p>
              </div>
              {analytics.returnPercentage >= 0 ? 
                <TrendingUp className="h-8 w-8 text-emerald-600" /> : 
                <TrendingDown className="h-8 w-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Items</p>
                <p className="text-2xl font-bold">{analytics.activeItems}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Diversification</p>
                <p className="text-2xl font-bold">{analytics.diversificationScore}/100</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Portfolio"
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#6B7280" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Portfolio Risk Tolerance</span>
              <Badge variant="outline">{portfolio.risk_tolerance}</Badge>
            </div>
            
            <div className="space-y-3">
              {Object.entries(analytics.riskDistribution).map(([risk, count]) => (
                <div key={risk} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize">{risk} Risk Items</span>
                    <Badge variant={getRiskBadgeVariant(risk)}>{count}</Badge>
                  </div>
                  <Progress 
                    value={analytics.totalActiveItems > 0 ? (Number(count) / analytics.totalActiveItems) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Expected Return</span>
                <span className="text-sm font-bold text-primary">
                  {analytics.averageReturn.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};