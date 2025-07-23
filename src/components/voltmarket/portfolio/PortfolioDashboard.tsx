import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, DollarSign, Target, Activity, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useVoltMarketPortfolio } from '@/hooks/useVoltMarketPortfolio';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItemForm } from './PortfolioItemForm';
import { PortfolioAnalytics } from './PortfolioAnalytics';

interface PortfolioItem {
  id: string;
  name: string;
  item_type: string;
  acquisition_price?: number;
  current_value?: number;
  acquisition_date?: string;
  status: string;
  notes?: string;
  metadata: Record<string, any>;
  added_at: string;
  updated_at: string;
}

export const PortfolioDashboard: React.FC = () => {
  const { portfolios, loading, getPortfolioItems } = useVoltMarketPortfolio();
  const { toast } = useToast();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio);

  useEffect(() => {
    if (selectedPortfolio) {
      loadPortfolioItems();
    }
  }, [selectedPortfolio]);

  const loadPortfolioItems = async () => {
    if (!selectedPortfolio) return;
    
    try {
      const items = await getPortfolioItems(selectedPortfolio);
      setPortfolioItems(items || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive"
      });
    }
  };

  const handleItemAdded = () => {
    setShowAddItemForm(false);
    loadPortfolioItems();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'sold': return 'secondary';
      case 'under_contract': return 'outline';
      case 'monitoring': return 'destructive';
      default: return 'outline';
    }
  };

  const getReturnColor = (item: PortfolioItem) => {
    if (!item.acquisition_price || !item.current_value) return 'text-muted-foreground';
    const returnAmount = item.current_value - item.acquisition_price;
    if (returnAmount > 0) return 'text-emerald-600';
    if (returnAmount < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const calculateReturn = (item: PortfolioItem) => {
    if (!item.acquisition_price || !item.current_value) return 0;
    return ((item.current_value - item.acquisition_price) / item.acquisition_price) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  if (!selectedPortfolio) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6" onClick={() => setSelectedPortfolio(portfolio.id)}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{portfolio.name}</h3>
                    <Badge variant="outline">{portfolio.portfolio_type}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="font-medium">{formatCurrency(portfolio.total_value)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Tolerance</span>
                      <Badge variant="secondary">{portfolio.risk_tolerance}</Badge>
                    </div>
                    
                    {portfolio.metrics && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Return</span>
                        <span className={`font-medium ${portfolio.metrics.returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {portfolio.metrics.returnPercentage >= 0 ? '+' : ''}
                          {portfolio.metrics.returnPercentage.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedPortfolio(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Portfolios
          </Button>
          <h1 className="text-3xl font-bold">{selectedPortfolioData?.name}</h1>
        </div>
        
        <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Portfolio Item</DialogTitle>
            </DialogHeader>
            <PortfolioItemForm
              portfolioId={selectedPortfolio}
              onItemAdded={handleItemAdded}
              onCancel={() => setShowAddItemForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {selectedPortfolioData && (
            <PortfolioAnalytics 
              portfolio={selectedPortfolioData} 
              items={portfolioItems} 
            />
          )}
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Portfolio Holdings ({portfolioItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No items in this portfolio yet</p>
                  <Button onClick={() => setShowAddItemForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline">{item.item_type}</Badge>
                            <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {item.metadata.location && (
                              <span>📍 {item.metadata.location}</span>
                            )}
                            {item.metadata.powerCapacity && (
                              <span>⚡ {item.metadata.powerCapacity}MW</span>
                            )}
                            {item.metadata.sector && (
                              <span>🏭 {item.metadata.sector}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          {item.acquisition_price && (
                            <div className="text-sm text-muted-foreground">
                              Acquired: {formatCurrency(item.acquisition_price)}
                            </div>
                          )}
                          {item.current_value && (
                            <div className="font-medium">
                              Current: {formatCurrency(item.current_value)}
                            </div>
                          )}
                          {item.acquisition_price && item.current_value && (
                            <div className={`text-sm font-medium ${getReturnColor(item)}`}>
                              {calculateReturn(item) >= 0 ? '+' : ''}
                              {calculateReturn(item).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-3 text-sm text-muted-foreground border-t pt-3">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {selectedPortfolioData && (
            <PortfolioAnalytics 
              portfolio={selectedPortfolioData} 
              items={portfolioItems} 
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Advanced performance analysis coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};