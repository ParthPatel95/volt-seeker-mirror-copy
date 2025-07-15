import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AESOAlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Alerts Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          System alerts and notifications for Alberta energy market.
        </p>
      </CardContent>
    </Card>
  );
}