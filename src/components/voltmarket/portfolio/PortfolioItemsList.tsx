import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, Edit, Trash2, Target } from 'lucide-react';
import { PortfolioItem } from '@/types/portfolio';

interface PortfolioItemsListProps {
  items: PortfolioItem[];
  onAddItem: () => void;
  onDeleteItem: (itemId: string, itemName: string) => void;
  formatCurrency: (amount: number) => string;
  getStatusBadgeVariant: (status: string) => 'default' | 'secondary' | 'outline' | 'destructive';
}

export const PortfolioItemsList: React.FC<PortfolioItemsListProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  formatCurrency,
  getStatusBadgeVariant
}) => {
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

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Portfolio Holdings 
          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No items yet</h3>
            <p className="text-muted-foreground mb-6">Add your first investment to start tracking performance</p>
            <Button 
              onClick={onAddItem}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`border border-border rounded-lg p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:border-primary/20 bg-card ${
                  index % 2 === 0 ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-3 min-w-0 flex-1">
                    {/* Title and Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-base text-foreground">{item.name}</h4>
                      <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                        {item.item_type}
                      </Badge>
                      <Badge 
                        variant={getStatusBadgeVariant(item.status)} 
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {item.metadata.location && (
                        <div className="flex items-center gap-1">
                          <span className="text-primary">📍</span>
                          <span>{item.metadata.location}</span>
                        </div>
                      )}
                      {item.metadata.powerCapacity && (
                        <div className="flex items-center gap-1">
                          <span className="text-primary">⚡</span>
                          <span>{item.metadata.powerCapacity}MW</span>
                        </div>
                      )}
                      {item.metadata.sector && (
                        <div className="flex items-center gap-1">
                          <span className="text-primary">🏭</span>
                          <span className="capitalize">{item.metadata.sector}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Financial Info and Actions */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {item.acquisition_price && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Acquired</div>
                          <div className="font-medium text-sm">
                            {formatCurrency(item.acquisition_price)}
                          </div>
                        </div>
                      )}
                      {item.current_value && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Current</div>
                          <div className="font-semibold text-base text-foreground">
                            {formatCurrency(item.current_value)}
                          </div>
                        </div>
                      )}
                      {item.acquisition_price && item.current_value && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Return</div>
                          <div className={`font-bold text-sm flex items-center gap-1 ${getReturnColor(item)}`}>
                            {calculateReturn(item) >= 0 ? 
                              <TrendingUp className="h-3 w-3" /> : 
                              <TrendingDown className="h-3 w-3" />
                            }
                            {calculateReturn(item) >= 0 ? '+' : ''}
                            {calculateReturn(item).toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(item.id, item.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {item.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                      {item.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};