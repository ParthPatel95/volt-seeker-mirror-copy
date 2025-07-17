
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  property_type: string;
  status: string | null;
  square_footage: number | null;
  lot_size_acres: number | null;
  asking_price: number | null;
  year_built: number | null;
  power_capacity_mw: number | null;
  substation_distance_miles: number | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  listing_url: string | null;
  source: string | null;
  image_urls: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  volt_scores?: Array<{
    overall_score: number | null;
    location_score: number | null;
    infrastructure_score: number | null;
    economic_score: number | null;
    market_score: number | null;
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
