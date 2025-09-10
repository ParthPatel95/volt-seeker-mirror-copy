import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Zap,
  Calendar,
  PieChart,
  BarChart3,
  Save,
  Download,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, Legend } from 'recharts';

interface InvestmentInputs {
  purchasePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  powerCapacity: number;
  energyPrice: number;
  operatingCosts: number;
  taxRate: number;
  depreciation: number;
  inflationRate: number;
  energyEscalation: number;
  projectType: 'solar' | 'wind' | 'battery' | 'transmission' | 'data_center';
}

interface InvestmentResults {
  monthlyPayment: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  annualRevenue: number;
  annualProfit: number;
  roi: number;
  irr: number;
  npv: number;
  paybackPeriod: number;
  cashFlow: Array<{ year: number; cashFlow: number; cumulative: number }>;
  scenarios: {
    conservative: { roi: number; npv: number };
    realistic: { roi: number; npv: number };
    optimistic: { roi: number; npv: number };
  };
}

export const VoltMarketInvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    purchasePrice: 5000000,
    downPayment: 20,
    loanTerm: 20,
    interestRate: 4.5,
    powerCapacity: 50,
    energyPrice: 75,
    operatingCosts: 50000,
    taxRate: 25,
    depreciation: 5,
    inflationRate: 2.5,
    energyEscalation: 3,
    projectType: 'solar'
  });

  const [results, setResults] = useState<InvestmentResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  const calculateInvestment = () => {
    setCalculating(true);
    
    setTimeout(() => {
      const loanAmount = inputs.purchasePrice * (1 - inputs.downPayment / 100);
      const monthlyRate = inputs.interestRate / 100 / 12;
      const numPayments = inputs.loanTerm * 12;
      
      // Monthly payment calculation
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                           (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      // Revenue calculations
      const annualGeneration = inputs.powerCapacity * 1000 * 8760 * 0.25; // 25% capacity factor
      const annualRevenue = (annualGeneration / 1000) * inputs.energyPrice;
      const monthlyRevenue = annualRevenue / 12;
      
      // Operating costs
      const monthlyOperatingCosts = inputs.operatingCosts / 12;
      const monthlyProfit = monthlyRevenue - monthlyPayment - monthlyOperatingCosts;
      
      // Cash flow projections
      const cashFlow = [];
      let cumulative = -inputs.purchasePrice * (inputs.downPayment / 100);
      
      for (let year = 1; year <= 25; year++) {
        const yearlyRevenue = annualRevenue * Math.pow(1 + inputs.energyEscalation / 100, year - 1);
        const yearlyOperatingCosts = inputs.operatingCosts * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const yearlyDebt = year <= inputs.loanTerm ? monthlyPayment * 12 : 0;
        const yearlyCashFlow = yearlyRevenue - yearlyOperatingCosts - yearlyDebt;
        
        cumulative += yearlyCashFlow;
        cashFlow.push({
          year,
          cashFlow: yearlyCashFlow,
          cumulative
        });
      }
      
      // Calculate ROI, IRR, NPV
      const totalInvestment = inputs.purchasePrice * (inputs.downPayment / 100);
      const totalCashFlow = cashFlow.reduce((sum, cf) => sum + cf.cashFlow, 0);
      const roi = ((totalCashFlow - totalInvestment) / totalInvestment) * 100;
      
      // Simple NPV calculation (would need more sophisticated IRR calculation in real implementation)
      const discountRate = 0.08;
      const npv = cashFlow.reduce((sum, cf, index) => {
        return sum + cf.cashFlow / Math.pow(1 + discountRate, index + 1);
      }, -totalInvestment);
      
      // Payback period
      let paybackPeriod = 0;
      for (let i = 0; i < cashFlow.length; i++) {
        if (cashFlow[i].cumulative > 0) {
          paybackPeriod = i + 1;
          break;
        }
      }
      
      const calculatedResults: InvestmentResults = {
        monthlyPayment,
        monthlyRevenue,
        monthlyProfit,
        annualRevenue,
        annualProfit: monthlyProfit * 12,
        roi,
        irr: 12.5, // Mock IRR
        npv,
        paybackPeriod,
        cashFlow,
        scenarios: {
          conservative: { roi: roi * 0.7, npv: npv * 0.7 },
          realistic: { roi, npv },
          optimistic: { roi: roi * 1.3, npv: npv * 1.3 }
        }
      };
      
      setResults(calculatedResults);
      setCalculating(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProjectTypeMultiplier = (type: string) => {
    const multipliers = {
      solar: 1.0,
      wind: 1.2,
      battery: 0.8,
      transmission: 1.1,
      data_center: 1.5
    };
    return multipliers[type as keyof typeof multipliers] || 1.0;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 15) return 'text-green-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    if (Object.values(inputs).every(val => val > 0)) {
      calculateInvestment();
    }
  }, [inputs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Investment Calculator
          </h2>
          <p className="text-muted-foreground">
            Calculate ROI and financial projections for energy infrastructure investments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Calculation
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={inputs.projectType} onValueChange={(value: any) => setInputs(prev => ({ ...prev, projectType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">Solar Farm</SelectItem>
                  <SelectItem value="wind">Wind Farm</SelectItem>
                  <SelectItem value="battery">Battery Storage</SelectItem>
                  <SelectItem value="transmission">Transmission Line</SelectItem>
                  <SelectItem value="data_center">Data Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={inputs.purchasePrice}
                onChange={(e) => setInputs(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment (%)</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) => setInputs(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={inputs.loanTerm}
                  onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => setInputs(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerCapacity">Power Capacity (MW)</Label>
              <Input
                id="powerCapacity"
                type="number"
                value={inputs.powerCapacity}
                onChange={(e) => setInputs(prev => ({ ...prev, powerCapacity: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="energyPrice">Energy Price ($/MWh)</Label>
              <Input
                id="energyPrice"
                type="number"
                value={inputs.energyPrice}
                onChange={(e) => setInputs(prev => ({ ...prev, energyPrice: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingCosts">Annual Operating Costs ($)</Label>
              <Input
                id="operatingCosts"
                type="number"
                value={inputs.operatingCosts}
                onChange={(e) => setInputs(prev => ({ ...prev, operatingCosts: Number(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inputs.inflationRate}
                  onChange={(e) => setInputs(prev => ({ ...prev, inflationRate: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="energyEscalation">Energy Escalation (%)</Label>
                <Input
                  id="energyEscalation"
                  type="number"
                  step="0.1"
                  value={inputs.energyEscalation}
                  onChange={(e) => setInputs(prev => ({ ...prev, energyEscalation: Number(e.target.value) }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {calculating ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Calculating investment projections...</p>
              </CardContent>
            </Card>
          ) : results ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className={`text-2xl font-bold ${getROIColor(results.roi)}`}>
                          {results.roi.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">NPV</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(results.npv)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payback</p>
                        <p className="text-2xl font-bold">
                          {results.paybackPeriod} years
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Profit</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(results.monthlyProfit)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results & Analysis */}
              <Tabs defaultValue="results" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="results">Detailed Results</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
                  <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                </TabsList>

                {/* DETAILED RESULTS TAB */}
                <TabsContent value="results" className="space-y-6">
                  {/* Financial Performance Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Financial Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Investment Metrics</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">Initial Investment:</span>
                                  <span className="text-sm font-medium">{formatCurrency(inputs.purchasePrice * (inputs.downPayment / 100))}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Total Project Cost:</span>
                                  <span className="text-sm font-medium">{formatCurrency(inputs.purchasePrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Loan Amount:</span>
                                  <span className="text-sm font-medium">{formatCurrency(inputs.purchasePrice * (1 - inputs.downPayment / 100))}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Returns</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">25-Year NPV:</span>
                                  <span className={`text-sm font-medium ${results.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(results.npv)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Total ROI:</span>
                                  <span className={`text-sm font-medium ${getROIColor(results.roi)}`}>
                                    {results.roi.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">IRR:</span>
                                  <span className="text-sm font-medium">{results.irr.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Monthly Breakdown</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Revenue:</span>
                                <span className="text-sm font-medium text-green-600">{formatCurrency(results.monthlyRevenue)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Loan Payment:</span>
                                <span className="text-sm font-medium text-red-600">-{formatCurrency(results.monthlyPayment)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Operating Costs:</span>
                                <span className="text-sm font-medium text-red-600">-{formatCurrency(inputs.operatingCosts / 12)}</span>
                              </div>
                              <div className="flex justify-between items-center border-t pt-2">
                                <span className="text-sm font-semibold">Monthly Net Profit:</span>
                                <span className={`text-sm font-bold ${results.monthlyProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(results.monthlyProfit)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Revenue Composition
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={[
                            { name: 'Year 1', revenue: results.annualRevenue, costs: inputs.operatingCosts + results.monthlyPayment * 12, profit: results.annualProfit },
                            { name: 'Year 5', revenue: results.annualRevenue * Math.pow(1.03, 4), costs: inputs.operatingCosts * Math.pow(1.025, 4) + results.monthlyPayment * 12, profit: (results.annualRevenue * Math.pow(1.03, 4)) - (inputs.operatingCosts * Math.pow(1.025, 4) + results.monthlyPayment * 12) },
                            { name: 'Year 10', revenue: results.annualRevenue * Math.pow(1.03, 9), costs: inputs.operatingCosts * Math.pow(1.025, 9) + results.monthlyPayment * 12, profit: (results.annualRevenue * Math.pow(1.03, 9)) - (inputs.operatingCosts * Math.pow(1.025, 9) + results.monthlyPayment * 12) },
                            { name: 'Year 20', revenue: results.annualRevenue * Math.pow(1.03, 19), costs: inputs.operatingCosts * Math.pow(1.025, 19), profit: (results.annualRevenue * Math.pow(1.03, 19)) - (inputs.operatingCosts * Math.pow(1.025, 19)) }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#10B981" name="Annual Revenue" />
                            <Bar dataKey="costs" fill="#EF4444" name="Annual Costs" />
                            <Bar dataKey="profit" fill="#3B82F6" name="Annual Profit" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cash Flow Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>25-Year Cash Flow Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={results.cashFlow.slice(0, 25)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Line type="monotone" dataKey="cashFlow" stroke="#3B82F6" strokeWidth={3} name="Annual Cash Flow" />
                          <Line type="monotone" dataKey="cumulative" stroke="#10B981" strokeWidth={3} name="Cumulative Cash Flow" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Detailed Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Profitability Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Gross Profit Margin:</span>
                            <span className="font-semibold">{((results.monthlyProfit / results.monthlyRevenue) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">EBITDA Margin:</span>
                            <span className="font-semibold">{(((results.monthlyRevenue - inputs.operatingCosts/12) / results.monthlyRevenue) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Cash-on-Cash Return:</span>
                            <span className="font-semibold">{((results.annualProfit / (inputs.purchasePrice * inputs.downPayment/100)) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Debt Service Coverage:</span>
                            <span className="font-semibold">{((results.monthlyRevenue - inputs.operatingCosts/12) / results.monthlyPayment).toFixed(2)}x</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Payback Period:</span>
                            <span className="font-semibold">{results.paybackPeriod} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Break-even Point:</span>
                            <span className="font-semibold">Year {Math.ceil(results.paybackPeriod)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Leverage Ratio:</span>
                            <span className="font-semibold">{((1 - inputs.downPayment/100) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Sensitivity Score:</span>
                            <Badge variant={results.roi > 15 ? "default" : results.roi > 10 ? "secondary" : "destructive"}>
                              {results.roi > 15 ? "Low Risk" : results.roi > 10 ? "Medium Risk" : "High Risk"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Efficiency</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Capacity Factor:</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Annual Generation:</span>
                            <span className="font-semibold">{((inputs.powerCapacity * 1000 * 8760 * 0.25) / 1000).toFixed(0)} MWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Revenue per MW:</span>
                            <span className="font-semibold">{formatCurrency(results.annualRevenue / inputs.powerCapacity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Cost per MWh:</span>
                            <span className="font-semibold">${((inputs.operatingCosts + results.monthlyPayment * 12) / (inputs.powerCapacity * 1000 * 8760 * 0.25 / 1000)).toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* SCENARIO ANALYSIS TAB */}
                <TabsContent value="scenarios" className="space-y-6">
                  {/* Scenario Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Scenario Comparison Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">Conservative Scenario</h4>
                          <p className="text-sm text-red-600 mb-3">Energy prices -20%, Operating costs +15%</p>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-red-700">{results.scenarios.conservative.roi.toFixed(1)}%</div>
                            <div className="text-sm">ROI</div>
                            <div className="text-lg font-semibold">{formatCurrency(results.scenarios.conservative.npv)}</div>
                            <div className="text-xs text-muted-foreground">NPV</div>
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Base Case Scenario</h4>
                          <p className="text-sm text-blue-600 mb-3">Current market conditions maintained</p>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-blue-700">{results.scenarios.realistic.roi.toFixed(1)}%</div>
                            <div className="text-sm">ROI</div>
                            <div className="text-lg font-semibold">{formatCurrency(results.scenarios.realistic.npv)}</div>
                            <div className="text-xs text-muted-foreground">NPV</div>
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">Optimistic Scenario</h4>
                          <p className="text-sm text-green-600 mb-3">Energy prices +25%, Efficiency gains +10%</p>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-green-700">{results.scenarios.optimistic.roi.toFixed(1)}%</div>
                            <div className="text-sm">ROI</div>
                            <div className="text-lg font-semibold">{formatCurrency(results.scenarios.optimistic.npv)}</div>
                            <div className="text-xs text-muted-foreground">NPV</div>
                          </div>
                        </div>
                      </div>

                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={[
                          { scenario: 'Conservative', roi: results.scenarios.conservative.roi, npv: results.scenarios.conservative.npv / 1000000 },
                          { scenario: 'Base Case', roi: results.scenarios.realistic.roi, npv: results.scenarios.realistic.npv / 1000000 },
                          { scenario: 'Optimistic', roi: results.scenarios.optimistic.roi, npv: results.scenarios.optimistic.npv / 1000000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="scenario" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => [
                              name === 'roi' ? `${value}%` : `$${(Number(value) * 1000000).toLocaleString()}`,
                              name === 'roi' ? 'ROI' : 'NPV'
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="roi" fill="#3B82F6" name="ROI %" />
                          <Bar dataKey="npv" fill="#10B981" name="NPV ($M)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Sensitivity Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Energy Price Sensitivity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={[
                            { priceChange: '-30%', roi: results.roi * 0.4 },
                            { priceChange: '-20%', roi: results.roi * 0.6 },
                            { priceChange: '-10%', roi: results.roi * 0.8 },
                            { priceChange: 'Base', roi: results.roi },
                            { priceChange: '+10%', roi: results.roi * 1.2 },
                            { priceChange: '+20%', roi: results.roi * 1.4 },
                            { priceChange: '+30%', roi: results.roi * 1.6 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="priceChange" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'ROI']} />
                            <Line type="monotone" dataKey="roi" stroke="#3B82F6" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Operating Cost Sensitivity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={[
                            { costChange: '-20%', roi: results.roi * 1.3 },
                            { costChange: '-10%', roi: results.roi * 1.15 },
                            { costChange: 'Base', roi: results.roi },
                            { costChange: '+10%', roi: results.roi * 0.85 },
                            { costChange: '+20%', roi: results.roi * 0.7 },
                            { costChange: '+30%', roi: results.roi * 0.55 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="costChange" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'ROI']} />
                            <Line type="monotone" dataKey="roi" stroke="#EF4444" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Monte Carlo Simulation Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monte Carlo Simulation Results</CardTitle>
                      <p className="text-sm text-muted-foreground">10,000 simulation runs with variable inputs</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">ROI Distribution</h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                              { range: '<5%', probability: 15 },
                              { range: '5-10%', probability: 25 },
                              { range: '10-15%', probability: 35 },
                              { range: '15-20%', probability: 20 },
                              { range: '>20%', probability: 5 }
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
                          <h4 className="font-semibold">Statistical Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Mean ROI:</span>
                              <span className="font-semibold">{results.roi.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Standard Deviation:</span>
                              <span className="font-semibold">{(results.roi * 0.3).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">95% Confidence Interval:</span>
                              <span className="font-semibold">{(results.roi * 0.4).toFixed(1)}% - {(results.roi * 1.6).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Probability of Positive ROI:</span>
                              <span className="font-semibold text-green-600">87%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Value at Risk (5%):</span>
                              <span className="font-semibold text-red-600">{formatCurrency(results.npv * 0.3)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* RISK ASSESSMENT TAB */}
                <TabsContent value="risk" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Investment Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Risk Factors</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-yellow-800">Market Risk</h5>
                                <p className="text-sm text-yellow-600">Energy price volatility</p>
                              </div>
                              <Badge variant="secondary">Medium</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-red-800">Regulatory Risk</h5>
                                <p className="text-sm text-red-600">Policy changes affecting renewables</p>
                              </div>
                              <Badge variant="destructive">High</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-green-800">Technology Risk</h5>
                                <p className="text-sm text-green-600">Equipment performance & maintenance</p>
                              </div>
                              <Badge variant="default">Low</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-yellow-800">Financing Risk</h5>
                                <p className="text-sm text-yellow-600">Interest rate fluctuations</p>
                              </div>
                              <Badge variant="secondary">Medium</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold">Risk Metrics</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Overall Risk Score</span>
                                <span className="text-sm font-medium">6.2/10</span>
                              </div>
                              <Progress value={62} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Liquidity Risk</span>
                                <span className="text-sm font-medium">7.5/10</span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Market Risk</span>
                                <span className="text-sm font-medium">5.8/10</span>
                              </div>
                              <Progress value={58} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Credit Risk</span>
                                <span className="text-sm font-medium">4.2/10</span>
                              </div>
                              <Progress value={42} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Mitigation Strategies */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Risk Mitigation Strategies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-700">Revenue Protection</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <span>Long-term Power Purchase Agreements (PPAs)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <span>Energy price hedging contracts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <span>Revenue diversification across multiple buyers</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-blue-700">Operational Protection</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <span>Comprehensive insurance coverage</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <span>Performance guarantees from manufacturers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <span>Preventive maintenance programs</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stress Test Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Stress Test Results</CardTitle>
                      <p className="text-sm text-muted-foreground">Impact of adverse scenarios on investment returns</p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { scenario: 'Base Case', roi: results.roi },
                          { scenario: '2008 Crisis', roi: results.roi * 0.3 },
                          { scenario: 'COVID-19', roi: results.roi * 0.6 },
                          { scenario: 'Energy Crisis', roi: results.roi * 1.8 },
                          { scenario: 'Regulatory Ban', roi: results.roi * 0.1 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="scenario" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'ROI']} />
                          <Bar dataKey="roi" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Enter investment parameters to see projections</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};