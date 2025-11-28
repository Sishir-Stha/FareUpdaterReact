import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  filters: {
    sector: string;
    bookingClass: string;
    fareCode: string;
    flightDate: string;
    currency: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="bg-card rounded-lg shadow-soft p-4 md:p-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Sector</label>
          <Input
            placeholder="e.g. KTM-DEL"
            value={filters.sector}
            onChange={(e) => onFilterChange('sector', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Booking Class</label>
          <Input
            placeholder="e.g. Y, M, B"
            value={filters.bookingClass}
            onChange={(e) => onFilterChange('bookingClass', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Fare Code</label>
          <Input
            placeholder="e.g. YOWRT"
            value={filters.fareCode}
            onChange={(e) => onFilterChange('fareCode', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Flight Date</label>
          <Input
            type="date"
            value={filters.flightDate}
            onChange={(e) => onFilterChange('flightDate', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Currency</label>
          <Select
            value={filters.currency}
            onValueChange={(value) => onFilterChange('currency', value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="NPR">NPR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
