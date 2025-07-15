import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface QuickSearchSectionProps {
  quickSearchTerm: string;
  onQuickSearchChange: (value: string) => void;
}

export function QuickSearchSection({ quickSearchTerm, onQuickSearchChange }: QuickSearchSectionProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Quick search companies..."
        value={quickSearchTerm}
        onChange={(e) => onQuickSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}