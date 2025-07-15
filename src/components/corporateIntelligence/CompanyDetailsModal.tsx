import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CompanyDetailsModalProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailsModal({ company, open, onOpenChange }: CompanyDetailsModalProps) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{company.name || 'Company Details'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Detailed company information and analysis will be displayed here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}