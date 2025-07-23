import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown, Target, Eye, Edit, Trash2 } from 'lucide-react';
import { useVoltMarketPortfolio } from '@/hooks/useVoltMarketPortfolio';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItemForm } from './PortfolioItemForm';
import { PortfolioAnalytics } from './PortfolioAnalytics';
import { PortfolioCreationModal } from './PortfolioCreationModal';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart';
import { PortfolioItemsList } from './PortfolioItemsList';
import { PortfolioItem } from '@/types/portfolio';

export const PortfolioDashboard: React.FC = () => {
  const portfolioHook = useVoltMarketPortfolio();
  const { portfolios, loading, getPortfolioItems, deletePortfolioItem, deletePortfolio } = portfolioHook || {
    portfolios: [],
    loading: false,
    getPortfolioItems: async () => [],
    deletePortfolioItem: async () => {},
    deletePortfolio: async () => {}
  };
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

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      try {
        await deletePortfolioItem(itemId);
        toast({
          title: "Success",
          description: "Portfolio item deleted successfully"
        });
        loadPortfolioItems();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio item",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeletePortfolio = async (portfolioId: string, portfolioName: string) => {
    if (confirm(`Are you sure you want to delete "${portfolioName}" and all its items? This action cannot be undone.`)) {
      try {
        await deletePortfolio(portfolioId);
        toast({
          title: "Success",
          description: "Portfolio deleted successfully"
        });
        setSelectedPortfolio(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio",
          variant: "destructive"
        });
      }
    }
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
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Portfolio Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your energy infrastructure investments
            </p>
          </div>
          <Button 
            onClick={() => setShowCreatePortfolio(true)} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2 border-border bg-card/50">
            <CardContent className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">No Portfolios Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Create your first portfolio to start tracking your energy infrastructure investments and monitor performance
                </p>
              </div>
              <Button 
                onClick={() => setShowCreatePortfolio(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card 
                key={portfolio.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border bg-card overflow-hidden"
                onClick={() => setSelectedPortfolio(portfolio.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardContent className="p-6 relative">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {portfolio.name}
                        </h3>
                        <div className="mt-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {portfolio.portfolio_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                        <span className="font-bold text-lg text-foreground">
                          {formatCurrency(portfolio.total_value)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Risk Tolerance</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-medium border-2 ${
                              portfolio.risk_tolerance === 'conservative' ? 'border-green-200 text-green-700 bg-green-50' :
                              portfolio.risk_tolerance === 'moderate' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              portfolio.risk_tolerance === 'aggressive' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                              'border-red-200 text-red-700 bg-red-50'
                            }`}
                          >
                            {portfolio.risk_tolerance}
                          </Badge>
                        </div>
                        
                        {portfolio.metrics && (
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Return</div>
                            <div className={`font-bold text-sm flex items-center justify-center gap-1 ${
                              portfolio.metrics.returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {portfolio.metrics.returnPercentage >= 0 ? 
                                <TrendingUp className="h-3 w-3" /> : 
                                <TrendingDown className="h-3 w-3" />
                              }
                              {portfolio.metrics.returnPercentage >= 0 ? '+' : ''}
                              {portfolio.metrics.returnPercentage.toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200"
                      size="sm"
                    >
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setSelectedPortfolio(null)}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
          >
            ← Back
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {selectedPortfolioData?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                {selectedPortfolioData?.portfolio_type}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  selectedPortfolioData?.risk_tolerance === 'conservative' ? 'border-green-200 text-green-700' :
                  selectedPortfolioData?.risk_tolerance === 'moderate' ? 'border-blue-200 text-blue-700' :
                  selectedPortfolioData?.risk_tolerance === 'aggressive' ? 'border-orange-200 text-orange-700' :
                  'border-red-200 text-red-700'
                }`}
              >
                {selectedPortfolioData?.risk_tolerance} risk
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedPortfolio && selectedPortfolioData && handleDeletePortfolio(selectedPortfolio, selectedPortfolioData.name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg">
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

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border p-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-max sm:min-w-0 bg-transparent">
              <TabsTrigger value="overview" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="holdings" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Holdings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Performance
              </TabsTrigger>
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

        <TabsContent value="holdings" className="space-y-6 mt-6">
          <PortfolioItemsList
            items={portfolioItems}
            onAddItem={() => setShowAddItemForm(true)}
            onDeleteItem={handleDeleteItem}
            formatCurrency={formatCurrency}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {selectedPortfolioData && (
            <PortfolioAnalytics 
              portfolio={selectedPortfolioData} 
              items={portfolioItems} 
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <PortfolioPerformanceChart 
            data={[
              { date: '2024-01-01', value: 2200000, benchmark: 2100000, return: 0 },
              { date: '2024-02-01', value: 2280000, benchmark: 2150000, return: 3.6 },
              { date: '2024-03-01', value: 2350000, benchmark: 2200000, return: 6.8 },
              { date: '2024-04-01', value: 2420000, benchmark: 2250000, return: 10.0 },
              { date: '2024-05-01', value: 2500000, benchmark: 2300000, return: 13.6 }
            ]}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">1.45</div>
                <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">-2.3%</div>
                <p className="text-xs text-muted-foreground mt-1">Largest peak-to-trough decline</p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Volatility</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">8.2%</div>
                <p className="text-xs text-muted-foreground mt-1">Annualized standard deviation</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};