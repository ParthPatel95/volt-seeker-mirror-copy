import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { Portfolio, PortfolioItem } from '@/types/portfolio';

export const useVoltMarketPortfolio = () => {
  let auth, profile;
  try {
    auth = useVoltMarketAuth();
    profile = auth?.profile;
  } catch (error) {
    // Handle case where auth context is not available
    auth = null;
    profile = null;
  }
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = async () => {
    if (!profile?.user_id) {
      setLoading(false);
      setPortfolios([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('voltmarket_portfolios')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate metrics for each portfolio
      const portfoliosWithMetrics = await Promise.all(
        (data || []).map(async (portfolio) => {
          const { data: items } = await supabase
            .from('voltmarket_portfolio_items')
            .select('*')
            .eq('portfolio_id', portfolio.id);
          
          const activeItems = items?.filter(item => item.status === 'active') || [];
          const totalAcquisitionValue = activeItems.reduce((sum, item) => sum + (item.acquisition_price || 0), 0);
          const totalCurrentValue = activeItems.reduce((sum, item) => sum + (item.current_value || 0), 0);
          const totalReturn = totalCurrentValue - totalAcquisitionValue;
          const returnPercentage = totalAcquisitionValue > 0 ? (totalReturn / totalAcquisitionValue) * 100 : 0;
          
          return {
            ...portfolio,
            total_value: totalCurrentValue,
            metrics: {
              totalItems: items?.length || 0,
              totalAcquisitionValue,
              totalCurrentValue,
              totalReturn,
              returnPercentage,
              activeItems: activeItems.length
            }
          };
        })
      );
      
      setPortfolios(portfoliosWithMetrics as Portfolio[]);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolioData: {
    name: string;
    description?: string;
    portfolioType: 'investment' | 'development' | 'trading' | 'research';
    targetAllocation?: Record<string, number>;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  }) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const { data, error } = await supabase
        .from('voltmarket_portfolios')
        .insert({
          user_id: profile.user_id,
          name: portfolioData.name,
          description: portfolioData.description,
          portfolio_type: portfolioData.portfolioType,
          risk_tolerance: portfolioData.riskTolerance,
          target_allocation: portfolioData.targetAllocation || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchPortfolios();
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  };

  const addPortfolioItem = async (itemData: {
    portfolioId: string;
    listingId?: string;
    itemType: 'listing' | 'investment' | 'opportunity' | 'research';
    name: string;
    acquisitionPrice?: number;
    currentValue?: number;
    acquisitionDate?: string;
    notes?: string;
    metadata?: Record<string, any>;
  }) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const { data, error } = await supabase
        .from('voltmarket_portfolio_items')
        .insert({
          portfolio_id: itemData.portfolioId,
          listing_id: itemData.listingId,
          item_type: itemData.itemType,
          name: itemData.name,
          acquisition_price: itemData.acquisitionPrice,
          current_value: itemData.currentValue,
          acquisition_date: itemData.acquisitionDate,
          notes: itemData.notes,
          metadata: itemData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchPortfolios();
      return data;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  };

  const getPortfolioItems = async (portfolioId: string): Promise<PortfolioItem[]> => {
    if (!profile) return [];

    try {
      const { data, error } = await supabase
        .from('voltmarket_portfolio_items')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as PortfolioItem[];
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  };

  const analyzePortfolio = async (portfolioId: string) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const items = await getPortfolioItems(portfolioId);
      
      // Basic analytics calculation
      const totalAcquisitionValue = items.reduce((sum, item) => sum + (item.acquisition_price || 0), 0);
      const totalCurrentValue = items.reduce((sum, item) => sum + (item.current_value || 0), 0);
      const totalReturn = totalCurrentValue - totalAcquisitionValue;
      const returnPercentage = totalAcquisitionValue > 0 ? (totalReturn / totalAcquisitionValue) * 100 : 0;
      
      return {
        totalItems: items.length,
        totalAcquisitionValue,
        totalCurrentValue,
        totalReturn,
        returnPercentage,
        activeItems: items.filter(item => item.status === 'active').length
      };
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      throw error;
    }
  };

  const deletePortfolio = async (portfolioId: string) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const { error } = await supabase
        .from('voltmarket_portfolios')
        .delete()
        .eq('id', portfolioId)
        .eq('user_id', profile.user_id); // Extra security check

      if (error) throw error;
      
      await fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const { error } = await supabase
        .from('voltmarket_portfolio_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      await fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  };

  const updatePortfolioItem = async (itemId: string, updates: Partial<{
    name: string;
    acquisition_price: number;
    current_value: number;
    acquisition_date: string;
    status: 'active' | 'sold' | 'under_contract' | 'monitoring';
    notes: string;
    metadata: Record<string, any>;
  }>) => {
    if (!profile) throw new Error('Must be logged in');

    try {
      const { data, error } = await supabase
        .from('voltmarket_portfolio_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchPortfolios();
      return data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (profile) {
      fetchPortfolios();
    }
  }, [profile]);

  return {
    portfolios,
    loading,
    fetchPortfolios,
    createPortfolio,
    addPortfolioItem,
    getPortfolioItems,
    analyzePortfolio,
    deletePortfolio,
    deletePortfolioItem,
    updatePortfolioItem
  };
};