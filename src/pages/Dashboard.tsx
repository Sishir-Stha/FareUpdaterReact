import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plane, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FilterBar from '@/components/FilterBar';
import FareTable from '@/components/FareTable';
import EditModal, { EditFormData } from '@/components/EditModal';
import { dummyFares, FareRecord } from '@/data/dummyFares';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    sector: '',
    bookingClass: '',
    fareCode: '',
    flightDate: '',
    currency: 'ALL',
  });

  const [fares, setFares] = useState<FareRecord[]>(dummyFares);
  const [filteredFares, setFilteredFares] = useState<FareRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sector: '',
      bookingClass: '',
      fareCode: '',
      flightDate: '',
      currency: 'ALL',
    });
  };

  const handleSearch = () => {
    let results = [...fares];

    if (filters.sector) {
      results = results.filter((fare) =>
        fare.sector.toLowerCase().includes(filters.sector.toLowerCase())
      );
    }

    if (filters.bookingClass) {
      results = results.filter((fare) =>
        fare.bookingClass.toLowerCase().includes(filters.bookingClass.toLowerCase())
      );
    }

    if (filters.fareCode) {
      results = results.filter((fare) =>
        fare.fareCode.toLowerCase().includes(filters.fareCode.toLowerCase())
      );
    }

    if (filters.flightDate) {
      results = results.filter(
        (fare) =>
          fare.fltDateFrom <= filters.flightDate && fare.fltDateTo >= filters.flightDate
      );
    }

    if (filters.currency !== 'ALL') {
      results = results.filter((fare) => fare.currency === filters.currency);
    }

    setFilteredFares(results);
    setSelectedIds(new Set());

    toast({
      title: 'Search Complete',
      description: `Found ${results.length} fare record(s)`,
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredFares.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFares.map((fare) => fare.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
      duration: 2000, // Set duration to 2 seconds (2000ms)
    });
    navigate('/');
  };

  const handleEditSubmit = async (data: EditFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update fares
    const updatedFares = fares.map((fare) => {
      if (selectedIds.has(fare.id)) {
        return {
          ...fare,
          fltDateFrom: data.fltDateFrom || fare.fltDateFrom,
          fltDateTo: data.fltDateTo || fare.fltDateTo,
          fareAmount: data.fareAmount ? parseFloat(data.fareAmount) : fare.fareAmount,
          validatedFlight: data.validOnFlight || fare.validatedFlight,
        };
      }
      return fare;
    });

    if (data.editType === 'Copy') {
      // Create copies of selected fares
      const copies = filteredFares
        .filter((fare) => selectedIds.has(fare.id))
        .map((fare) => ({
          ...fare,
          id: `${fare.id}-copy-${Date.now()}`,
          fltDateFrom: data.fltDateFrom || fare.fltDateFrom,
          fltDateTo: data.fltDateTo || fare.fltDateTo,
          fareAmount: data.fareAmount ? parseFloat(data.fareAmount) : fare.fareAmount,
          validatedFlight: data.validOnFlight || fare.validatedFlight,
        }));
      updatedFares.push(...copies);
    }

    setFares(updatedFares);
    setFilteredFares(
      updatedFares.filter((fare) =>
        filteredFares.some((f) => f.id === fare.id) || data.editType === 'Copy'
      )
    );

    setIsEditModalOpen(false);
    setSelectedIds(new Set());

    toast({
      title: 'Success',
      description: `${selectedIds.size} fare(s) ${data.editType === 'Copy' ? 'copied' : 'updated'} successfully`,
    });
  };

  const selectedFares = filteredFares.filter((fare) => selectedIds.has(fare.id));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img src="/dashboardLogo.png" alt="Logo" className="w-[50px] h-[50px] " />
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold text-foreground truncate">FARE Update System</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Welcome, <span className="font-medium text-primary">{user?.username}</span>
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout} size="sm" className="gap-1.5 shrink-0">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        {/* Data Table */}
        <FareTable
          fares={filteredFares}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
        />
      </main>

      {/* Fixed Bottom Action Bar for Mobile */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:relative md:container md:mx-auto md:border md:rounded-lg md:mt-4 animate-slide-up z-20">
          <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} row(s) selected
            </span>
            <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Selected
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedFares={selectedFares}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default Dashboard;
