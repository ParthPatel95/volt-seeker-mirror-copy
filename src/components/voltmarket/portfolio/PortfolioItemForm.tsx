import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PortfolioItemFormProps {
  portfolioId: string;
  onItemAdded: () => void;
  onCancel: () => void;
}

export const PortfolioItemForm: React.FC<PortfolioItemFormProps> = ({
  portfolioId,
  onItemAdded,
  onCancel
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [acquisitionDate, setAcquisitionDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    itemType: 'investment' as 'listing' | 'investment' | 'opportunity' | 'research',
    acquisitionPrice: '',
    currentValue: '',
    notes: '',
    location: '',
    powerCapacity: '',
    sector: '',
    riskLevel: 'moderate' as 'low' | 'moderate' | 'high',
    expectedReturn: '',
    timeHorizon: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // This would integrate with the portfolio hook
      const itemData = {
        portfolioId,
        itemType: formData.itemType,
        name: formData.name,
        acquisitionPrice: formData.acquisitionPrice ? parseFloat(formData.acquisitionPrice) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        acquisitionDate: acquisitionDate?.toISOString(),
        notes: formData.notes,
        metadata: {
          location: formData.location,
          powerCapacity: formData.powerCapacity ? parseFloat(formData.powerCapacity) : undefined,
          sector: formData.sector,
          riskLevel: formData.riskLevel,
          expectedReturn: formData.expectedReturn ? parseFloat(formData.expectedReturn) : undefined,
          timeHorizon: formData.timeHorizon
        }
      };

      // Integration point with existing portfolio hook
      // await addPortfolioItem(itemData);
      
      toast({
        title: "Success",
        description: "Portfolio item added successfully"
      });
      
      onItemAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Portfolio Item
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Solar Farm Project A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemType">Type</Label>
              <Select value={formData.itemType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, itemType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionPrice">Acquisition Price ($)</Label>
              <Input
                id="acquisitionPrice"
                type="number"
                step="0.01"
                value={formData.acquisitionPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, acquisitionPrice: e.target.value }))}
                placeholder="1,000,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value ($)</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                placeholder="1,200,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Acquisition Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {acquisitionDate ? format(acquisitionDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={acquisitionDate}
                    onSelect={setAcquisitionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Texas, USA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="powerCapacity">Power Capacity (MW)</Label>
              <Input
                id="powerCapacity"
                type="number"
                step="0.1"
                value={formData.powerCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, powerCapacity: e.target.value }))}
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                placeholder="Solar, Wind, Storage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="moderate">Moderate Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Expected Return (%)</Label>
              <Input
                id="expectedReturn"
                type="number"
                step="0.1"
                value={formData.expectedReturn}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                placeholder="8.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Time Horizon</Label>
              <Input
                id="timeHorizon"
                value={formData.timeHorizon}
                onChange={(e) => setFormData(prev => ({ ...prev, timeHorizon: e.target.value }))}
                placeholder="5 years"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this investment..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Item"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};