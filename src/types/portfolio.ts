export interface PortfolioItem {
  id: string;
  portfolio_id?: string;
  listing_id?: string;
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
    [key: string]: any; // Allow additional metadata
  };
  added_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    asking_price: number;
    location: string;
    power_capacity_mw: number;
  };
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  portfolio_type: 'investment' | 'development' | 'trading' | 'research' | 'watchlist' | 'active';
  total_value: number;
  total_return: number;
  return_percentage: number;
  target_allocation?: Record<string, number>;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | 'speculative' | 'low' | 'high';
  created_at: string;
  updated_at: string;
  metrics?: {
    totalItems: number;
    totalAcquisitionValue: number;
    totalCurrentValue: number;
    totalReturn: number;
    returnPercentage: number;
    activeItems: number;
  };
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