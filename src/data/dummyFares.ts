export interface FareRecord {
  fareId: string;
  sector: string;
  bookRcd: string; // Renamed from cc
  fareAmount: string; // Changed to string based on API response
  flightDateFrom: string; // Renamed from fltDateFrom
  flightDateTo: string; // Renamed from fltDateTo
  ValidOnFlight: string | null; // Renamed from validatedFlight
}

export const dummyFares: FareRecord[] = []; // Removed dummy data
