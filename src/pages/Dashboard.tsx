import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plane, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FilterBar from '@/components/FilterBar';
import FareTable from '@/components/FareTable';
import EditModal, { EditFormData } from '@/components/EditModal';
import { FareRecord, FareListData } from '@/data/FareDataList';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    fareCode: 'E1',
    bookingClass: 'E',
    flightDate: '',
    currency: 'NPR', // Default currency set to NPR
  });

  const [fares, setFares] = useState<FareRecord[]>([]);
  const [filteredFares, setFilteredFares] = useState<FareRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      origin: '',
      destination: '',
      fareCode: 'E1',
      bookingClass: 'E',
      flightDate: '',
      currency: 'NPR', // Default currency set to NPR
    });
  };

  const handleSearch = async () => {
    setError(null);
    setIsLoading(true);
    setFares([]);
    setFilteredFares([]);
    setSelectedIds(new Set());

    const requestBody = {
      sector:
        filters.origin && filters.destination
          ? `${filters.origin}${filters.destination}`
          : '',
      bookingClassRcd: filters.bookingClass,
      fareCode: filters.fareCode,
      flightDate: filters.flightDate,
      currency: filters.currency === 'ALL' ? 'npr' : filters.currency.toLowerCase(), // Default to NPR if ALL is selected
    };

    console.log('Request body being sent to API:', requestBody);

    try {
      if (!filters.origin || !filters.destination) {
        throw new Error('Please select both Origin and Destination before searching.');
      }

      const response = await fetch('https://fareupdate.yetiairlines.com:8443/api/v1/updater/getFareData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: FareRecord[] = await response.json();

      if (data.length === 0) {
        setError('The fare doesn\'t exist i.e is null');
      }

    setFares(data);
    setFilteredFares(data); // Initially, filtered fares are all fetched fares
    setCurrentPage(1); // Reset to first page on new search
    toast({
      title: 'Search Complete',
      description: `Found ${data.length} fare record(s)`,
    });
    } catch (err) {
      console.error('Error fetching fare data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fare data.');
      toast({
        title: 'Search Failed',
        description: err instanceof Error ? err.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredFares.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFares.map((fare) => fare.fareId)));
    }
  };

  const handleSelectRow = (fareId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(fareId)) {
      newSelected.delete(fareId);
    } else {
      newSelected.add(fareId);
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


  const totalPages = Math.ceil(filteredFares.length / itemsPerPage);
  const currentFares = filteredFares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selectedFares = filteredFares.filter((fare) => selectedIds.has(fare.fareId)); // Use fareId now

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

        {/* Action Bar (desktop) - above table */}
        {selectedIds.size > 0 && (
          <div className="hidden md:flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} row(s) selected
            </span>
            <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Selected
            </Button>
          </div>
        )}

        {/* Data Table */}
        <FareTable
          fares={currentFares} // Pass paginated fares
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      {/* Loading and Error Indicators */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-soft">
            <Plane className="h-12 w-12 text-primary animate-bounce" />
            <p className="text-lg font-medium text-foreground">Fetching fare data...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action Bar for Mobile */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden animate-slide-up z-20">
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
      />
    </div>
  );
};

export default Dashboard;
