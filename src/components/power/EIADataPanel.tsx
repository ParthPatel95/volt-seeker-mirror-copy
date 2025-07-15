import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EIADataPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EIA Data Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Energy Information Administration data analysis and visualization.
        </p>
      </CardContent>
    </Card>
  );
}