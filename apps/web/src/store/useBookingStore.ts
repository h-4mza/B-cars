import { create } from 'zustand';

interface BookingOptions {
  hasGps: boolean;
  hasBabySeat: boolean;
  hasExtraDriver: boolean;
}

interface Pricing {
  days: number;
  basePrice: number;
  optionsPrice: number;
  total: number;
  deposit: number;
}

interface BookingState {
  vehicleId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  options: BookingOptions;
  pricing: Pricing | null;
  
  setVehicleId: (id: string) => void;
  setDates: (start: Date | null, end: Date | null) => void;
  setOptions: (options: Partial<BookingOptions>) => void;
  setPricing: (pricing: Pricing | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  vehicleId: null,
  startDate: null,
  endDate: null,
  options: {
    hasGps: false,
    hasBabySeat: false,
    hasExtraDriver: false,
  },
  pricing: null,

  setVehicleId: (id) => set({ vehicleId: id }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setOptions: (newOptions) => set((state) => ({ 
    options: { ...state.options, ...newOptions } 
  })),
  setPricing: (pricing) => set({ pricing }),
  reset: () => set({
    vehicleId: null,
    startDate: null,
    endDate: null,
    options: {
      hasGps: false,
      hasBabySeat: false,
      hasExtraDriver: false,
    },
    pricing: null,
  }),
}));
