import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown, Target, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItem } from '@/types/portfolio';

export const PortfolioDashboard: React.FC = () => {
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for now to prevent white screen
  useEffect(() => {
    setLoading(false);
    setPortfolios([]);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                        {portfolio.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium bg-primary/10 text-primary mt-2"
                      >
                        {portfolio.portfolio_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                      <span className="font-bold text-lg text-foreground">
                        {formatCurrency(portfolio.total_value || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
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

      {/* Placeholder for portfolio creation modal */}
      {showCreatePortfolio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Portfolio creation coming soon...</p>
              <Button 
                onClick={() => setShowCreatePortfolio(false)}
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};