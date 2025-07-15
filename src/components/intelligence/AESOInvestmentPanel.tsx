import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AESOMarketAnalytics, AESOHistoricalPrices } from '@/hooks/useAESOEnhancedData';

interface AESOInvestmentPanelProps {
  marketAnalytics: AESOMarketAnalytics;
  historicalPrices: AESOHistoricalPrices;
  loading: boolean;
}

export function AESOInvestmentPanel({ marketAnalytics, historicalPrices, loading }: AESOInvestmentPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AESO Investment Panel</CardTitle>
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
        <CardTitle>AESO Investment Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Investment Opportunities</h3>
            {marketAnalytics.investment_opportunities.length > 0 ? (
              <div className="space-y-2">
                {marketAnalytics.investment_opportunities.map((opportunity, index) => (
                  <div key={index} className="p-2 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <p className="font-medium">{opportunity.type}</p>
                    <p className="text-sm text-muted-foreground">Priority: {opportunity.priority}</p>
                    <p className="text-sm">{opportunity.reason}</p>
                    <p className="text-sm font-medium text-green-600">{opportunity.potential_return}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No investment opportunities identified at this time.</p>
            )}
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Overall Risk Level: <span className="font-medium">{marketAnalytics.risk_assessment.overall_risk_level}</span>
            </p>
            {marketAnalytics.risk_assessment.risks.slice(0, 3).map((risk, index) => (
              <div key={index} className="text-sm mb-1">
                <span className="font-medium">{risk.type}:</span> {risk.level} - {risk.impact}
              </div>
            ))}
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Market Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Price Volatility: {(historicalPrices.statistics.price_volatility * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Historical Records: {historicalPrices.statistics.total_records.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}