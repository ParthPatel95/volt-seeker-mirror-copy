import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AESOWindSolarForecast } from '@/hooks/useAESOEnhancedData';

interface AESOForecastPanelProps {
  windSolarForecast: AESOWindSolarForecast;
  loading: boolean;
}

export function AESOForecastPanel({ windSolarForecast, loading }: AESOForecastPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AESO Forecast Panel</CardTitle>
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
        <CardTitle>AESO Forecast Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Wind Forecast</h3>
            <p className="text-sm text-muted-foreground">
              {windSolarForecast.forecasts.reduce((sum, f) => sum + f.wind_forecast_mw, 0).toFixed(0)} MW total
            </p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Solar Forecast</h3>
            <p className="text-sm text-muted-foreground">
              {windSolarForecast.forecasts.reduce((sum, f) => sum + f.solar_forecast_mw, 0).toFixed(0)} MW total
            </p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Total Renewable</h3>
            <p className="text-sm text-muted-foreground">
              {windSolarForecast.forecasts.reduce((sum, f) => sum + f.total_renewable_forecast_mw, 0).toFixed(0)} MW
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 border rounded">
          <p className="text-sm text-muted-foreground">
            {windSolarForecast.total_forecasts} forecast points available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}