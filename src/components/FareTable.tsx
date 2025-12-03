import React from 'react';
import { Plane } from 'lucide-react'; // Import Plane icon
import { FareRecord, FareListData } from '@/data/FareDataList';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'; // Import pagination components
import { useIsMobile } from '@/hooks/use-mobile';

interface FareTableProps {
  fares: FareRecord[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectRow: (fareId: string) => void;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Mobile Card View
const FareCard: React.FC<{
  fare: FareRecord;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ fare, isSelected, onSelect }) => {
  const isMobile = useIsMobile();

  // Extract booking class and fare code from bookRcd
  const bookRcdParts = fare.bookRcd.split(' / ');
  const bookingClass = bookRcdParts[0] || '';
  const fareCode = bookRcdParts[1] || '';


  return (
    <Card
      className={`p-4 transition-all ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">{fare.sector}</span>
            <span className="font-semibold text-primary">
              Rs {parseFloat(fare.fareAmount).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-sm"> {/* Changed to flex-col */}
            <div className="flex items-center justify-between"> {/* Flex container for CC and Button/Flight */}
              <div>
                <span className="text-muted-foreground">Booking Class: </span>
                <span className="text-foreground">{bookingClass}</span>
              </div>
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="default" size="xs">
                      View Flights
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Flight Details for {fare.sector}</SheetTitle>
                      <SheetDescription>
                        Detailed flight information for this fare record.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 text-sm text-foreground space-y-2">
                      <p><span className="font-medium text-muted-foreground">Validated Flights:</span> {fare.ValidOnFlight || 'N/A'}</p>
                      <p><span className="font-medium text-muted-foreground">Fare Code:</span> {fareCode}</p>
                      <p><span className="font-medium text-muted-foreground">Booking Class:</span> {bookingClass}</p>
                      <p><span className="font-medium text-muted-foreground">Flight Dates:</span> {fare.flightDateFrom} to {fare.flightDateTo}</p>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {!isMobile && (
                <div>
                  <span className="text-muted-foreground">Flight: </span>
                  <span className="text-foreground">{fare.ValidOnFlight || 'N/A'}</span>
                </div>
              )}
            </div>
            <div> {/* This div is for Date, moved out of col-span-2 */}
              <span className="text-muted-foreground">Date: </span>
              <span className="text-foreground">{fare.flightDateFrom} → {fare.flightDateTo}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const FareTable: React.FC<FareTableProps> = ({
  fares,
  selectedIds,
  onSelectAll,
  onSelectRow,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const allSelected = fares.length > 0 && selectedIds.size === fares.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < fares.length;

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-soft p-8 md:p-12 text-center animate-fade-in">
        <Plane className="mx-auto h-12 w-12 text-primary animate-bounce" />
        <p className="text-muted-foreground mt-4">Loading fare data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (fares.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-soft p-8 md:p-12 text-center animate-fade-in">
        <p className="text-muted-foreground">No rows to display</p>
        <p className="text-sm text-muted-foreground mt-1">Use the search filters above to find fare records</p>
      </div>
    );
  }

  const renderPagination = () => (
    <Pagination className="mt-4 px-4 py-2"> {/* Added px-4 py-2 for padding */}
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i + 1)}
              isActive={currentPage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-lg shadow-soft animate-slide-up"> {/* Removed overflow-hidden */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/10">
                <TableHead className="w-40"> {/* Increased width to accommodate text */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          (el as HTMLButtonElement).dataset.state = someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked';
                        }
                      }}
                      onCheckedChange={onSelectAll}
                      aria-label="Select all"
                    />
                    {selectedIds.size > 0 && (
                      <span className="text-sm font-medium text-muted-foreground">
                        {selectedIds.size} selected
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Sector</TableHead>
                <TableHead className="font-semibold text-foreground">Booking Class / Fare Code</TableHead>
                <TableHead className="font-semibold text-foreground">Flight Date From</TableHead>
                <TableHead className="font-semibold text-foreground">Flight Date To</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Fare Amount</TableHead>
                <TableHead className="font-semibold text-foreground">Valid On Flight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fares.map((fare) => (
                <TableRow
                  key={fare.fareId}
                  className={`transition-colors ${
                    selectedIds.has(fare.fareId) ? 'bg-primary/10' : ''
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(fare.fareId)}
                      onCheckedChange={() => onSelectRow(fare.fareId)}
                      aria-label={`Select row ${fare.fareId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{fare.sector}</TableCell>
                  <TableCell>{fare.bookRcd}</TableCell>
                  <TableCell>{fare.flightDateFrom.split(' ')[0]}</TableCell> {/* Only date part */}
                  <TableCell>{fare.flightDateTo.split(' ')[0]}</TableCell>   {/* Only date part */}
                  <TableCell className="text-right font-medium">
                    Rs {parseFloat(fare.fareAmount).toLocaleString()}
                  </TableCell>
                  <TableCell>{fare.ValidOnFlight || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && renderPagination()}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 animate-slide-up">
        {/* Select All Header */}
        <div className="flex items-center justify-between bg-card rounded-lg shadow-soft p-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
            {selectedIds.size > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {selectedIds.size} selected
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Total Fares: {fares.length}
          </span>
        </div>

        {/* Fare Cards */}
        {fares.map((fare) => (
          <FareCard
            key={fare.fareId}
            fare={fare}
            isSelected={selectedIds.has(fare.fareId)}
            onSelect={() => onSelectRow(fare.fareId)}
          />
        ))}
        {totalPages > 1 && renderPagination()}
      </div>
    </>
  );
};

export default FareTable;
