import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useVoltMarketPortfolio } from '@/hooks/useVoltMarketPortfolio';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Target, TrendingUp } from 'lucide-react';

interface PortfolioCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioCreationModal: React.FC<PortfolioCreationModalProps> = ({
  open,
  onOpenChange
}) => {
  const { createPortfolio } = useVoltMarketPortfolio();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    portfolioType: 'investment' as 'investment' | 'development' | 'trading' | 'research',
    riskTolerance: 'moderate' as 'conservative' | 'moderate' | 'aggressive' | 'speculative',
    targetAllocation: {
      solar: 30,
      wind: 25,
      storage: 20,
      other: 25
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createPortfolio({
        name: formData.name,
        description: formData.description,
        portfolio_type: formData.portfolioType,
        risk_tolerance: formData.riskTolerance,
      });

      toast({
        title: "Success",
        description: "Portfolio created successfully"
      });

      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        portfolioType: 'investment',
        riskTolerance: 'moderate',
        targetAllocation: { solar: 30, wind: 25, storage: 20, other: 25 }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAllocation = (sector: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      targetAllocation: {
        ...prev.targetAllocation,
        [sector]: value
      }
    }));
  };

  const totalAllocation = Object.values(formData.targetAllocation).reduce((sum, val) => sum + val, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Create New Portfolio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Portfolio Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Energy Infrastructure Portfolio"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your investment strategy and goals..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Portfolio Type</Label>
                  <Select
                    value={formData.portfolioType}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, portfolioType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  <Select
                    value={formData.riskTolerance}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, riskTolerance: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="speculative">Speculative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4" />
                Target Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData.targetAllocation).map(([sector, value]) => (
                <div key={sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize">{sector}</Label>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateAllocation(sector, newValue[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Total Allocation</span>
                <span className={`text-sm font-medium ${totalAllocation === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {totalAllocation}%
                </span>
              </div>
              
              {totalAllocation !== 100 && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  Note: Total allocation should equal 100% for optimal portfolio balance
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Creating..." : "Create Portfolio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};