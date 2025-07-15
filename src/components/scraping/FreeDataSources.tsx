import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FreeDataSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Free Data Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Access free public data sources and APIs.
        </p>
      </CardContent>
    </Card>
  );
}