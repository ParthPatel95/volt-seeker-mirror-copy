import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown, DollarSign, Target, Activity, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useVoltMarketPortfolio } from '@/hooks/useVoltMarketPortfolio';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItemForm } from './PortfolioItemForm';
import { PortfolioAnalytics } from './PortfolioAnalytics';
import { PortfolioCreationModal } from './PortfolioCreationModal';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart';

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
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio Dashboard</h1>
          <Button onClick={() => setShowCreatePortfolio(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Portfolios Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first portfolio to start tracking your energy infrastructure investments
                  </p>
                </div>
                <Button onClick={() => setShowCreatePortfolio(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-4 sm:p-6" onClick={() => setSelectedPortfolio(portfolio.id)}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{portfolio.name}</h3>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {portfolio.portfolio_type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Value</span>
                        <span className="font-medium text-sm sm:text-base">
                          {formatCurrency(portfolio.total_value)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Tolerance</span>
                        <Badge variant="secondary" className="text-xs">
                          {portfolio.risk_tolerance}
                        </Badge>
                      </div>
                      
                      {portfolio.metrics && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Return</span>
                          <span className={`font-medium text-sm flex items-center gap-1 ${
                            portfolio.metrics.returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {portfolio.metrics.returnPercentage >= 0 ? 
                              <TrendingUp className="h-3 w-3" /> : 
                              <TrendingDown className="h-3 w-3" />
                            }
                            {portfolio.metrics.returnPercentage >= 0 ? '+' : ''}
                            {portfolio.metrics.returnPercentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="outline" className="w-full text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PortfolioCreationModal 
          open={showCreatePortfolio} 
          onOpenChange={setShowCreatePortfolio} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedPortfolio(null)}
            className="text-muted-foreground hover:text-foreground p-2 sm:px-3"
          >
            ← Back
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
            {selectedPortfolioData?.name}
          </h1>
        </div>
        
        <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-max sm:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="holdings" className="text-xs sm:text-sm">Holdings</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {selectedPortfolioData && (
            <PortfolioAnalytics 
              portfolio={selectedPortfolioData} 
              items={portfolioItems} 
            />
          )}
        </TabsContent>

        <TabsContent value="holdings" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
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
                    <div key={item.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">{item.item_type}</Badge>
                            <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                            {item.metadata.location && (
                              <span className="flex items-center gap-1">
                                📍 <span className="truncate">{item.metadata.location}</span>
                              </span>
                            )}
                            {item.metadata.powerCapacity && (
                              <span>⚡ {item.metadata.powerCapacity}MW</span>
                            )}
                            {item.metadata.sector && (
                              <span>🏭 {item.metadata.sector}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-left sm:text-right space-y-1 min-w-0">
                          {item.acquisition_price && (
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Acquired: {formatCurrency(item.acquisition_price)}
                            </div>
                          )}
                          {item.current_value && (
                            <div className="font-medium text-sm sm:text-base">
                              Current: {formatCurrency(item.current_value)}
                            </div>
                          )}
                          {item.acquisition_price && item.current_value && (
                            <div className={`text-xs sm:text-sm font-medium ${getReturnColor(item)}`}>
                              {calculateReturn(item) >= 0 ? '+' : ''}
                              {calculateReturn(item).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-3 text-xs sm:text-sm text-muted-foreground border-t pt-3">
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

        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <PortfolioPerformanceChart 
            data={[
              { date: '2024-01-01', value: 2200000, benchmark: 2100000, return: 0 },
              { date: '2024-02-01', value: 2280000, benchmark: 2150000, return: 3.6 },
              { date: '2024-03-01', value: 2350000, benchmark: 2200000, return: 6.8 },
              { date: '2024-04-01', value: 2420000, benchmark: 2250000, return: 10.0 },
              { date: '2024-05-01', value: 2500000, benchmark: 2300000, return: 13.6 }
            ]}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">1.45</div>
                <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-red-600">-2.3%</div>
                <p className="text-xs text-muted-foreground">Largest peak-to-trough decline</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">8.2%</div>
                <p className="text-xs text-muted-foreground">Annualized standard deviation</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};