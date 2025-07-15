import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AESOInvestmentPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AESO Investment Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Investment opportunities and market intelligence for Alberta energy sector.
        </p>
      </CardContent>
    </Card>
  );
}