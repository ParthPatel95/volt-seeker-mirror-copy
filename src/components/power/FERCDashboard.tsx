import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FERCDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FERC Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Federal Energy Regulatory Commission data and compliance monitoring.
        </p>
      </CardContent>
    </Card>
  );
}