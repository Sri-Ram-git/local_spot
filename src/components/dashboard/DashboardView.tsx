import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, List, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Booking } from '../../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  React.useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.4, ease: 'easeOut' });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

function StatCard({ icon, value, label, suffix }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-lg p-5 flex items-center gap-4"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
          <AnimatedCounter value={value} />
          {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function getStatus(listingCategory: string): 'upcoming' | 'past' {
  const upcomingCategories = ['event', 'workshop', 'tour'];
  return upcomingCategories.includes(listingCategory.toLowerCase()) ? 'upcoming' : 'past';
}

function BookingItem({ booking, index }: { booking: Booking; index: number }) {
  const status = getStatus(booking.listing.category);
  const isUpcoming = status === 'upcoming';

  const gradients = [
    'from-indigo-400 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-cyan-500',
  ];
  const gradient = gradients[index % gradients.length];

  const date = new Date(booking.bookedAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer"
    >
      <div
        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {booking.listing.title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              {booking.listing.category}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {formattedDate}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            isUpcoming
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {isUpcoming ? 'Confirmed' : 'Completed'}
        </span>
      </div>
    </motion.div>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5">
        <Calendar className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        No bookings yet
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-xs">
        Discover unique spots and experiences to book your next adventure.
      </p>
      <button
        onClick={onExplore}
        className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
      >
        Explore Spots
      </button>
    </motion.div>
  );
}

export default function DashboardView() {
  const { bookings, listings, setView } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      const bDate = new Date(b.bookedAt);
      return tab === 'upcoming' ? bDate >= now : bDate < now;
    });
  }, [bookings, tab]);

  const tabs = [
    { key: 'upcoming' as const, label: 'Upcoming' },
    { key: 'past' as const, label: 'Past' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-4xl px-4 py-8 pb-28"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your bookings and listings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <StatCard icon={<Calendar className="h-5 w-5" />} value={bookings.length} label="Total Bookings" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} value={listings.length} label="Active Listings" />
        <StatCard icon={<Clock className="h-5 w-5" />} value={2025} label="Member Since" />
      </div>

      <motion.div variants={itemVariants} className="rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-lg p-5">
        <div className="flex items-center gap-4 mb-5">
          <List className="h-4 w-4 text-zinc-400" />
          <div className="relative flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  tab === t.key
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {tab === t.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-md bg-white dark:bg-zinc-700 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto tabular-nums">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredBookings.map((booking, i) => (
              <BookingItem key={booking.id} booking={booking} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState onExplore={() => setView('browse')} />
        )}
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setView('host')}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors font-semibold text-sm"
      >
        <span className="text-lg leading-none">+</span>
        Host a Spot
      </motion.button>
    </motion.div>
  );
}
