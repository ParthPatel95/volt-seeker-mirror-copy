import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FreeDataSourcesProps {
  onPropertiesFound?: (count: number) => void;
}

export function FreeDataSources({ onPropertiesFound }: FreeDataSourcesProps) {
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