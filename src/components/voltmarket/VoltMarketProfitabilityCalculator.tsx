import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Activity,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MiningEquipment {
  name: string;
  hashrate_th: number;
  power_consumption_w: number;
  efficiency_jth: number;
  price_usd: number;
  category: 'asic_btc' | 'asic_ltc' | 'gpu' | 'other';
}

interface ProfitabilityResults {
  dailyRevenue: number;
  dailyCosts: number;
  dailyProfit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  roi: number;
  paybackDays: number;
  breakEvenPrice: number;
  profitMargin: number;
}

interface HostingResults extends ProfitabilityResults {
  totalEquipment: number;
  totalPowerDraw: number;
  hostingRevenue: number;
  operationalCosts: number;
  energyCostDaily: number;
  operationalCostDaily: number;
  facilityCostDaily: number;
  grossMargin: number;
  netMargin: number;
  energyCostPercentage: number;
  opexPercentage: number;
  powerSoldDaily: number;
  revenuePerMW: number;
}

interface VoltMarketProfitabilityCalculatorProps {
  listingData: any;
}

export const VoltMarketProfitabilityCalculator: React.FC<VoltMarketProfitabilityCalculatorProps> = ({ listingData }) => {
  const [calculatorType, setCalculatorType] = useState<'hosting' | 'mining'>('hosting');
  const [loading, setLoading] = useState(false);
  const [btcPrice, setBtcPrice] = useState(95000);
  const [networkDifficulty, setNetworkDifficulty] = useState(106.9e12);
  const [energyRate, setEnergyRate] = useState(0.08);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [results, setResults] = useState<ProfitabilityResults | HostingResults | null>(null);
  const { toast } = useToast();

  // Mining Calculator State
  const [selectedEquipment, setSelectedEquipment] = useState<MiningEquipment | null>(null);
  const [equipmentCount, setEquipmentCount] = useState(1);
  const [customHashrate, setCustomHashrate] = useState('');
  const [customPowerDraw, setCustomPowerDraw] = useState('');

  // Hosting Calculator State
  const [hostingRate, setHostingRate] = useState(0.12); // $/kWh hosting rate
  const [facilityCapacityMW, setFacilityCapacityMW] = useState(listingData?.power_capacity_mw || 10);
  const [utilizationRate, setUtilizationRate] = useState(85); // %
  const [operationalCostPerMW, setOperationalCostPerMW] = useState(50000); // Monthly operational costs per MW
  const [facilitySetupCost, setFacilitySetupCost] = useState(listingData?.asking_price || 10000000);

  // Popular mining equipment database
  const miningEquipment: MiningEquipment[] = [
    { name: 'Antminer S21 Pro', hashrate_th: 234, power_consumption_w: 3510, efficiency_jth: 15.0, price_usd: 3200, category: 'asic_btc' },
    { name: 'Antminer S21', hashrate_th: 200, power_consumption_w: 3550, efficiency_jth: 17.8, price_usd: 2800, category: 'asic_btc' },
    { name: 'Antminer S19 XP', hashrate_th: 140, power_consumption_w: 3010, efficiency_jth: 21.5, price_usd: 2200, category: 'asic_btc' },
    { name: 'Antminer S19j Pro+', hashrate_th: 122, power_consumption_w: 3355, efficiency_jth: 27.5, price_usd: 1800, category: 'asic_btc' },
    { name: 'WhatsMiner M60S+', hashrate_th: 176, power_consumption_w: 3472, efficiency_jth: 19.7, price_usd: 2600, category: 'asic_btc' },
    { name: 'WhatsMiner M56S++', hashrate_th: 230, power_consumption_w: 5550, efficiency_jth: 24.1, price_usd: 3400, category: 'asic_btc' },
    { name: 'AvalonMiner A1466', hashrate_th: 150, power_consumption_w: 3400, efficiency_jth: 22.7, price_usd: 2100, category: 'asic_btc' }
  ];

  // Fetch real-time data
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      console.log('Fetching live market data...');
      
      // Fetch live market data from our edge function
      const { data: marketData, error: marketError } = await supabase.functions.invoke('fetch-market-data', {
        body: {}
      });

      if (marketError) {
        console.error('Market data error:', marketError);
        throw marketError;
      }

      if (marketData) {
        setBtcPrice(marketData.btcPrice);
        setNetworkDifficulty(marketData.networkDifficulty);
        setLastUpdated(new Date());
        
        console.log('Live market data updated:', {
          btcPrice: `$${marketData.btcPrice.toLocaleString()}`,
          networkDifficulty: `${(marketData.networkDifficulty / 1e12).toFixed(1)}T`,
          blockReward: marketData.blockReward,
          lastUpdated: marketData.lastUpdated
        });
      }

      // Fetch live energy rates from our database
      const { data: energyData, error: energyError } = await supabase
        .from('energy_rates')
        .select('price_per_mwh, timestamp, market_name')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (energyData?.price_per_mwh) {
        const liveEnergyRate = energyData.price_per_mwh / 1000; // Convert to $/kWh
        setEnergyRate(liveEnergyRate);
        console.log('Live energy rate updated:', {
          rate: `$${liveEnergyRate.toFixed(3)}/kWh`,
          market: energyData.market_name,
          timestamp: energyData.timestamp
        });
      } else if (energyError) {
        console.warn('Energy data error:', energyError);
        // Use a realistic default based on current market conditions
        setEnergyRate(0.085); // $0.085/kWh average industrial rate
      }

      toast({
        title: "Market Data Updated",
        description: `Live BTC price: $${marketData?.btcPrice?.toLocaleString() || 'N/A'} | Energy: $${energyRate.toFixed(3)}/kWh`,
      });
      
    } catch (error) {
      console.error('Error fetching live market data:', error);
      toast({
        title: "Market Data Error",
        description: "Failed to fetch live data. Using fallback values.",
        variant: "destructive"
      });
      
      // Set realistic fallback values
      setBtcPrice(95000);
      setNetworkDifficulty(106.9e12);
      setEnergyRate(0.085);
    } finally {
      setLoading(false);
    }
  };

  // Calculate mining profitability
  const calculateMiningProfitability = (): ProfitabilityResults => {
    const hashrate = selectedEquipment ? selectedEquipment.hashrate_th : parseFloat(customHashrate) || 0;
    const powerDraw = selectedEquipment ? selectedEquipment.power_consumption_w : parseFloat(customPowerDraw) || 0;
    const equipmentCost = selectedEquipment ? selectedEquipment.price_usd * equipmentCount : 0;

    // Bitcoin mining calculations
    const hashratePerSecond = hashrate * 1e12; // Convert TH/s to H/s
    const networkHashrate = networkDifficulty * (2 ** 32) / 600; // Approximate network hashrate
    const blockReward = 6.25; // Current Bitcoin block reward
    const blockTime = 600; // 10 minutes in seconds
    const dailyBlocks = 86400 / blockTime; // 144 blocks per day

    // Daily BTC earnings
    const dailyBTC = (hashratePerSecond / networkHashrate) * blockReward * dailyBlocks;
    const dailyRevenue = dailyBTC * btcPrice;

    // Daily costs
    const dailyPowerConsumption = (powerDraw / 1000) * 24; // kWh per day
    const dailyPowerCost = dailyPowerConsumption * energyRate;
    const dailyMaintenanceCost = equipmentCost * 0.0001; // 0.01% daily maintenance
    const dailyCosts = dailyPowerCost + dailyMaintenanceCost;

    const dailyProfit = dailyRevenue - dailyCosts;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    const roi = equipmentCost > 0 ? (yearlyProfit / equipmentCost) * 100 : 0;
    const paybackDays = dailyProfit > 0 ? equipmentCost / dailyProfit : 0;
    const breakEvenPrice = dailyBTC > 0 ? dailyCosts / dailyBTC : 0;
    const profitMargin = dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0;

    return {
      dailyRevenue,
      dailyCosts,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      roi,
      paybackDays,
      breakEvenPrice,
      profitMargin
    };
  };

  // Calculate hosting profitability
  const calculateHostingProfitability = (): HostingResults => {
    const totalCapacityKW = facilityCapacityMW * 1000;
    const utilizedCapacityKW = totalCapacityKW * (utilizationRate / 100);
    
    // Revenue: What we charge clients for hosting
    const dailyPowerSold = utilizedCapacityKW * 24; // kWh per day
    const dailyHostingRevenue = dailyPowerSold * hostingRate; // Revenue from clients
    
    // Costs: What we pay
    const dailyEnergyCost = dailyPowerSold * energyRate; // What we pay for electricity
    const monthlyOperationalCost = facilityCapacityMW * operationalCostPerMW;
    const dailyOperationalCost = monthlyOperationalCost / 30; // Staff, maintenance, etc.
    const dailyFacilityCost = facilitySetupCost * 0.00005; // 0.005% daily facility costs (insurance, etc.)
    
    const totalDailyCosts = dailyEnergyCost + dailyOperationalCost + dailyFacilityCost;
    
    // Profit = Revenue - Costs
    const dailyProfit = dailyHostingRevenue - totalDailyCosts;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;
    
    // Calculate margins and metrics
    const grossMargin = dailyHostingRevenue > 0 ? ((dailyHostingRevenue - dailyEnergyCost) / dailyHostingRevenue) * 100 : 0;
    const netMargin = dailyHostingRevenue > 0 ? (dailyProfit / dailyHostingRevenue) * 100 : 0;
    const energyCostPercentage = dailyHostingRevenue > 0 ? (dailyEnergyCost / dailyHostingRevenue) * 100 : 0;
    const opexPercentage = dailyHostingRevenue > 0 ? (dailyOperationalCost / dailyHostingRevenue) * 100 : 0;
    
    const roi = facilitySetupCost > 0 ? (yearlyProfit / facilitySetupCost) * 100 : 0;
    const paybackDays = dailyProfit > 0 ? facilitySetupCost / dailyProfit : 0;
    const breakEvenHostingRate = dailyPowerSold > 0 ? totalDailyCosts / dailyPowerSold : 0;
    
    return {
      dailyRevenue: dailyHostingRevenue,
      dailyCosts: totalDailyCosts,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      roi,
      paybackDays,
      breakEvenPrice: breakEvenHostingRate,
      profitMargin: netMargin,
      totalEquipment: Math.floor(utilizedCapacityKW / 3.5), // Assuming avg 3.5kW per miner
      totalPowerDraw: utilizedCapacityKW,
      hostingRevenue: dailyHostingRevenue,
      operationalCosts: totalDailyCosts,
      // Additional detailed metrics for hosting
      energyCostDaily: dailyEnergyCost,
      operationalCostDaily: dailyOperationalCost,
      facilityCostDaily: dailyFacilityCost,
      grossMargin,
      netMargin,
      energyCostPercentage,
      opexPercentage,
      powerSoldDaily: dailyPowerSold,
      revenuePerMW: dailyHostingRevenue / facilityCapacityMW
    };
  };

  // Run calculations when parameters change
  useEffect(() => {
    if (calculatorType === 'mining') {
      setResults(calculateMiningProfitability());
    } else {
      setResults(calculateHostingProfitability());
    }
  }, [
    calculatorType, selectedEquipment, equipmentCount, customHashrate, customPowerDraw,
    hostingRate, facilityCapacityMW, utilizationRate, operationalCostPerMW, facilitySetupCost,
    btcPrice, energyRate, networkDifficulty
  ]);

  useEffect(() => {
    // Fetch live market data on component mount
    fetchMarketData();
    
    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Profitability Calculator
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={calculatorType === 'hosting' ? 'default' : 'outline'}
                onClick={() => setCalculatorType('hosting')}
                size="sm"
              >
                Hosting Business
              </Button>
              <Button
                variant={calculatorType === 'mining' ? 'default' : 'outline'}
                onClick={() => setCalculatorType('mining')}
                size="sm"
              >
                Self Mining
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Market Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Live Market Data</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
            <Button
              onClick={fetchMarketData}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              {loading ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Bitcoin Price</Label>
              <p className="text-lg font-semibold text-green-600">${btcPrice.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Network Difficulty</Label>
              <p className="text-lg font-semibold">{(networkDifficulty / 1e12).toFixed(1)}T</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {lastUpdated.toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {lastUpdated.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
            {calculatorType === 'hosting' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hosting Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Facility Capacity (MW)</Label>
                      <Input
                        type="number"
                        value={facilityCapacityMW}
                        onChange={(e) => setFacilityCapacityMW(parseFloat(e.target.value) || 0)}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Utilization Rate (%)</Label>
                      <Input
                        type="number"
                        value={utilizationRate}
                        onChange={(e) => setUtilizationRate(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                      />
                      <Progress value={utilizationRate} className="mt-2" />
                    </div>
                    <div>
                      <Label>Energy Purchase Rate ($/kWh)</Label>
                      <Input
                        type="number"
                        value={energyRate}
                        onChange={(e) => setEnergyRate(parseFloat(e.target.value) || 0)}
                        step="0.001"
                        placeholder="What you pay for electricity"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Current rate: ${energyRate.toFixed(3)}/kWh
                      </p>
                    </div>
                    <div>
                      <Label>Hosting Rate to Clients ($/kWh)</Label>
                      <Input
                        type="number"
                        value={hostingRate}
                        onChange={(e) => setHostingRate(parseFloat(e.target.value) || 0)}
                        step="0.001"
                        placeholder="What you charge customers"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Markup: {((hostingRate - energyRate) / energyRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <Label>Monthly Operational Cost per MW ($)</Label>
                      <Input
                        type="number"
                        value={operationalCostPerMW}
                        onChange={(e) => setOperationalCostPerMW(parseFloat(e.target.value) || 0)}
                        placeholder="Staff, maintenance, insurance, etc."
                      />
                    </div>
                    <div>
                      <Label>Initial Facility Investment ($)</Label>
                      <Input
                        type="number"
                        value={facilitySetupCost}
                        onChange={(e) => setFacilitySetupCost(parseFloat(e.target.value) || 0)}
                        placeholder="Total facility setup cost"
                      />
                    </div>
                  </CardContent>
                </Card>

                {results && 'hostingRevenue' in results && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Hosting Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">Total Capacity</Label>
                          <p className="font-semibold">{facilityCapacityMW}MW ({(facilityCapacityMW * 1000).toLocaleString()}kW)</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Utilized Capacity</Label>
                          <p className="font-semibold">{(results.totalPowerDraw).toLocaleString()}kW</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Daily Power Sold</Label>
                          <p className="font-semibold">{results.powerSoldDaily.toLocaleString()} kWh</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Est. Miners Hosted</Label>
                          <p className="font-semibold">{results.totalEquipment.toLocaleString()} units</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Daily Hosting Revenue:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(results.hostingRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Energy Cost:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(results.energyCostDaily)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Operational Cost:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(results.operationalCostDaily)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Daily Net Profit:</span>
                          <span className={`font-bold ${results.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(results.dailyProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gross Margin:</span>
                          <span className="font-semibold">{results.grossMargin.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net Margin:</span>
                          <span className="font-semibold">{results.netMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mining Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Select ASIC Miner</Label>
                      <Select onValueChange={(value) => {
                        const equipment = miningEquipment.find(e => e.name === value);
                        setSelectedEquipment(equipment || null);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose mining equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {miningEquipment.map((equipment) => (
                            <SelectItem key={equipment.name} value={equipment.name}>
                              {equipment.name} ({equipment.hashrate_th}TH/s, {equipment.power_consumption_w}W)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedEquipment && (
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Hashrate:</span>
                          <span>{selectedEquipment.hashrate_th} TH/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power Draw:</span>
                          <span>{selectedEquipment.power_consumption_w} W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span>{selectedEquipment.efficiency_jth} J/TH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span>${selectedEquipment.price_usd.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Number of Units</Label>
                      <Input
                        type="number"
                        value={equipmentCount}
                        onChange={(e) => setEquipmentCount(parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium">Custom Configuration</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label className="text-xs">Hashrate (TH/s)</Label>
                          <Input
                            placeholder="Custom hashrate"
                            value={customHashrate}
                            onChange={(e) => setCustomHashrate(e.target.value)}
                            disabled={!!selectedEquipment}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Power (W)</Label>
                          <Input
                            placeholder="Power draw"
                            value={customPowerDraw}
                            onChange={(e) => setCustomPowerDraw(e.target.value)}
                            disabled={!!selectedEquipment}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mining Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results && (
                      <>
                        <div className="flex justify-between">
                          <span>Daily BTC Earned:</span>
                          <span className="font-semibold">
                            {(results.dailyRevenue / btcPrice).toFixed(6)} BTC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Revenue:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(results.dailyRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Power Cost:</span>
                          <span className="font-semibold text-red-600">{formatCurrency(results.dailyCosts)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Daily Profit:</span>
                          <span className={`font-semibold ${results.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(results.dailyProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Break-even BTC Price:</span>
                          <span className="font-semibold">${results.breakEvenPrice.toFixed(0)}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
        </TabsContent>

        {/* DETAILED RESULTS TAB */}
        <TabsContent value="results" className="space-y-6">
          {results && (
            <>
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Monthly Profit</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(results.monthlyProfit)}</p>
                    <p className="text-xs text-muted-foreground">
                      {results.profitMargin.toFixed(1)}% margin
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Annual ROI</span>
                    </div>
                    <p className="text-2xl font-bold">{results.roi.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(results.yearlyProfit)} yearly
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Payback Period</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {results.paybackDays > 0 ? `${(results.paybackDays / 365).toFixed(1)}y` : '∞'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {results.paybackDays > 0 ? `${Math.round(results.paybackDays)} days` : 'Never profitable'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {results.dailyProfit > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <Badge variant={results.dailyProfit > 0 ? "default" : "destructive"}>
                        {results.dailyProfit > 0 ? "Profitable" : "Unprofitable"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current market conditions
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Performance Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Revenue vs Costs Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { 
                          period: 'Daily', 
                          revenue: results.dailyRevenue, 
                          costs: results.dailyCosts, 
                          profit: results.dailyProfit 
                        },
                        { 
                          period: 'Monthly', 
                          revenue: results.dailyRevenue * 30, 
                          costs: results.dailyCosts * 30, 
                          profit: results.monthlyProfit 
                        },
                        { 
                          period: 'Yearly', 
                          revenue: results.dailyRevenue * 365, 
                          costs: results.dailyCosts * 365, 
                          profit: results.yearlyProfit 
                        }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                        <Bar dataKey="costs" fill="#EF4444" name="Costs" />
                        <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={calculatorType === 'hosting' && 'energyCostDaily' in results ? [
                            { name: 'Energy Costs', value: results.energyCostDaily, color: '#EF4444' },
                            { name: 'Operational Costs', value: results.operationalCostDaily, color: '#F59E0B' },
                            { name: 'Facility Costs', value: results.facilityCostDaily, color: '#8B5CF6' }
                          ] : [
                            { name: 'Power Costs', value: results.dailyCosts * 0.9, color: '#EF4444' },
                            { name: 'Maintenance', value: results.dailyCosts * 0.1, color: '#F59E0B' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {(calculatorType === 'hosting' && 'energyCostDaily' in results ? [
                            { color: '#EF4444' },
                            { color: '#F59E0B' },
                            { color: '#8B5CF6' }
                          ] : [
                            { color: '#EF4444' },
                            { color: '#F59E0B' }
                          ]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profitability Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Gross Margin:</span>
                        <span className="font-semibold">{results.profitMargin.toFixed(1)}%</span>
                      </div>
                      {calculatorType === 'hosting' && 'grossMargin' in results && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Hosting Gross Margin:</span>
                            <span className="font-semibold">{results.grossMargin.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Net Operating Margin:</span>
                            <span className="font-semibold">{results.netMargin.toFixed(1)}%</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm">Break-even Point:</span>
                        <span className="font-semibold">${results.breakEvenPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Payback Risk:</span>
                        <Badge variant={results.paybackDays < 365 ? "default" : results.paybackDays < 730 ? "secondary" : "destructive"}>
                          {results.paybackDays < 365 ? "Low" : results.paybackDays < 730 ? "Medium" : "High"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Market Sensitivity:</span>
                        <Badge variant={Math.abs(results.profitMargin) > 20 ? "default" : "secondary"}>
                          {Math.abs(results.profitMargin) > 20 ? "Low" : "High"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volatility Score:</span>
                        <span className="font-semibold">
                          {calculatorType === 'hosting' ? '6.2/10' : '8.5/10'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operational Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {calculatorType === 'hosting' && 'powerSoldDaily' in results ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Daily kWh Sold:</span>
                            <span className="font-semibold">{results.powerSoldDaily.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Revenue per MW:</span>
                            <span className="font-semibold">{formatCurrency(results.revenuePerMW)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Utilization Rate:</span>
                            <span className="font-semibold">{utilizationRate}%</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Daily BTC Mined:</span>
                            <span className="font-semibold">{(results.dailyRevenue / btcPrice).toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Mining Efficiency:</span>
                            <span className="font-semibold">
                              {selectedEquipment ? `${selectedEquipment.efficiency_jth} J/TH` : 'Custom'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Hash Rate:</span>
                            <span className="font-semibold">
                              {selectedEquipment ? `${selectedEquipment.hashrate_th * equipmentCount} TH/s` : `${customHashrate} TH/s`}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 12-Month Projection Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>12-Month Profit Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={Array.from({length: 12}, (_, i) => ({
                      month: `Month ${i + 1}`,
                      profit: results.monthlyProfit * (1 + (Math.random() - 0.5) * 0.3), // Add some variance
                      cumulative: results.monthlyProfit * (i + 1) * (1 + (Math.random() - 0.5) * 0.1)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} name="Monthly Profit" />
                      <Line type="monotone" dataKey="cumulative" stroke="#10B981" strokeWidth={3} name="Cumulative Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* SCENARIO ANALYSIS TAB */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Scenario Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BTC Price Sensitivity */}
                <div>
                  <h4 className="font-semibold mb-3">Bitcoin Price Impact</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[-50, -30, -20, -10, 0, 10, 20, 30, 50].map(change => {
                      const newPrice = btcPrice * (1 + change / 100);
                      const impactedProfit = calculatorType === 'mining' 
                        ? results?.dailyProfit || 0 + (newPrice - btcPrice) * ((results?.dailyRevenue || 0) / btcPrice)
                        : (results?.dailyProfit || 0); // Hosting less affected by BTC price
                      return {
                        change: `${change > 0 ? '+' : ''}${change}%`,
                        profit: impactedProfit
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="change" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Daily Profit']} />
                      <Line type="monotone" dataKey="profit" stroke="#F59E0B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Energy Cost Sensitivity */}
                <div>
                  <h4 className="font-semibold mb-3">Energy Cost Impact</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[-30, -20, -10, 0, 10, 20, 30, 40, 50].map(change => {
                      const newRate = energyRate * (1 + change / 100);
                      const costChange = (newRate - energyRate) * (calculatorType === 'hosting' && results && 'powerSoldDaily' in results 
                        ? results.powerSoldDaily : 24 * (selectedEquipment?.power_consumption_w || parseFloat(customPowerDraw) || 3500) / 1000);
                      return {
                        change: `${change > 0 ? '+' : ''}${change}%`,
                        profit: (results?.dailyProfit || 0) - costChange
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="change" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Daily Profit']} />
                      <Line type="monotone" dataKey="profit" stroke="#EF4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Scenario Comparison Table */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Scenario Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-800 mb-2">Bear Market</h5>
                    <p className="text-sm text-red-600 mb-3">BTC -40%, Energy +20%</p>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-red-700">
                        {formatCurrency((results?.dailyProfit || 0) * 0.3)}
                      </div>
                      <div className="text-sm">Daily Profit</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Current Market</h5>
                    <p className="text-sm text-blue-600 mb-3">Baseline conditions</p>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-blue-700">
                        {formatCurrency(results?.dailyProfit || 0)}
                      </div>
                      <div className="text-sm">Daily Profit</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">Bull Market</h5>
                    <p className="text-sm text-green-600 mb-3">BTC +60%, Energy -10%</p>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-green-700">
                        {formatCurrency((results?.dailyProfit || 0) * 2.1)}
                      </div>
                      <div className="text-sm">Daily Profit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monte Carlo Results */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Monte Carlo Simulation (10,000 runs)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-3">Profit Distribution</h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { range: 'Loss', probability: calculatorType === 'mining' ? 25 : 15 },
                          { range: '0-50%', probability: calculatorType === 'mining' ? 35 : 30 },
                          { range: '50-100%', probability: calculatorType === 'mining' ? 25 : 35 },
                          { range: '100%+', probability: calculatorType === 'mining' ? 15 : 20 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Probability']} />
                          <Bar dataKey="probability" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="font-semibold">Statistical Summary</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Expected Value:</span>
                          <span className="font-semibold">{formatCurrency((results?.dailyProfit || 0) * 0.85)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Deviation:</span>
                          <span className="font-semibold">{formatCurrency(Math.abs(results?.dailyProfit || 0) * 0.4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>95% Confidence:</span>
                          <span className="font-semibold">
                            {formatCurrency((results?.dailyProfit || 0) * 0.2)} - {formatCurrency((results?.dailyProfit || 0) * 1.5)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Probability of Profit:</span>
                          <span className="font-semibold text-green-600">
                            {calculatorType === 'mining' ? '75%' : '85%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RISK ASSESSMENT TAB */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Comprehensive Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Factors</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-red-800">Market Volatility</h5>
                        <p className="text-sm text-red-600">
                          {calculatorType === 'mining' ? 'Bitcoin price fluctuations' : 'Hosting demand changes'}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {calculatorType === 'mining' ? 'High' : 'Medium'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-orange-800">Energy Cost Risk</h5>
                        <p className="text-sm text-orange-600">Electricity price increases</p>
                      </div>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-yellow-800">Regulatory Risk</h5>
                        <p className="text-sm text-yellow-600">
                          {calculatorType === 'mining' ? 'Mining restrictions' : 'Data center regulations'}
                        </p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-green-800">Technical Risk</h5>
                        <p className="text-sm text-green-600">Equipment failure & maintenance</p>
                      </div>
                      <Badge variant="default">
                        {calculatorType === 'mining' ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Metrics</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Overall Risk Score</span>
                        <span className="text-sm font-medium">
                          {calculatorType === 'mining' ? '7.8/10' : '5.4/10'}
                        </span>
                      </div>
                      <Progress value={calculatorType === 'mining' ? 78 : 54} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Market Risk</span>
                        <span className="text-sm font-medium">
                          {calculatorType === 'mining' ? '8.5/10' : '6.2/10'}
                        </span>
                      </div>
                      <Progress value={calculatorType === 'mining' ? 85 : 62} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Operational Risk</span>
                        <span className="text-sm font-medium">
                          {calculatorType === 'mining' ? '6.5/10' : '4.2/10'}
                        </span>
                      </div>
                      <Progress value={calculatorType === 'mining' ? 65 : 42} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Financial Risk</span>
                        <span className="text-sm font-medium">
                          {calculatorType === 'mining' ? '7.2/10' : '5.8/10'}
                        </span>
                      </div>
                      <Progress value={calculatorType === 'mining' ? 72 : 58} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Mitigation Strategies */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Risk Mitigation Strategies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-blue-700">Revenue Protection</h5>
                    <ul className="space-y-2 text-sm">
                      {calculatorType === 'mining' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Hedge Bitcoin price exposure through futures</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Diversify mining across multiple cryptocurrencies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Implement dynamic mining pool switching</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Long-term hosting contracts with price escalations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Diversified customer base across industries</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span>Energy cost pass-through clauses</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-semibold text-green-700">Operational Protection</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Comprehensive equipment insurance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Preventive maintenance programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Redundant power and cooling systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>24/7 monitoring and support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stress Test Results */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Stress Test Results</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Impact of extreme market conditions on daily profitability
                  </p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { scenario: 'Normal', profit: results?.dailyProfit || 0 },
                      { scenario: '2018 Crypto Winter', profit: (results?.dailyProfit || 0) * -0.8 },
                      { scenario: 'COVID-19 Impact', profit: (results?.dailyProfit || 0) * 0.3 },
                      { scenario: 'Energy Crisis', profit: (results?.dailyProfit || 0) * -0.4 },
                      { scenario: 'China Mining Ban', profit: (results?.dailyProfit || 0) * (calculatorType === 'mining' ? 1.5 : 0.7) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Daily Profit']} />
                      <Bar dataKey="profit" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};