import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AESOMarketAnalytics, AESOHistoricalPrices } from '@/hooks/useAESOEnhancedData';

interface AESOMarketAnalyticsPanelProps {
  marketAnalytics: AESOMarketAnalytics;
  historicalPrices: AESOHistoricalPrices;
  loading: boolean;
}

export function AESOMarketAnalyticsPanel({ marketAnalytics, historicalPrices, loading }: AESOMarketAnalyticsPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AESO Market Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Market Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Market Stress Score</p>
            <p className="text-2xl font-bold">{marketAnalytics.market_stress_score.toFixed(1)}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Next Hour Prediction</p>
            <p className="text-2xl font-bold">${marketAnalytics.price_prediction.next_hour_prediction.toFixed(2)}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-2xl font-bold">{(marketAnalytics.price_prediction.confidence * 100).toFixed(1)}%</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Trend Direction</p>
            <p className="text-2xl font-bold">{marketAnalytics.price_prediction.trend_direction}</p>
          </div>
        </div>
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-semibold mb-2">Price Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Average</p>
              <p className="font-medium">${historicalPrices.statistics.average_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max</p>
              <p className="font-medium">${historicalPrices.statistics.max_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Min</p>
              <p className="font-medium">${historicalPrices.statistics.min_price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}