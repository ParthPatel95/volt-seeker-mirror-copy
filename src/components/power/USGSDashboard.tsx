import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function USGSDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>USGS Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          United States Geological Survey data integration and analysis.
        </p>
      </CardContent>
    </Card>
  );
}