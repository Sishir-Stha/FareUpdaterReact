import React from 'react';
import { FareRecord } from '@/data/dummyFares';
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
import { useIsMobile } from '@/hooks/use-mobile';

interface FareTableProps {
  fares: FareRecord[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectRow: (id: string) => void;
}

// Mobile Card View
const FareCard: React.FC<{
  fare: FareRecord;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ fare, isSelected, onSelect }) => {
  const isMobile = useIsMobile();

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
              {fare.currency === 'NPR' ? 'रू' : '$'} {fare.fareAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-sm"> {/* Changed to flex-col */}
            <div className="flex items-center justify-between"> {/* Flex container for CC and Button/Flight */}
              <div>
                <span className="text-muted-foreground">CC: </span>
                <span className="text-foreground">{fare.cc}</span>
              </div>
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="default" size="xs"> {/* Removed ml-100 */}
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
                      <p><span className="font-medium text-muted-foreground">Validated Flights:</span> {fare.validatedFlight}</p>
                      <p><span className="font-medium text-muted-foreground">Fare Code:</span> {fare.fareCode}</p>
                      <p><span className="font-medium text-muted-foreground">Booking Class:</span> {fare.bookingClass}</p>
                      <p><span className="font-medium text-muted-foreground">Flight Dates:</span> {fare.fltDateFrom} to {fare.fltDateTo}</p>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {!isMobile && (
                <div>
                  <span className="text-muted-foreground">Flight: </span>
                  <span className="text-foreground">{fare.validatedFlight}</span>
                </div>
              )}
            </div>
            <div> {/* This div is for Date, moved out of col-span-2 */}
              <span className="text-muted-foreground">Date: </span>
              <span className="text-foreground">{fare.fltDateFrom} → {fare.fltDateTo}</span>
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
}) => {
  const allSelected = fares.length > 0 && selectedIds.size === fares.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < fares.length;

  if (fares.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-soft p-8 md:p-12 text-center animate-fade-in">
        <p className="text-muted-foreground">No rows to display</p>
        <p className="text-sm text-muted-foreground mt-1">Use the search filters above to find fare records</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-lg shadow-soft overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/10">
                <TableHead className="w-12">
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
                </TableHead>
                <TableHead className="font-semibold text-foreground">Sector</TableHead>
                <TableHead className="font-semibold text-foreground">CC</TableHead>
                <TableHead className="font-semibold text-foreground">Flt Date From</TableHead>
                <TableHead className="font-semibold text-foreground">Flt Date To</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Fare Amount</TableHead>
                <TableHead className="font-semibold text-foreground">Validated Flight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fares.map((fare) => (
                <TableRow
                  key={fare.id}
                  className={`transition-colors ${
                    selectedIds.has(fare.id) ? 'bg-primary/10' : ''
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(fare.id)}
                      onCheckedChange={() => onSelectRow(fare.id)}
                      aria-label={`Select row ${fare.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{fare.sector}</TableCell>
                  <TableCell>{fare.cc}</TableCell>
                  <TableCell>{fare.fltDateFrom}</TableCell>
                  <TableCell>{fare.fltDateTo}</TableCell>
                  <TableCell className="text-right font-medium">
                    {fare.currency === 'NPR' ? 'रू' : '$'} {fare.fareAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>{fare.validatedFlight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
            <span className="text-sm font-medium text-muted-foreground">
              Select all ({fares.length})
            </span>
          </div>
          {selectedIds.size > 0 && (
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        {/* Fare Cards */}
        {fares.map((fare) => (
          <FareCard
            key={fare.id}
            fare={fare}
            isSelected={selectedIds.has(fare.id)}
            onSelect={() => onSelectRow(fare.id)}
          />
        ))}
      </div>
    </>
  );
};

export default FareTable;
