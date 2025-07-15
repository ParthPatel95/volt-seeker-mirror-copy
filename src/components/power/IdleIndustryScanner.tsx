import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function IdleIndustryScanner() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Idle Industry Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Identify idle industrial facilities and infrastructure opportunities.
        </p>
      </CardContent>
    </Card>
  );
}