import { useMemo } from 'react';
import { PortfolioItem, PortfolioMetrics, PortfolioPerformanceData, RebalancingRecommendation } from '@/types/portfolio';

export const usePortfolioMetrics = (
  items: PortfolioItem[], 
  performanceHistory: PortfolioPerformanceData[]
) => {
  const metrics = useMemo((): PortfolioMetrics => {
    const activeItems = items.filter(item => item.status === 'active');
    const totalAcquisitionValue = activeItems.reduce((sum, item) => sum + (item.acquisition_price || 0), 0);
    const totalCurrentValue = activeItems.reduce((sum, item) => sum + (item.current_value || 0), 0);
    const totalReturn = totalCurrentValue - totalAcquisitionValue;
    const returnPercentage = totalAcquisitionValue > 0 ? (totalReturn / totalAcquisitionValue) * 100 : 0;

    // Calculate advanced metrics
    const returns = performanceHistory.map(d => d.return);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    const sharpeRatio = volatility > 0 ? avgReturn / volatility : 0;
    const maxDrawdown = Math.min(...returns);

    // Diversification score based on sectors
    const sectors = new Set(activeItems.map(item => item.metadata.sector).filter(Boolean));
    const diversificationScore = Math.min(100, sectors.size * 20);

    // Risk score based on holdings
    const riskLevels = activeItems.map(item => {
      switch (item.metadata.riskLevel) {
        case 'low': return 25;
        case 'moderate': return 50;
        case 'high': return 75;
        default: return 50;
      }
    });
    const riskScore = riskLevels.length > 0 ? riskLevels.reduce((sum, r) => sum + r, 0) / riskLevels.length : 50;

    // Win rate
    const profitableItems = activeItems.filter(item => 
      item.acquisition_price && item.current_value && item.current_value > item.acquisition_price
    );
    const winRate = activeItems.length > 0 ? (profitableItems.length / activeItems.length) * 100 : 0;

    return {
      totalValue: totalCurrentValue,
      totalReturn,
      returnPercentage,
      sharpeRatio,
      volatility,
      maxDrawdown,
      diversificationScore,
      riskScore,
      activeItems: activeItems.length,
      winRate,
      averageHoldingPeriod: 180 // Mock: 6 months average
    };
  }, [items, performanceHistory]);

  const rebalancingRecommendations = useMemo((): RebalancingRecommendation[] => {
    const recommendations: RebalancingRecommendation[] = [];
    
    // Sector concentration analysis
    const sectorAllocation = items.reduce((acc, item) => {
      const sector = item.metadata.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + (item.current_value || 0);
      return acc;
    }, {} as Record<string, number>);

    const totalValue = Object.values(sectorAllocation).reduce((sum, value) => sum + value, 0);
    
    Object.entries(sectorAllocation).forEach(([sector, value]) => {
      const percentage = (value / totalValue) * 100;
      if (percentage > 40) {
        recommendations.push({
          type: 'rebalance',
          priority: 'high',
          message: `Consider reducing ${sector} allocation (currently ${percentage.toFixed(1)}%)`
        });
      }
    });

    // Risk level analysis
    const highRiskItems = items.filter(item => item.metadata.riskLevel === 'high');
    if (highRiskItems.length > items.length * 0.3) {
      recommendations.push({
        type: 'risk',
        priority: 'medium',
        message: 'High concentration in high-risk assets. Consider adding defensive positions.'
      });
    }

    return recommendations;
  }, [items]);

  return { metrics, rebalancingRecommendations };
};