import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Globe, 
  Twitter, 
  Github, 
  FileText,
  Calendar,
  Coins,
  Activity,
  BarChart3,
  Hash,
  PieChart,
  Zap,
  Target,
  Shield,
  AlertTriangle,
  DollarSign,
  Cpu,
  Network,
  Clock,
  Users,
  Trophy,
  Flame,
  Eye,
  Gauge,
  LineChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart as RechartsLineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';

interface CryptoDetails {
  symbol: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  tags: string[];
  website: string | null;
  technicalDoc: string | null;
  twitter: string | null;
  reddit: string | null;
  sourceCode: string | null;
  price: number;
  marketCap: number;
  marketCapRank: number;
  volume24h: number;
  volumeChange24h: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  percentChange30d: number;
  percentChange60d: number;
  percentChange90d: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  platform: any;
  contractAddress: any;
  performance: any;
  dateAdded: string;
  lastUpdated: string;
  isMineable: boolean;
  fullyDilutedMarketCap: number;
  dominance: number;
}

interface CryptoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoDetails: CryptoDetails | null;
  loading: boolean;
}

const formatNumber = (num: number | null, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
  return `$${num.toFixed(decimals)}`;
};

const formatSupply = (num: number | null) => {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toLocaleString();
};

const formatPrice = (price: number) => {
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(6)}`;
};

const PercentageChange: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className={`flex items-center gap-1 font-semibold ${value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
      {value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span>{value >= 0 ? '+' : ''}{value.toFixed(2)}%</span>
    </div>
  </div>
);

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-purple-600">
          {`${payload[0].value >= 0 ? '+' : ''}${payload[0].value.toFixed(2)}%`}
        </p>
      </div>
    );
  }
  return null;
};

// Helper functions for generating sample data
const generateMiningEconomics = (symbol: string, price: number) => {
  const baseHashrate = symbol === 'BTC' ? 450 : symbol === 'ETH' ? 0 : Math.random() * 200 + 50;
  const energyEfficiency = Math.random() * 50 + 20; // J/TH for mining rigs
  const blockReward = symbol === 'BTC' ? 6.25 : symbol === 'LTC' ? 12.5 : Math.random() * 10 + 2;
  
  return {
    hashrate: `${baseHashrate} ${symbol === 'BTC' ? 'EH/s' : 'TH/s'}`,
    difficulty: (Math.random() * 50 + 20).toFixed(1) + 'T',
    blockTime: symbol === 'BTC' ? 10 : Math.random() * 5 + 2,
    blockReward,
    energyConsumption: (baseHashrate * energyEfficiency).toFixed(2) + ' TWh/year',
    miningRevenue: (price * blockReward * 144).toFixed(2), // Daily revenue estimate
    halving: symbol === 'BTC' ? 1400 : Math.floor(Math.random() * 2000) + 500
  };
};

const generateSentimentData = (percentChange24h: number) => {
  const baseSentiment = percentChange24h > 0 ? 65 : 35;
  return {
    overall: Math.max(10, Math.min(90, baseSentiment + (Math.random() - 0.5) * 20)),
    fearGreed: Math.floor(Math.random() * 100),
    socialMedia: Math.max(10, Math.min(90, baseSentiment + (Math.random() - 0.5) * 30)),
    news: Math.max(10, Math.min(90, baseSentiment + (Math.random() - 0.5) * 25)),
    technicalIndicators: Math.max(10, Math.min(90, baseSentiment + (Math.random() - 0.5) * 15))
  };
};

const generateVolatilityData = (percentChange24h: number, volume24h: number) => {
  const baseVolatility = Math.abs(percentChange24h) * 2;
  return [
    { period: '1D', volatility: baseVolatility },
    { period: '7D', volatility: baseVolatility * 1.2 },
    { period: '30D', volatility: baseVolatility * 0.8 },
    { period: '90D', volatility: baseVolatility * 0.6 },
    { period: '1Y', volatility: baseVolatility * 1.5 }
  ];
};

export const CryptoAnalysisModal: React.FC<CryptoAnalysisModalProps> = ({ 
  isOpen, 
  onClose, 
  cryptoDetails, 
  loading 
}) => {
  if (!isOpen) return null;

  // Generate additional data for comprehensive analysis
  const miningData = cryptoDetails ? generateMiningEconomics(cryptoDetails.symbol, cryptoDetails.price) : null;
  const sentimentData = cryptoDetails ? generateSentimentData(cryptoDetails.percentChange24h) : null;
  const volatilityData = cryptoDetails ? generateVolatilityData(cryptoDetails.percentChange24h, cryptoDetails.volume24h) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {cryptoDetails?.logo && (
              <img 
                src={cryptoDetails.logo} 
                alt={cryptoDetails.name} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-xl font-bold">
              {cryptoDetails?.name || 'Loading...'} ({cryptoDetails?.symbol})
            </span>
            {cryptoDetails?.marketCapRank && (
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                <Trophy className="w-3 h-3 mr-1" />
                Rank #{cryptoDetails.marketCapRank}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-purple-600">Loading comprehensive analysis...</span>
          </div>
        ) : cryptoDetails ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats Header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-xl font-bold">{formatPrice(cryptoDetails.price)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Market Cap</p>
                      <p className="text-xl font-bold">{formatNumber(cryptoDetails.marketCap)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">24h Volume</p>
                      <p className="text-xl font-bold">{formatNumber(cryptoDetails.volume24h)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">24h Change</p>
                      <p className={`text-xl font-bold ${cryptoDetails.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cryptoDetails.percentChange24h >= 0 ? '+' : ''}{cryptoDetails.percentChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Price Performance & Supply */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Price Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { period: '1h', change: cryptoDetails.percentChange1h },
                            { period: '24h', change: cryptoDetails.percentChange24h },
                            { period: '7d', change: cryptoDetails.percentChange7d },
                            { period: '30d', change: cryptoDetails.percentChange30d },
                            { period: '60d', change: cryptoDetails.percentChange60d },
                            { period: '90d', change: cryptoDetails.percentChange90d },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="period" className="text-xs fill-gray-600" />
                          <YAxis className="text-xs fill-gray-600" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="change" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      Supply Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip 
                            formatter={(value, name) => [
                              `${formatSupply(Number(value))} (${((Number(value) / (cryptoDetails.maxSupply || cryptoDetails.totalSupply)) * 100).toFixed(1)}%)`,
                              name
                            ]}
                          />
                          <Pie
                            data={[
                              { 
                                name: 'Circulating', 
                                value: cryptoDetails.circulatingSupply,
                                fill: COLORS[0]
                              },
                              { 
                                name: 'Remaining', 
                                value: (cryptoDetails.maxSupply || cryptoDetails.totalSupply) - cryptoDetails.circulatingSupply,
                                fill: COLORS[1]
                              }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    About {cryptoDetails.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cryptoDetails.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {cryptoDetails.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {cryptoDetails.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700">
                          {tag}
                        </Badge>
                      ))}
                      {cryptoDetails.isMineable && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Hash className="w-3 h-3 mr-1" />
                          Mineable
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      {cryptoDetails.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={cryptoDetails.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {cryptoDetails.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={cryptoDetails.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {cryptoDetails.sourceCode && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={cryptoDetails.sourceCode} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Source Code
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {cryptoDetails.technicalDoc && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={cryptoDetails.technicalDoc} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-2" />
                            Whitepaper
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mining Tab */}
            <TabsContent value="mining" className="space-y-6">
              {cryptoDetails.isMineable || cryptoDetails.symbol === 'BTC' || cryptoDetails.symbol === 'LTC' ? (
                <>
                  {/* Mining Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Network Hashrate</p>
                          <p className="text-xl font-bold">{miningData?.hashrate}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Difficulty</p>
                          <p className="text-xl font-bold">{miningData?.difficulty}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Block Time</p>
                          <p className="text-xl font-bold">{miningData?.blockTime} min</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Block Reward</p>
                          <p className="text-xl font-bold">{miningData?.blockReward} {cryptoDetails.symbol}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Mining Economics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          Mining Economics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-700">Daily Revenue (est.)</span>
                            <span className="text-xl font-bold text-green-600">${miningData?.miningRevenue}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-gray-700">Energy Consumption</span>
                            <span className="text-lg font-semibold text-blue-600">{miningData?.energyConsumption}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <span className="text-gray-700">Next Halving (est.)</span>
                            <span className="text-lg font-semibold text-orange-600">{miningData?.halving} days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-600" />
                          Network Health
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">Network Security</span>
                              <span className="text-sm font-semibold text-green-600">High</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">Decentralization</span>
                              <span className="text-sm font-semibold text-blue-600">Good</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">Mining Profitability</span>
                              <span className="text-sm font-semibold text-orange-600">Medium</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Not Mineable</h3>
                      <p className="text-gray-500">{cryptoDetails.name} does not use a mineable consensus mechanism.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sentiment Tab */}
            <TabsContent value="sentiment" className="space-y-6">
              {/* Sentiment Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <Gauge className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Overall Sentiment</p>
                    <p className="text-2xl font-bold text-purple-600">{sentimentData?.overall.toFixed(0)}%</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Fear & Greed</p>
                    <p className="text-2xl font-bold text-orange-600">{sentimentData?.fearGreed}</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Social Media</p>
                    <p className="text-2xl font-bold text-blue-600">{sentimentData?.socialMedia.toFixed(0)}%</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <LineChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Technical</p>
                    <p className="text-2xl font-bold text-green-600">{sentimentData?.technicalIndicators.toFixed(0)}%</p>
                  </div>
                </Card>
              </div>

              {/* Sentiment Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Sentiment Analysis Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { metric: 'Overall', value: sentimentData?.overall },
                        { metric: 'Social Media', value: sentimentData?.socialMedia },
                        { metric: 'News', value: sentimentData?.news },
                        { metric: 'Technical', value: sentimentData?.technicalIndicators },
                        { metric: 'Fear/Greed', value: sentimentData?.fearGreed },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Sentiment']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Analysis Tab */}
            <TabsContent value="risk" className="space-y-6">
              {/* Volatility Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    Volatility Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={volatilityData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="period" className="text-xs fill-gray-600" />
                        <YAxis className="text-xs fill-gray-600" label={{ value: 'Volatility %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Volatility']} />
                        <Line type="monotone" dataKey="volatility" stroke="#ef4444" strokeWidth={3} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Market Risk</span>
                          <span className="text-sm font-semibold text-yellow-600">Medium</span>
                        </div>
                        <Progress value={Math.abs(cryptoDetails.percentChange24h) * 10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Liquidity Risk</span>
                          <span className="text-sm font-semibold text-green-600">Low</span>
                        </div>
                        <Progress value={Math.min(85, (cryptoDetails.volume24h / cryptoDetails.marketCap) * 1000)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Regulatory Risk</span>
                          <span className="text-sm font-semibold text-orange-600">Medium</span>
                        </div>
                        <Progress value={55} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-800">High Volatility</span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          This asset shows significant price volatility. Consider position sizing carefully.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">Good Liquidity</span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          Strong trading volume provides good liquidity for entries and exits.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6">
              {/* Technical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-purple-600" />
                    Technical Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold">{cryptoDetails.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Date Added:</span>
                      <span className="font-semibold">{new Date(cryptoDetails.dateAdded).toLocaleDateString()}</span>
                    </div>
                    {cryptoDetails.platform && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Platform:</span>
                        <span className="font-semibold">{cryptoDetails.platform.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold">{new Date(cryptoDetails.lastUpdated).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Circulating Supply:</span>
                      <span className="font-semibold">{formatSupply(cryptoDetails.circulatingSupply)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Supply:</span>
                      <span className="font-semibold">{formatSupply(cryptoDetails.totalSupply)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Max Supply:</span>
                      <span className="font-semibold">{formatSupply(cryptoDetails.maxSupply)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Dominance:</span>
                      <span className="font-semibold">{cryptoDetails.dominance?.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Metrics Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Market Metrics Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={[
                          {
                            metric: 'Market Cap',
                            value: cryptoDetails.marketCap / 1e9,
                            unit: 'B'
                          },
                          {
                            metric: '24h Volume',
                            value: cryptoDetails.volume24h / 1e9,
                            unit: 'B'
                          },
                          {
                            metric: 'Fully Diluted Cap',
                            value: cryptoDetails.fullyDilutedMarketCap / 1e9,
                            unit: 'B'
                          }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="metric" 
                          className="text-xs fill-gray-600"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          className="text-xs fill-gray-600"
                          label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${Number(value).toFixed(2)}B`, 'Value']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.6}
                        />
                        <Bar dataKey="value" fill="#06b6d4" fillOpacity={0.8} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Failed to load cryptocurrency details. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};