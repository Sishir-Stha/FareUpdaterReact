import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FareRecord } from '@/data/dummyFares';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFares: FareRecord[];
  onSubmit: (data: EditFormData) => Promise<void>;
}

export interface EditFormData {
  fltDateFrom: string;
  fltDateTo: string;
  fareAmount: string;
  editType: 'Update' | 'Copy';
  validOnFlight: string;
}

const EditForm: React.FC<{
  formData: EditFormData;
  onChange: (key: keyof EditFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  selectedCount: number;
}> = ({ formData, onChange, onSubmit, onClose, isLoading, selectedCount }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Editing {selectedCount} fare record(s)
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Flight Date From
        </label>
        <Input
          type="date"
          value={formData.fltDateFrom}
          onChange={(e) => onChange('fltDateFrom', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Flight Date To
        </label>
        <Input
          type="date"
          value={formData.fltDateTo}
          onChange={(e) => onChange('fltDateTo', e.target.value)}
          required
        />
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        Fare Amount
      </label>
      <Input
        type="number"
        placeholder="Enter fare amount"
        value={formData.fareAmount}
        onChange={(e) => onChange('fareAmount', e.target.value)}
        required
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        Edit Type
      </label>
      <Select
        value={formData.editType}
        onValueChange={(value) => onChange('editType', value as 'Update' | 'Copy')}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Update">Update</SelectItem>
          <SelectItem value="Copy">Copy</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        Valid On Flight
      </label>
      <Input
        value={formData.validOnFlight}
        onChange={(e) => onChange('validOnFlight', e.target.value)}
        placeholder="Flight numbers"
      />
    </div>

    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Updating...' : 'Submit'}
      </Button>
    </div>
  </form>
);

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  selectedFares,
  onSubmit,
}) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<EditFormData>({
    fltDateFrom: '',
    fltDateTo: '',
    fareAmount: '',
    editType: 'Update',
    validOnFlight: selectedFares.map((f) => f.validatedFlight).join(', '),
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (selectedFares.length > 0) {
      setFormData((prev) => ({
        ...prev,
        validOnFlight: selectedFares.map((f) => f.validatedFlight).join(', '),
      }));
    }
  }, [selectedFares]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof EditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Use Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-semibold text-primary">
              Edit Selected Fares
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto pb-safe">
            <EditForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClose={onClose}
              isLoading={isLoading}
              selectedCount={selectedFares.length}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Edit Selected Fares
          </DialogTitle>
        </DialogHeader>
        <EditForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={onClose}
          isLoading={isLoading}
          selectedCount={selectedFares.length}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
