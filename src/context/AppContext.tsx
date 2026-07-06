import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Listing, Booking, ViewType } from '../types';
import * as api from '../services/api';

interface AppState {
  listings: Listing[];
  bookings: Booking[];
  view: ViewType;
  mapCenter: [number, number];
  selectedLocation: [number, number] | null;
  selectedListing: Listing | null;
  drawerOpen: boolean;
  loading: boolean;
}

interface AppContextType extends AppState {
  setView: (v: ViewType) => void;
  setMapCenter: (c: [number, number]) => void;
  setSelectedLocation: (l: [number, number] | null) => void;
  selectListing: (l: Listing | null) => void;
  setDrawerOpen: (o: boolean) => void;
  refreshListings: () => void;
  refreshBookings: () => void;
  handleDelete: (id: number) => Promise<void>;
  handleBook: (id: number) => Promise<void>;
  handleCreateListing: (data: Partial<Listing>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<ViewType>('browse');
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshListings = useCallback(async () => {
    try {
      const data = await api.fetchListings();
      setListings(data);
    } catch { /* ignore */ }
  }, []);

  const refreshBookings = useCallback(async () => {
    try {
      const data = await api.fetchBookings();
      setBookings(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    Promise.all([refreshListings(), refreshBookings()]).finally(() => setLoading(false));
  }, [refreshListings, refreshBookings]);

  const selectListing = useCallback((listing: Listing | null) => {
    setSelectedListing(listing);
    setDrawerOpen(!!listing);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    await api.deleteListing(id);
    await refreshListings();
  }, [refreshListings]);

  const handleBook = useCallback(async (id: number) => {
    await api.createBooking(id);
    await refreshBookings();
  }, [refreshBookings]);

  const handleCreateListing = useCallback(async (data: Partial<Listing>) => {
    await api.createListing(data);
    await refreshListings();
  }, [refreshListings]);

  return (
    <AppContext.Provider
      value={{
        listings, bookings, view, mapCenter, selectedLocation,
        selectedListing, drawerOpen, loading,
        setView, setMapCenter, setSelectedLocation, selectListing,
        setDrawerOpen, refreshListings, refreshBookings,
        handleDelete, handleBook, handleCreateListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
