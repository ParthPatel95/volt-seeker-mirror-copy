export interface EnergyRateResults {
  estimated_monthly_cost: number;
  rate_per_kwh: number;
  demand_charge: number;
  fixed_charges: number;
  total_annual_cost: number;
  cost_breakdown: {
    energy_cost: number;
    demand_cost: number;
    transmission_cost: number;
    distribution_cost: number;
    taxes_fees: number;
  };
  comparison_metrics: {
    vs_state_average: number;
    vs_national_average: number;
    potential_savings: number;
  };
}

export interface EnergyRateAnalysis {
  inputs: any;
  results: EnergyRateResults;
  recommendations: string[];
  market_context: any;
}