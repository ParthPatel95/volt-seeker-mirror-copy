import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: string;
}

interface AESOAlertsPanelProps {
  alerts: Alert[];
  onDismissAlert: (alertId: string) => void;
  onClearAll: () => void;
}

export function AESOAlertsPanel({ alerts, onDismissAlert, onClearAll }: AESOAlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          AESO Alerts Panel
          {alerts.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">
            No active alerts. System monitoring for Alberta energy market.
          </p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDismissAlert(alert.id)}>
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}