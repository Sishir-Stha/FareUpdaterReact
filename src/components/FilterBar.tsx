import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface FilterBarProps {
  filters: {
    origin: string;
    destination: string;
    fareCode: string;
    bookingClass: string;
    flightDate: string;
    currency: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const FilterFields: React.FC<{
  filters: FilterBarProps['filters'];
  onFilterChange: FilterBarProps['onFilterChange'];
  isMobile?: boolean;
}> = ({ filters, onFilterChange, isMobile }) => (
  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'}`}>
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Origin</label>
      <Select
        value={filters.origin}
        onValueChange={(value) => onFilterChange('origin', value)}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select origin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="KTM">KTM</SelectItem>
          <SelectItem value="PKR">PKR</SelectItem>
          <SelectItem value="BIR">BIR</SelectItem>
          <SelectItem value="BWA">BWA</SelectItem>
          <SelectItem value="BDP">BDP</SelectItem>
          <SelectItem value="KEP">KEP</SelectItem>
          <SelectItem value="JKR">JKR</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Destination</label>
      <Select
        value={filters.destination}
        onValueChange={(value) => onFilterChange('destination', value)}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="KTM">KTM</SelectItem>
          <SelectItem value="PKR">PKR</SelectItem>
          <SelectItem value="BIR">BIR</SelectItem>
          <SelectItem value="BWA">BWA</SelectItem>
          <SelectItem value="BDP">BDP</SelectItem>
          <SelectItem value="KEP">KEP</SelectItem>
          <SelectItem value="JKR">JKR</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Fare Code</label>
    <Select
       value={filters.fareCode}
       onValueChange={(value) => onFilterChange('fareCode', value)}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select FareCode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="E1">E1</SelectItem>
          <SelectItem value="EE">EE</SelectItem>
          <SelectItem value="V">V</SelectItem>
          <SelectItem value="J">J</SelectItem>
          <SelectItem value="H">H</SelectItem>
          <SelectItem value="S">S</SelectItem>
          <SelectItem value="F">F</SelectItem>
          <SelectItem value="G">G</SelectItem>
          <SelectItem value="Y">Y</SelectItem>
          <SelectItem value="N">N</SelectItem>
        </SelectContent>
      </Select>
    </div>


    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Booking Class</label>
        <Select
       value={filters.bookingClass}
       onValueChange={(value) => onFilterChange('bookingClass', value)}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select BookingClass" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="E">E</SelectItem>
          <SelectItem value="D">D</SelectItem>
          <SelectItem value="V">V</SelectItem>
          <SelectItem value="J">J</SelectItem>
          <SelectItem value="H">H</SelectItem>
          <SelectItem value="S">S</SelectItem>
          <SelectItem value="F">F</SelectItem>
          <SelectItem value="G">G</SelectItem>
          <SelectItem value="Y">Y</SelectItem>
          <SelectItem value="N">N</SelectItem>
        </SelectContent>
      </Select>
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
        defaultValue="NPR" // Set default value to NPR
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NPR">NPR</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onSearch, onClear }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMobileSearch = () => {
    onSearch();
    setIsOpen(false);
  };

  const hasFilters =
    filters.origin ||
    filters.destination ||
    filters.bookingClass ||
    filters.fareCode ||
    filters.flightDate ||
    filters.currency;

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-card rounded-lg shadow-soft p-4 lg:p-6 animate-fade-in">
        <FilterFields filters={filters} onFilterChange={onFilterChange} />
        <div className="flex gap-3 mt-4 justify-end">
          {hasFilters && (
            <Button variant="outline" onClick={onClear} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
          <Button onClick={onSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="md:hidden bg-card rounded-lg shadow-soft p-4 animate-fade-in">
        <div className="flex gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
              <SheetHeader className="pb-4">
                <SheetTitle>Filter Fares</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 overflow-y-auto pb-4">
                <FilterFields filters={filters} onFilterChange={onFilterChange} isMobile />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                {hasFilters && (
                  <Button variant="outline" onClick={onClear} className="flex-1">
                    Clear
                  </Button>
                )}
                <Button onClick={handleMobileSearch} className="flex-1 gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={onSearch} className="flex-1 gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
