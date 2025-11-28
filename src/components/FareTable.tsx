import React from 'react';
import { FareRecord } from '@/data/dummyFares';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FareTableProps {
  fares: FareRecord[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectRow: (id: string) => void;
}

const FareTable: React.FC<FareTableProps> = ({
  fares,
  selectedIds,
  onSelectAll,
  onSelectRow,
}) => {
  const allSelected = fares.length > 0 && selectedIds.size === fares.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < fares.length;

  return (
    <div className="bg-card rounded-lg shadow-soft overflow-hidden animate-slide-up">
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
            {fares.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No rows to display
                </TableCell>
              </TableRow>
            ) : (
              fares.map((fare) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FareTable;
