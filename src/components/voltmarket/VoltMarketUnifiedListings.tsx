import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { VoltMarketListingCard } from './VoltMarketListingCard';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  MapPin, 
  Zap, 
  DollarSign,
  Save,
  X,
  Building2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  listing_type: string;
  asking_price: number;
  power_capacity_mw: number;
  created_at: string;
  status: string;
  seller_id: string;
  lease_rate: number;
  power_rate_per_kw: number;
  // Equipment specific fields
  equipment_type?: string;
  brand?: string;
  model?: string;
  equipment_condition?: string;
  quantity?: number;
  manufacture_year?: number;
  shipping_terms?: string;
  // Site specific fields
  square_footage?: number;
  facility_tier?: string;
  cooling_type?: string;
  property_type?: string;
  gridbazaar_profiles: {
    company_name: string;
    is_id_verified: boolean;
    bio?: string;
  } | null;
}

export const VoltMarketUnifiedListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Basic search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Advanced search state
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [capacityRange, setCapacityRange] = useState([0, 1000]);
  const [usePriceFilter, setUsePriceFilter] = useState(false);
  const [useCapacityFilter, setUseCapacityFilter] = useState(false);

  const fetchListings = async () => {
    console.log('Fetching listings...');
    try {
      const { data: listingsData, error } = await supabase
        .from('voltmarket_listings')
        .select(`
          *,
          voltmarket_listing_images(image_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Apply filters
      let filteredData = listingsData || [];
      
      // Apply price filter if enabled
      if (usePriceFilter) {
        filteredData = filteredData.filter(listing => 
          listing.asking_price >= priceRange[0] && listing.asking_price <= priceRange[1]
        );
      }

      // Apply capacity filter if enabled (only for non-equipment listings)
      if (useCapacityFilter) {
        filteredData = filteredData.filter(listing => 
          listing.listing_type === 'equipment' || 
          (listing.power_capacity_mw >= capacityRange[0] && listing.power_capacity_mw <= capacityRange[1])
        );
      }

      // Get seller profiles for all listings
      const sellerIds = [...new Set(filteredData.map(l => l.seller_id))];
      const { data: profilesData } = await supabase
        .from('gridbazaar_profiles')
        .select('user_id, company_name, is_id_verified, bio')
        .in('user_id', sellerIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      console.log('Listings query result:', { data: filteredData, error });

      // Transform the data to match the expected interface
      const transformedData = filteredData.map(listing => ({
        ...listing,
        lease_rate: listing.lease_rate || 0,
        power_rate_per_kw: listing.power_rate_per_kw || 0,
        gridbazaar_profiles: profilesMap.get(listing.seller_id) || null
      }));
      
      setListings(transformedData);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchQuery === '' || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.equipment_type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || listing.listing_type === selectedType;
    
    const matchesLocation = selectedLocation === 'all' || 
      listing.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(listings.map(l => l.location.split(',').pop()?.trim()))).filter(Boolean);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setPriceRange([0, 10000000]);
    setCapacityRange([0, 1000]);
    setUsePriceFilter(false);
    setUseCapacityFilter(false);
  };

  const activeFilterCount = [
    searchQuery !== '',
    selectedType !== 'all',
    selectedLocation !== 'all',
    usePriceFilter,
    useCapacityFilter
  ].filter(Boolean).length;

  useEffect(() => {
    fetchListings();
  }, [usePriceFilter, useCapacityFilter, priceRange, capacityRange]);

  // Set up real-time subscription for listing changes
  useEffect(() => {
    console.log('Setting up real-time subscription for listing changes');
    const channel = supabase
      .channel('voltmarket-listing-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voltmarket_listings'
        },
        (payload) => {
          console.log('Real-time listing change received:', payload);
          
          // Handle different events
          if (payload.eventType === 'DELETE') {
            console.log('Processing DELETE event for listing:', payload.old?.id);
            // Remove deleted listing from state immediately
            setListings(prev => {
              const beforeCount = prev.length;
              const filtered = prev.filter(listing => listing.id !== payload.old?.id);
              console.log(`Browse listings count changed from ${beforeCount} to ${filtered.length}`);
              return filtered;
            });
          } else if (payload.eventType === 'UPDATE') {
            console.log('Processing UPDATE event for listing:', payload.new?.id, 'status:', payload.new?.status);
            // Handle status changes (inactive listings should be filtered out)
            if (payload.new.status !== 'active') {
              setListings(prev => {
                const beforeCount = prev.length;
                const filtered = prev.filter(listing => listing.id !== payload.new.id);
                console.log(`Removed inactive listing, count changed from ${beforeCount} to ${filtered.length}`);
                return filtered;
              });
            } else {
              // Update existing listing
              setListings(prev => prev.map(listing => 
                listing.id === payload.new.id 
                  ? { ...listing, ...payload.new }
                  : listing
              ));
            }
          } else if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            console.log('Processing INSERT event for new active listing:', payload.new?.id);
            // Add new active listings - refetch to get complete data with profiles
            fetchListings();
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to voltmarket_listings changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchListings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
          <p className="text-gray-600 text-sm sm:text-base">Find sites, hosting facilities, and equipment</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Advanced
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Basic Filters - Always Visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="site_sale">Sites for Sale</SelectItem>
                    <SelectItem value="site_lease">Sites for Lease</SelectItem>
                    <SelectItem value="hosting">Hosting</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location!}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Advanced Filters - Collapsible */}
            <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <CollapsibleContent className="space-y-6 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Price Range</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="price-filter"
                          checked={usePriceFilter}
                          onChange={(e) => setUsePriceFilter(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="price-filter" className="text-sm text-gray-600">Enable</Label>
                      </div>
                    </div>
                    <div className={`px-2 py-4 ${!usePriceFilter ? 'opacity-50' : ''}`}>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10000000}
                        step={50000}
                        className="w-full"
                        disabled={!usePriceFilter}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Power Capacity (MW)</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="capacity-filter"
                          checked={useCapacityFilter}
                          onChange={(e) => setUseCapacityFilter(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="capacity-filter" className="text-sm text-gray-600">Enable</Label>
                      </div>
                    </div>
                    <div className={`px-2 py-4 ${!useCapacityFilter ? 'opacity-50' : ''}`}>
                      <Slider
                        value={capacityRange}
                        onValueChange={setCapacityRange}
                        max={1000}
                        step={10}
                        className="w-full"
                        disabled={!useCapacityFilter}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{capacityRange[0]}MW</span>
                        <span>{capacityRange[1]}MW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            <div className="flex gap-2 flex-wrap">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {selectedType.replace('_', ' ')}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType('all')} />
                </Badge>
              )}
              {selectedLocation !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {selectedLocation}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation('all')} />
                </Badge>
              )}
              {usePriceFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setUsePriceFilter(false)} />
                </Badge>
              )}
              {useCapacityFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Capacity: {capacityRange[0]}MW - {capacityRange[1]}MW
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setUseCapacityFilter(false)} />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {filteredListings.length} listings found
            </span>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or check back later for new listings.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <VoltMarketListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};