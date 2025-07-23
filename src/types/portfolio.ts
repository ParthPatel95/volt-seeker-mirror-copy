export interface PortfolioItem {
  id: string;
  portfolio_id?: string;
  listing_id?: string;
  name: string;
  item_type: string;
  acquisition_price?: number;
  current_value?: number;
  acquisition_date?: string;
  status: string;
  notes?: string;
  metadata: any;
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
  portfolio_type: string;
  total_value: number;
  total_return: number;
  return_percentage: number;
  target_allocation?: any;
  risk_tolerance: string;
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