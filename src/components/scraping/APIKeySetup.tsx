import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function APIKeySetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure API keys for data source integrations.
        </p>
      </CardContent>
    </Card>
  );
}