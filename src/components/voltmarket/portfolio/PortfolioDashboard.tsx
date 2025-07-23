import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { useVoltMarketPortfolio } from '@/hooks/useVoltMarketPortfolio';
import { useToast } from '@/hooks/use-toast';
import { PortfolioCreationModal } from './PortfolioCreationModal';

export const PortfolioDashboard: React.FC = () => {
  const { portfolios, loading, fetchPortfolios } = useVoltMarketPortfolio();
  const { toast } = useToast();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);

  useEffect(() => {
    fetchPortfolios();
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
                        {formatCurrency(portfolio.total_value || 0)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Risk</div>
                        <Badge 
                          variant="outline" 
                          className="text-xs font-medium"
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
};