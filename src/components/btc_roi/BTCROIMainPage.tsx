import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BTCROIMainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>BTC ROI Lab</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Bitcoin ROI analysis and cryptocurrency investment intelligence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}