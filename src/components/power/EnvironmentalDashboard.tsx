import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EnvironmentalDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Environmental impact analysis and sustainability metrics.
        </p>
      </CardContent>
    </Card>
  );
}