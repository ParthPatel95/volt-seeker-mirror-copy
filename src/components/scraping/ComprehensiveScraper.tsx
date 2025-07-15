import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComprehensiveScraperProps {
  onPropertiesFound?: (count: number) => void;
}

export function ComprehensiveScraper({ onPropertiesFound }: ComprehensiveScraperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Scraper</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Multi-source property data scraping and aggregation.
        </p>
      </CardContent>
    </Card>
  );
}