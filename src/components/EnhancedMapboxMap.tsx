import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox-fix.css';
import { Button } from '@/components/ui/button';
import { 
  Satellite, 
  Map, 
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyLocation {
  id: string;
  title: string;
  coordinates: [number, number]; // [lng, lat]
  asking_price: number;
  power_capacity_mw?: number;
}

interface MapboxMapProps {
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
  mapStyle?: string;
  powerPlants?: any[];
  substations?: any[];
  properties?: PropertyLocation[];
  selectedProperty?: PropertyLocation | null;
  onPropertySelect?: (property: PropertyLocation) => void;
}

export function EnhancedMapboxMap({ 
  height = 'h-96',
  initialCenter = [-98.5795, 39.8283], // Center of USA
  initialZoom = 4,
  showControls = true,
  mapStyle = 'mapbox://styles/mapbox/satellite-streets-v12',
  powerPlants = [],
  substations = [],
  properties = [],
  selectedProperty = null,
  onPropertySelect
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(mapStyle);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Get Mapbox token
        // Mapbox token fetch
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-config');
        
        if (tokenError) {
          console.error('Error fetching Mapbox token:', tokenError);
          throw new Error(`Failed to fetch map configuration: ${tokenError.message}`);
        }

        if (!data || !data.mapboxToken) {
          console.error('No Mapbox token in response:', data);
          throw new Error('No Mapbox token received from server');
        }

        // Token received successfully

        // Set Mapbox access token
        mapboxgl.accessToken = data.mapboxToken;

        // Add a small delay to ensure container is properly sized
        await new Promise(resolve => setTimeout(resolve, 100));

        // Create map instance
        console.log('Creating Mapbox map with container:', mapContainer.current);
        console.log('Map container dimensions:', {
          width: mapContainer.current!.offsetWidth,
          height: mapContainer.current!.offsetHeight,
          clientWidth: mapContainer.current!.clientWidth,
          clientHeight: mapContainer.current!.clientHeight
        });
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: currentStyle,
          center: initialCenter,
          zoom: initialZoom,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
          preserveDrawingBuffer: true
        });

        // Add navigation controls
        if (showControls) {
          map.current.addControl(
            new mapboxgl.NavigationControl({
              visualizePitch: true,
            }),
            'top-right'
          );
          map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
          map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
        }

        // Handle map load
        map.current.on('load', () => {
          console.log('Mapbox map loaded successfully');
          setIsLoaded(true);
          setIsInitializing(false);
          addMarkers();
        });

        // Handle map errors
        map.current.on('error', (e) => {
          console.error('Mapbox map error:', e);
          setError('Map failed to load');
          setIsInitializing(false);
        });

      } catch (err: any) {
        console.error('Failed to initialize Mapbox map:', err);
        setError(err.message || 'Failed to initialize map');
        setIsInitializing(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current && isLoaded) {
      map.current.setStyle(currentStyle);
      map.current.once('styledata', () => {
        addMarkers();
      });
    }
  }, [currentStyle, isLoaded]);

  // Update markers when data changes
  useEffect(() => {
    if (map.current && isLoaded) {
      addMarkers();
    }
  }, [properties, powerPlants, substations, isLoaded]);

  // Center map on initial center or properties
  useEffect(() => {
    if (map.current && isLoaded) {
      if (properties.length > 0) {
        // Fit map to show all properties
        const bounds = new mapboxgl.LngLatBounds();
        properties.forEach(property => {
          bounds.extend(property.coordinates);
        });
        
        if (properties.length === 1) {
          // Single property - center and zoom
          map.current.setCenter(properties[0].coordinates);
          map.current.setZoom(12);
        } else {
          // Multiple properties - fit bounds
          map.current.fitBounds(bounds, { padding: 50 });
        }
      } else {
        // No properties - use initial center
        map.current.setCenter(initialCenter);
        map.current.setZoom(initialZoom);
      }
    }
  }, [properties, initialCenter, initialZoom, isLoaded]);

  const addMarkers = useCallback(() => {
    if (!map.current || !isLoaded) return;

    // Remove existing markers (simple approach - in production you'd track and update)
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add property markers
    properties.forEach((property) => {
      const isSelected = selectedProperty?.id === property.id;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = isSelected ? '#22c55e' : '#ef4444';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false 
      }).setHTML(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-xs text-gray-600 mb-2">$${(property.asking_price / 1000000).toFixed(1)}M</p>
          ${property.power_capacity_mw ? `<p class="text-xs text-blue-600">${property.power_capacity_mw} MW capacity</p>` : ''}
          <button class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600" onclick="window.selectProperty('${property.id}')">
            Select Property
          </button>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      el.addEventListener('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });
    });

    // Add power plant markers
    powerPlants.forEach((plant, index) => {
      if (plant.coordinates?.lat && plant.coordinates?.lng) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${plant.name}</h3>
            <p class="text-sm text-gray-600">${plant.capacity_mw} MW</p>
            <p class="text-sm text-gray-600">${plant.fuel_type}</p>
          </div>
        `);

        new mapboxgl.Marker({
          color: '#f59e0b',
          scale: 0.8
        })
          .setLngLat([plant.coordinates.lng, plant.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    // Add substation markers
    substations.forEach((substation, index) => {
      if (substation.latitude && substation.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${substation.name}</h3>
            <p class="text-sm text-gray-600">${substation.capacity_mva} MVA</p>
            <p class="text-sm text-gray-600">${substation.voltage_level}</p>
            <p class="text-sm text-gray-600">${substation.city}, ${substation.state}</p>
          </div>
        `);

        new mapboxgl.Marker({
          color: '#3b82f6',
          scale: 0.6
        })
          .setLngLat([substation.longitude, substation.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    console.log('Added markers:', { properties: properties.length, powerPlants: powerPlants.length, substations: substations.length });
  }, [properties, powerPlants, substations, selectedProperty, onPropertySelect, isLoaded]);

  // Global function for popup button clicks
  useEffect(() => {
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertySelect) {
        onPropertySelect(property);
      }
    };
    
    return () => {
      delete (window as any).selectProperty;
    };
  }, [properties, onPropertySelect]);

  const mapStyles = [
    { name: 'Satellite', value: 'mapbox://styles/mapbox/satellite-streets-v12', icon: Satellite },
    { name: 'Streets', value: 'mapbox://styles/mapbox/streets-v12', icon: Map },
    { name: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12', icon: Navigation },
    { name: 'Light', value: 'mapbox://styles/mapbox/light-v11', icon: Layers }
  ];

  const zoomIn = () => map.current?.zoomIn();
  const zoomOut = () => map.current?.zoomOut();

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className={`w-full ${height} rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mapbox-container`}
        style={{ 
          minHeight: '400px',
          position: 'relative'
        }}
      />
      
      {/* Map Style Controls */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-2">
            {mapStyles.map((style) => {
              const IconComponent = style.icon;
              return (
                <Button
                  key={style.value}
                  size="sm"
                  variant={currentStyle === style.value ? "default" : "outline"}
                  onClick={() => setCurrentStyle(style.value)}
                  className="w-full justify-start"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {style.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Zoom Controls */}
      {isLoaded && (
        <div className="absolute top-4 right-4 z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-1">
          <div className="flex flex-col space-y-1">
            <Button size="sm" variant="outline" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      {isLoaded && (
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-semibold mb-2">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Properties</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Selected Property</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Power Plants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Substations</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading/Error Overlay */}
      {(isInitializing || error) && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            {error ? (
              <>
                <Map className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-red-600 mb-2">{error}</p>
                <Button 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="text-xs"
                >
                  Reload Page
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Loading map...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}