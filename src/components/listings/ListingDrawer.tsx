import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);

export default function ListingDrawer() {
  const { selectedListing, drawerOpen, setDrawerOpen, handleBook } = useApp();

  if (!selectedListing) return null;

  const { title, category, description, price, rating, hostName, hostAvatar, distance } = selectedListing;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white dark:bg-zinc-900 shadow-2xl sm:w-[480px]"
          >
            <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-sm">
                {category}
              </span>

              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-zinc-900 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex flex-col gap-4 p-6 pb-24">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    {rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {distance && (
                      <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{distance.toFixed(1)} mi away</span>
                      </div>
                    )}
                  </div>
                </div>

                {(hostName || hostAvatar) && (
                  <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <Avatar
                      src={hostAvatar}
                      alt={hostName || 'Host'}
                      size="md"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Hosted by {hostName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(price)}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400"> / day</span>
                  </div>
                </div>

                {description && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBook(selectedListing.id)}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-shadow"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
