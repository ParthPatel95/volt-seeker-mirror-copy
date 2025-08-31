import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedMapboxMap } from '@/components/EnhancedMapboxMap';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyLocation {
  id: string;
  title: string;
  coordinates: [number, number];
  asking_price: number;
  power_capacity_mw?: number;
}

interface VoltMarketSimplePropertyMapProps {
  listingId: string;
  height?: string;
}

export const VoltMarketSimplePropertyMap: React.FC<VoltMarketSimplePropertyMapProps> = ({
  listingId,
  height = 'h-[600px]'
}) => {
  const [property, setProperty] = useState<PropertyLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProperty();
  }, [listingId]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading property for listingId:', listingId);

      const { data, error: fetchError } = await supabase
        .from('voltmarket_listings')
        .select('id, title, asking_price, power_capacity_mw, latitude, longitude, location')
        .eq('id', listingId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching listing:', fetchError);
        throw fetchError;
      }

      console.log('Property data received:', data);

      if (data) {
        if (data.latitude && data.longitude) {
          const propertyData: PropertyLocation = {
            id: data.id,
            title: data.title,
            coordinates: [Number(data.longitude), Number(data.latitude)],
            asking_price: data.asking_price,
            power_capacity_mw: data.power_capacity_mw || 0
          };
          console.log('Setting property data:', propertyData);
          setProperty(propertyData);
        } else {
          throw new Error('Property coordinates not available');
        }
      } else {
        throw new Error('Property not found');
      }
    } catch (err: any) {
      console.error('Error loading property:', err);
      setError(err.message || 'Failed to load property location');
      toast({
        title: "Error",
        description: `Failed to load property location: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={height}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading property location...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !property) {
    return (
      <Card className={height}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {error || 'Property location not available'}
            </p>
            <Button size="sm" variant="outline" onClick={loadProperty}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={height}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5" />
          Property Location
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">{property.title}</p>
          <p>${(property.asking_price / 1000000).toFixed(1)}M</p>
          {property.power_capacity_mw && property.power_capacity_mw > 0 && (
            <p>{property.power_capacity_mw} MW capacity</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px]">
          <EnhancedMapboxMap
            height="h-full"
            initialCenter={property.coordinates}
            initialZoom={14}
            properties={[property]}
            selectedProperty={property}
            powerPlants={[]} // Empty to avoid complexity
            substations={[]} // Empty to avoid complexity
            showControls={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};