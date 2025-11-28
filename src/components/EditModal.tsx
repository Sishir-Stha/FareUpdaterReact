import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FareRecord } from '@/data/dummyFares';

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

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  selectedFares,
  onSubmit,
}) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Edit Selected Fares ({selectedFares.length})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Flight Date From
              </label>
              <Input
                type="date"
                value={formData.fltDateFrom}
                onChange={(e) => handleChange('fltDateFrom', e.target.value)}
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
                onChange={(e) => handleChange('fltDateTo', e.target.value)}
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
              onChange={(e) => handleChange('fareAmount', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Edit Type
            </label>
            <Select
              value={formData.editType}
              onValueChange={(value) => handleChange('editType', value as 'Update' | 'Copy')}
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
              onChange={(e) => handleChange('validOnFlight', e.target.value)}
              placeholder="Flight numbers"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Updating...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
