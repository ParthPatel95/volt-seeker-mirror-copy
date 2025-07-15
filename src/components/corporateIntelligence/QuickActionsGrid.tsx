import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Building2, Search } from 'lucide-react';

export function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="w-full">
            Analyze
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Distress Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="w-full">
            Monitor
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Research
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="w-full">
            Research
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="w-4 h-4" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="w-full">
            Generate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}