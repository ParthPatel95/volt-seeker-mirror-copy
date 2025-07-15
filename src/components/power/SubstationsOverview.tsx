import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SubstationsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Substations Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Comprehensive power infrastructure analysis and monitoring dashboard.
        </p>
      </CardContent>
    </Card>
  );
}