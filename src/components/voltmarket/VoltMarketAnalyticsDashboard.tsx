import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VoltMarketAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>VoltMarket Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced analytics and insights for the VoltMarket platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}