import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AESOAssetOutages } from '@/hooks/useAESOEnhancedData';

interface AESOOutagesPanelProps {
  assetOutages: AESOAssetOutages;
  loading: boolean;
}

export function AESOOutagesPanel({ assetOutages, loading }: AESOOutagesPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AESO Outages Panel</CardTitle>
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
        <CardTitle>AESO Outages Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Total Outages</p>
            <p className="text-2xl font-bold">{assetOutages.total_outages}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Total Capacity</p>
            <p className="text-2xl font-bold">{assetOutages.total_outage_capacity_mw.toFixed(0)} MW</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-2xl font-bold">{new Date(assetOutages.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
        
        {assetOutages.outages.length === 0 ? (
          <p className="text-muted-foreground">
            No active outages. Real-time monitoring for Alberta grid.
          </p>
        ) : (
          <div className="space-y-2">
            {assetOutages.outages.map((outage, index) => (
              <div key={index} className="p-3 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{outage.asset_name}</p>
                    <p className="text-sm text-muted-foreground">{outage.outage_type}</p>
                    <p className="text-xs text-muted-foreground">
                      Started: {outage.start_date}
                      {outage.end_date && ` • Ended: ${outage.end_date}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Status: {outage.status}</p>
                    {outage.reason && <p className="text-xs text-muted-foreground">Reason: {outage.reason}</p>}
                  </div>
                  <span className="text-sm font-medium">{outage.capacity_mw} MW</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}