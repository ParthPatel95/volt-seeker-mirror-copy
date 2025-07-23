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
            total_return: totalReturn,
            return_percentage: returnPercentage,
            metrics: {
              totalItems: items?.length || 0,
              totalAcquisitionValue,
              totalCurrentValue,
              totalReturn,
              returnPercentage,
              activeItems: activeItems.length,
            }
          };
        })
      );

      setPortfolios(portfoliosWithMetrics);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolioData: {
    name: string;
    description?: string;
    portfolio_type: string;
    risk_tolerance: string;
  }) => {
    if (!profile?.user_id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('voltmarket_portfolios')
      .insert({
        ...portfolioData,
        user_id: profile.user_id,
        total_value: 0,
        total_return: 0,
        return_percentage: 0,
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchPortfolios();
    return data;
  };

  const addPortfolioItem = async (itemData: {
    portfolio_id: string;
    name: string;
    item_type: 'listing' | 'investment' | 'opportunity' | 'research';
    acquisition_price?: number;
    current_value?: number;
    acquisition_date?: string;
    status?: 'active' | 'sold' | 'under_contract' | 'monitoring';
    notes?: string;
    metadata?: any;
  }) => {
    if (!profile?.user_id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('voltmarket_portfolio_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;
    
    await fetchPortfolios();
    return data;
  };

  const getPortfolioItems = async (portfolioId: string): Promise<PortfolioItem[]> => {
    if (!profile?.user_id) return [];

    const { data, error } = await supabase
      .from('voltmarket_portfolio_items')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }

    return data || [];
  };

  const deletePortfolio = async (portfolioId: string) => {
    if (!profile?.user_id) throw new Error('User not authenticated');

    // First delete all portfolio items
    await supabase
      .from('voltmarket_portfolio_items')
      .delete()
      .eq('portfolio_id', portfolioId);

    // Then delete the portfolio
    const { error } = await supabase
      .from('voltmarket_portfolios')
      .delete()
      .eq('id', portfolioId)
      .eq('user_id', profile.user_id);

    if (error) throw error;
    
    await fetchPortfolios();
  };

  const deletePortfolioItem = async (itemId: string) => {
    if (!profile?.user_id) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('voltmarket_portfolio_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    
    await fetchPortfolios();
  };

  const updatePortfolioItem = async (itemId: string, updates: Partial<PortfolioItem>) => {
    if (!profile?.user_id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('voltmarket_portfolio_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    
    await fetchPortfolios();
    return data;
  };

  const analyzePortfolio = async (portfolioId: string) => {
    const items = await getPortfolioItems(portfolioId);
    
    const totalValue = items.reduce((sum, item) => sum + (item.current_value || 0), 0);
    const totalCost = items.reduce((sum, item) => sum + (item.acquisition_price || 0), 0);
    const totalReturn = totalValue - totalCost;
    const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalReturn,
      returnPercentage,
      itemCount: items.length,
      activeItems: items.filter(item => item.status === 'active').length,
    };
  };

  useEffect(() => {
    if (profile?.user_id) {
      fetchPortfolios();
    }
  }, [profile?.user_id]);

  return {
    portfolios,
    loading,
    fetchPortfolios,
    createPortfolio,
    addPortfolioItem,
    getPortfolioItems,
    deletePortfolio,
    deletePortfolioItem,
    updatePortfolioItem,
    analyzePortfolio,
  };
};