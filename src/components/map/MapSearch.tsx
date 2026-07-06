import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geocodeSearch } from '../../services/api';
import type { SearchResult } from '../../types';
import { useApp } from '../../context/AppContext';

export default function MapSearch({ className = '' }: { className?: string }) {
  const { setMapCenter, setSelectedLocation } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const data = await geocodeSearch(q);
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => handleSearch(value), 300);
    },
    [handleSearch]
  );

  const onSelect = useCallback(
    (r: SearchResult) => {
      const latlng: [number, number] = [parseFloat(r.lat), parseFloat(r.lon)];
      setMapCenter(latlng);
      setSelectedLocation(latlng);
      setQuery(r.display_name);
      setOpen(false);
    },
    [setMapCenter, setSelectedLocation]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-56 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder="Search places..."
        className="w-full px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/90 transition-all"
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden"
          >
            {loading && (
              <li className="px-4 py-2.5 text-sm text-gray-400 text-center">
                Searching...
              </li>
            )}
            {!loading &&
              results.map((r, i) => (
                <li
                  key={i}
                  onClick={() => onSelect(r)}
                  className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-white/70 transition-colors truncate"
                >
                  {r.display_name}
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
