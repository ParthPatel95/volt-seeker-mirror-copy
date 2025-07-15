
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  property_type: string;
  status?: string;
  square_footage?: number;
  lot_size_acres?: number;
  asking_price?: number;
  year_built?: number;
  power_capacity_mw?: number;
  substation_distance_miles?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  listing_url?: string;
  image_urls?: string[];
  source?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Legacy properties for compatibility
  discovered_at?: string;
  zoning?: string;
  transmission_access?: boolean;
  volt_scores?: Array<{
    overall_score: number;
    location_score: number;
    infrastructure_score: number;
    economic_score: number;
    market_score: number;
    // Legacy volt score properties for compatibility
    power_score?: number;
    financial_score?: number;
    calculated_at: string;
  }>;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          volt_scores (
            overall_score,
            location_score,
            infrastructure_score,
            economic_score,
            market_score,
            calculated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  };
}
