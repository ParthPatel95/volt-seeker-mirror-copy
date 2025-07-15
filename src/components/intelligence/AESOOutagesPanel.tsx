import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AESOOutagesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Outages Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Real-time outage monitoring and management for Alberta grid.
        </p>
      </CardContent>
    </Card>
  );
}