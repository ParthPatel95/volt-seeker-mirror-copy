import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ERCOTDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ERCOT Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Electric Reliability Council of Texas market data and analytics.
        </p>
      </CardContent>
    </Card>
  );
}