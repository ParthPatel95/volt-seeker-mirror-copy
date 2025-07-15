import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AIPropertyScraper() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Property Scraper</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          AI-powered property data collection and analysis.
        </p>
      </CardContent>
    </Card>
  );
}