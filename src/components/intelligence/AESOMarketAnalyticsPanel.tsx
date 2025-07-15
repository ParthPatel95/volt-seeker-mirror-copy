import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AESOMarketAnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Market Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Alberta Electric System Operator market analytics and insights.
        </p>
      </CardContent>
    </Card>
  );
}