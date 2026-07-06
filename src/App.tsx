import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import MapSearch from './components/map/MapSearch';
import MapView from './components/map/MapView';
import ListingCard from './components/listings/ListingCard';
import ListingDrawer from './components/listings/ListingDrawer';
import DashboardView from './components/dashboard/DashboardView';
import HostForm from './components/host/HostForm';
import { ToastContainer } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

const queryClient = new QueryClient();

const CATEGORIES = ['All', 'Study Desk', 'Board Game', 'Garage Sale'];

function Content() {
  const { view, listings, selectListing, loading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = selectedCategory === 'All'
    ? listings
    : listings.filter(l => l.category === selectedCategory);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-50">
      <Navbar />
      <ListingDrawer />

      <AnimatePresence mode="wait">
        {view === 'host' ? (
          <motion.div
            key="host"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full pt-16 overflow-y-auto"
          >
            <HostForm />
          </motion.div>
        ) : view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full pt-16 overflow-y-auto"
          >
            <DashboardView />
          </motion.div>
        ) : (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full pt-16 relative"
          >
            {/* Search bar below header */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <MapSearch />
            </div>

            {/* Category pills */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
              <div className="flex gap-1.5 bg-white/70 backdrop-blur-xl rounded-xl px-2.5 py-1.5 shadow-md border border-white/40">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating card strip at bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[240px] snap-start shrink-0">
                          <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                            <div className="h-36 bg-gradient-to-br from-zinc-200 to-zinc-300" />
                            <div className="p-3 space-y-2">
                              <div className="h-3 w-16 bg-zinc-200 rounded-full" />
                              <div className="h-4 w-28 bg-zinc-200 rounded" />
                              <div className="h-3 w-20 bg-zinc-200 rounded" />
                            </div>
                          </div>
                        </div>
                      ))
                    : filteredListings.map((item) => (
                        <motion.div
                          key={item.id}
                          className="min-w-[240px] snap-start shrink-0"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                        >
                          <ListingCard listing={item} onClick={() => selectListing(item)} />
                        </motion.div>
                      ))}
                </div>
              </div>
            </div>

            {/* Map fills the screen behind */}
            <div className="absolute inset-0 pt-0">
              <MapView />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Content />
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
