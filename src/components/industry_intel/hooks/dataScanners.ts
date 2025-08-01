import { supabase } from '@/integrations/supabase/client';
import { Opportunity } from './types';
import { parseSatelliteAnalysis, parseCoordinates } from './satelliteAnalysisUtils';

export async function scanIdleProperties(jurisdiction: string): Promise<Opportunity[]> {
  try {
    const { data: idleSites, error } = await supabase
      .from('verified_heavy_power_sites')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (idleSites || []).map(site => {
      const coordinates = parseCoordinates(site.coordinates);
      const aiInsights = parseSatelliteAnalysis((site.metadata as any)?.satellite_analysis || null);

      return {
        id: site.id,
        type: 'idle' as const,
        name: site.name || 'Unknown Facility',
        location: `${site.city || ''}, ${jurisdiction}`,
        address: site.address,
        city: site.city,
        state: site.state,
        zipCode: site.zip_code,
        coordinates,
        estimatedPowerMW: site.estimated_free_mw || 0,
        distressScore: site.idle_score || 0,
        aiInsights,
        sources: ['Satellite Imagery', 'Industrial Database'],
        lastUpdated: site.updated_at || site.created_at,
        status: 'monitoring' as const,
        opportunityDetails: {
          facilityType: site.facility_type,
          industryType: site.industry_type,
          businessStatus: site.business_status,
          confidenceLevel: site.confidence_level,
          powerPotential: site.power_potential,
          validationStatus: site.validation_status,
          satelliteImageUrl: (site.metadata as any)?.satellite_image_url,
          capacityUtilization: (site.metadata as any)?.capacity_utilization,
          transmissionAccess: (site.metadata as any)?.transmission_access,
          substationDistance: (site.metadata as any)?.substation_distance_km,
          yearBuilt: (site.metadata as any)?.year_built,
          lotSize: (site.metadata as any)?.lot_size_acres,
          squareFootage: (site.metadata as any)?.square_footage,
          listingPrice: (site.metadata as any)?.listing_price,
          pricePerSqft: (site.metadata as any)?.price_per_sqft,
          zoning: (site.metadata as any)?.zoning,
          naicsCode: (site.metadata as any)?.naics_code
        }
      };
    });
  } catch (error) {
    console.error('Error scanning idle properties:', error);
    return [];
  }
}

export async function analyzeCorporateDistress(jurisdiction: string): Promise<Opportunity[]> {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .not('financial_data', 'is', null)
      .order('created_at', { ascending: false })
      .limit(25);

    if (error) throw error;

    return (companies || []).map(company => ({
      id: company.id,
      type: 'distressed' as const,
      name: company.name,
      location: jurisdiction,
      coordinates: undefined,
      estimatedPowerMW: (company.financial_data as any)?.power_usage_estimate || 0,
      distressScore: 100 - ((company.financial_data as any)?.financial_health_score || 0),
      aiInsights: `Financial distress signals detected: ${((company.financial_data as any)?.distress_signals || []).join(', ')}`,
      sources: ['SEC Filings', 'Financial Data', 'News Intelligence'],
      lastUpdated: company.updated_at,
      status: 'active' as const,
      opportunityDetails: {
        ticker: company.ticker,
        industry: company.industry,
        sector: company.sector,
        marketCap: company.market_cap,
        financialHealthScore: (company.financial_data as any)?.financial_health_score,
        currentRatio: (company.financial_data as any)?.current_ratio,
        debtToEquity: (company.financial_data as any)?.debt_to_equity,
        revenueGrowth: (company.financial_data as any)?.revenue_growth,
        profitMargin: (company.financial_data as any)?.profit_margin,
        distressSignals: (company.financial_data as any)?.distress_signals,
        locations: (company.financial_data as any)?.locations
      }
    }));
  } catch (error) {
    console.error('Error analyzing corporate distress:', error);
    return [];
  }
}

export async function analyzeSECFilings(jurisdiction: string): Promise<void> {
  // This would integrate with SEC EDGAR API in production
  console.log('Analyzing SEC filings for', jurisdiction);
}

export async function performSatelliteAnalysis(jurisdiction: string): Promise<void> {
  // This would integrate with satellite imagery APIs in production
  console.log('Performing satellite analysis for', jurisdiction);
}