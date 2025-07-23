import { useState } from 'react';
import { useVoltMarketPortfolio } from './useVoltMarketPortfolio';
import { useToast } from './use-toast';
import { usePortfolioMetrics } from './usePortfolioMetrics';
import { PortfolioItem, PortfolioPerformanceData } from '@/types/portfolio';

export const useEnhancedPortfolio = () => {
  const { portfolios, loading, createPortfolio, addPortfolioItem, getPortfolioItems } = useVoltMarketPortfolio();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<PortfolioItem[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PortfolioPerformanceData[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  const { metrics, rebalancingRecommendations } = usePortfolioMetrics(selectedItems, performanceHistory);

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

  // Moved to usePortfolioMetrics hook

  return {
    portfolios,
    loading,
    selectedItems,
    performanceHistory,
    isLoadingItems,
    createPortfolio,
    addEnhancedPortfolioItem,
    loadPortfolioItems,
    metrics,
    rebalancingRecommendations
  };
};