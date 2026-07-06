import type { Listing, Booking, SearchResult } from '../types';

const API_URL = '/api';

export async function fetchListings(): Promise<Listing[]> {
  const res = await fetch(`${API_URL}/listings`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function createListing(data: Partial<Listing>): Promise<Listing> {
  const res = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return res.json();
}

export async function deleteListing(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/listings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete listing');
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function createBooking(listingId: number): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingId }),
  });
  if (!res.ok) throw new Error('Booking failed');
  return res.json();
}

export async function geocodeSearch(query: string): Promise<SearchResult[]> {
  const res = await fetch(`${API_URL}/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Geocode failed');
  return res.json();
}
