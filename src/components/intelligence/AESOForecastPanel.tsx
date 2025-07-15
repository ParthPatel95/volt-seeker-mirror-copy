import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AESOForecastPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Forecast Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Energy forecasting and predictive analytics for Alberta market.
        </p>
      </CardContent>
    </Card>
  );
}