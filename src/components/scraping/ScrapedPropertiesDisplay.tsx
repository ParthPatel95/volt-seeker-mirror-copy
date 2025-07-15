import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ScrapedPropertiesDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scraped Properties Display</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Display and management of scraped property data.
        </p>
      </CardContent>
    </Card>
  );
}