import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainContentTabsProps {
  companies: any[];
  selectedCompany: any;
  loading: boolean;
  loadingStates: any;
  searchTerm: string;
  industryFilter: string;
  distressAlerts: any[];
  aiAnalysis: any;
  storedAiAnalyses: any[];
  onAnalyze: (companyName: string, ticker?: string) => void;
  onAIAnalysisComplete: (analysis: any) => void;
  onSearchChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onSelectCompany: (company: any) => void;
  onInvestigateAlert: (alert: any) => void;
}

export function MainContentTabs(props: MainContentTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Corporate Intelligence Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive corporate intelligence and market analysis platform.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="companies">
        <Card>
          <CardHeader>
            <CardTitle>Companies Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Company research and analysis tools.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="alerts">
        <Card>
          <CardHeader>
            <CardTitle>Distress Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Real-time monitoring and alert system.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analysis">
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AI-powered corporate intelligence and insights.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}