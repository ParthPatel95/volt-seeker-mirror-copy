import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Brain, AlertCircle } from 'lucide-react';
import { useAIMarketIntelligence } from '@/hooks/useAIMarketIntelligence';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ENERGY_MARKETS = [
  'ERCOT_HOUSTON',
  'CAISO_SP15',
  'PJM_WEST',
  'NYISO_NYC',
  'ISO_NE'
];

export function PricePredictionDashboard() {
  const [selectedMarket, setSelectedMarket] = useState(ENERGY_MARKETS[0]);
  const {
    loading,
    predictions,
    generatePricePredictions,
    fetchStoredPredictions
  } = useAIMarketIntelligence();

  const [storedPredictions, setStoredPredictions] = useState<any[]>([]);

  useEffect(() => {
    loadStoredPredictions();
  }, [selectedMarket]);

  const loadStoredPredictions = async () => {
    const stored = await fetchStoredPredictions(selectedMarket);
    setStoredPredictions(stored);
  };

  const handleGeneratePredictions = async () => {
    await generatePricePredictions(selectedMarket);
    await loadStoredPredictions();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const chartData = predictions?.predictions.map(p => ({
    name: `${p.horizon_days}d`,
    price: p.predicted_price,
    confidence: p.confidence_score
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Price Predictions</h2>
          <p className="text-muted-foreground">Machine learning-powered energy market forecasting</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              {ENERGY_MARKETS.map((market) => (
                <SelectItem key={market} value={market}>
                  {market.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGeneratePredictions} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            <Brain className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Generate Predictions'}
          </Button>
        </div>
      </div>

      {predictions && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Trend</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(predictions.market_analysis.trend)}
                  <Badge variant="outline" className="capitalize">
                    {predictions.market_analysis.trend}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Volatility</span>
                <Badge 
                  variant="outline"
                  className={`capitalize ${
                    predictions.market_analysis.volatility === 'high' ? 'border-red-500 text-red-500' :
                    predictions.market_analysis.volatility === 'medium' ? 'border-yellow-500 text-yellow-500' :
                    'border-green-500 text-green-500'
                  }`}
                >
                  {predictions.market_analysis.volatility}
                </Badge>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Key Drivers</span>
                <div className="flex flex-wrap gap-2">
                  {predictions.market_analysis.key_drivers.map((driver, index) => (
                    <Badge key={`driver-${driver}-${index}`} variant="secondary" className="text-xs">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Forecast Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'price' ? `$${value.toFixed(2)}/MWh` : `${value}%`,
                      name === 'price' ? 'Predicted Price' : 'Confidence'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-foreground">Detailed Predictions</h3>
        {predictions?.predictions.map((prediction, index) => (
          <Card key={`prediction-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-foreground">
                      {prediction.horizon_days} Day Forecast
                    </h4>
                    <Badge 
                      className={`${getConfidenceColor(prediction.confidence_score)} text-white`}
                    >
                      {prediction.confidence_score}% Confidence
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    ${prediction.predicted_price.toFixed(2)}/MWh
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground">Key Factors</div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {prediction.factors.slice(0, 3).map((factor, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Predictions Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Generate AI-powered price predictions for {selectedMarket.replace(/_/g, ' ')}
                </p>
                <Button onClick={handleGeneratePredictions} disabled={loading}>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate First Prediction
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {storedPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Recent Predictions History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storedPredictions.slice(0, 5).map((pred) => (
                <div key={pred.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">
                      {pred.prediction_horizon_days} days - ${pred.predicted_price_mwh.toFixed(2)}/MWh
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: {new Date(pred.prediction_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={`${getConfidenceColor(pred.confidence_score)} text-white`}>
                    {pred.confidence_score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}