export interface EnergyRateInputs {
  consumption_kwh: number;
  peak_demand_kw: number;
  utility_provider: string;
  rate_schedule: string;
  location: {
    state: string;
    city: string;
    zip_code: string;
  };
  business_type: string;
  time_of_use_profile: 'residential' | 'commercial' | 'industrial';
}

export interface EnergyMarketData {
  current_price_mwh: number;
  daily_high: number;
  daily_low: number;
  price_timestamp: string;
  market_name: string;
  region: string;
}