export interface PortfolioItem {
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

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  portfolio_type: 'investment' | 'research' | 'watchlist' | 'active';
  risk_tolerance: 'low' | 'moderate' | 'high';
  target_allocation?: Record<string, number>;
  total_value: number;
  total_return: number;
  return_percentage: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PortfolioMetrics {
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

export interface PortfolioPerformanceData {
  date: string;
  value: number;
  benchmark: number;
  return: number;
}

export interface RebalancingRecommendation {
  type: 'rebalance' | 'risk' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  message: string;
}