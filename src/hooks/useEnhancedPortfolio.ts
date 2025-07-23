import { useState, useEffect } from 'react';
import { useVoltMarketPortfolio } from './useVoltMarketPortfolio';
import { useToast } from './use-toast';

interface EnhancedPortfolioItem {
  id: string;
  name: string;
  item_type: 'listing' | 'investment' | 'opportunity' | 'research';
  acquisition_price?: number;
  current_value?: number;
  acquisition_date?: string;
  status: 'active' | 'sold' | 'under_contract' | 'monitoring';
  notes?: string;
  metadata: {
    location?: string;
    powerCapacity?: number;
    sector?: string;
    riskLevel?: 'low' | 'moderate' | 'high';
    expectedReturn?: number;
    timeHorizon?: string;
    documents?: string[];
    lastUpdated?: string;
  };
  added_at: string;
  updated_at: string;
}

interface PortfolioPerformanceData {
  date: string;
  value: number;
  benchmark: number;
  return: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  diversificationScore: number;
  riskScore: number;
  activeItems: number;
  winRate: number;
  averageHoldingPeriod: number;
}

export const useEnhancedPortfolio = () => {
  const { portfolios, loading, createPortfolio, addPortfolioItem, getPortfolioItems } = useVoltMarketPortfolio();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<EnhancedPortfolioItem[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PortfolioPerformanceData[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const addEnhancedPortfolioItem = async (portfolioId: string, itemData: {
    name: string;
    itemType: 'listing' | 'investment' | 'opportunity' | 'research';
    acquisitionPrice?: number;
    currentValue?: number;
    acquisitionDate?: string;
    notes?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const result = await addPortfolioItem({
        portfolioId,
        listingId: undefined,
        itemType: itemData.itemType,
        name: itemData.name,
        acquisitionPrice: itemData.acquisitionPrice,
        currentValue: itemData.currentValue,
        acquisitionDate: itemData.acquisitionDate,
        notes: itemData.notes,
        metadata: itemData.metadata || {}
      });

      toast({
        title: "Success",
        description: "Portfolio item added successfully"
      });

      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const loadPortfolioItems = async (portfolioId: string) => {
    setIsLoadingItems(true);
    try {
      const items = await getPortfolioItems(portfolioId);
      setSelectedItems(items || []);
      
      // Generate mock performance data
      generatePerformanceHistory(items || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive"
      });
    } finally {
      setIsLoadingItems(false);
    }
  };

  const generatePerformanceHistory = (items: any[]) => {
    const totalValue = items.reduce((sum, item) => sum + (item.current_value || 0), 0);
    
    const history = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      const variance = 0.1; // 10% variance
      const randomFactor = 1 + (Math.random() - 0.5) * variance;
      
      return {
        date: date.toISOString().split('T')[0],
        value: totalValue * randomFactor,
        benchmark: totalValue * 0.95 * randomFactor,
        return: (randomFactor - 1) * 100
      };
    });
    
    setPerformanceHistory(history);
  };

  const calculatePortfolioMetrics = (items: EnhancedPortfolioItem[]): PortfolioMetrics => {
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
  };

  const generateRebalancingRecommendations = (items: EnhancedPortfolioItem[]) => {
    const recommendations = [];
    
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
  };

  return {
    portfolios,
    loading,
    selectedItems,
    performanceHistory,
    isLoadingItems,
    createPortfolio,
    addEnhancedPortfolioItem,
    loadPortfolioItems,
    calculatePortfolioMetrics,
    generateRebalancingRecommendations
  };
};