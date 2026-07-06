import { useState, useMemo } from 'react';
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

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 28, mass: 0.8 } },
  exit: { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { y: 32, opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    y: 0, opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 24, delay: i * 0.05 },
  }),
};

const shimmerVariants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
  },
};

function Content() {
  const { view, listings, selectListing, loading, showCategories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = useMemo(
    () => selectedCategory === 'All' ? listings : listings.filter(l => l.category === selectedCategory),
    [listings, selectedCategory]
  );

  return (
    <motion.div
      className="h-screen w-screen overflow-hidden bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <ListingDrawer />

      <AnimatePresence mode="wait">
        {view === 'host' ? (
          <motion.div
            key="host"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full pt-16 overflow-y-auto"
          >
            <HostForm />
          </motion.div>
        ) : view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full pt-16 overflow-y-auto"
          >
            <DashboardView />
          </motion.div>
        ) : (
          <motion.div
            key="browse"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full pt-16 relative"
          >
            {/* Search bar — always visible */}
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
            >
              <MapSearch />
            </motion.div>

            {/* Category pills — only when toggled */}
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="fixed top-28 left-1/2 -translate-x-1/2 z-30"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating card strip at bottom */}
            <div className={`absolute bottom-4 left-4 right-4 z-10 ${showCategories ? 'mt-24' : ''}`}>
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="min-w-[240px] snap-start shrink-0"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                        >
                          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <motion.div
                              className="h-36 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%]"
                              variants={shimmerVariants}
                              initial="initial"
                              animate="animate"
                            />
                            <div className="p-3 space-y-2">
                              <div className="h-3 w-16 bg-zinc-200 rounded-full" />
                              <div className="h-4 w-28 bg-zinc-200 rounded" />
                              <div className="h-3 w-20 bg-zinc-200 rounded" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    : filteredListings.map((item, i) => (
                        <motion.div
                          key={item.id}
                          className="min-w-[240px] snap-start shrink-0"
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <ListingCard listing={item} onClick={() => selectListing(item)} />
                        </motion.div>
                      ))}
                </div>
              </div>
            </div>

            {/* Map fills the screen behind */}
            <motion.div
              className="absolute inset-0 pt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <MapView />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </motion.div>
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
