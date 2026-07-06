import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin } from 'lucide-react';
import type { Listing } from '../../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);

export default function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const [bookmarked, setBookmarked] = React.useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={onClick}
      className="group relative flex flex-col rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/40 cursor-pointer overflow-hidden transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          initial={false}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500"
        />

        <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-sm">
          {listing.category}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-zinc-900 transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${bookmarked ? 'fill-red-500 text-red-500' : 'text-zinc-600 dark:text-zinc-400'}`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px] leading-snug line-clamp-1">
            {listing.title}
          </h3>
          {listing.rating && (
            <div className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {listing.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {listing.distance && (
          <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>{listing.distance.toFixed(1)} mi away</span>
          </div>
        )}

        <div className="mt-auto pt-1.5">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(listing.price)}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400"> / day</span>
        </div>
      </div>
    </motion.div>
  );
}
