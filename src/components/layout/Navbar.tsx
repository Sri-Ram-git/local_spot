import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Bell, MessageCircle, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const update = () => {
      const scrollY = window.scrollY;
      setAtTop(scrollY < 10);
      if (scrollY > lastScrollY && scrollY > 60) setDirection('down');
      else if (scrollY < lastScrollY) setDirection('up');
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { direction, atTop };
}

export default function Navbar() {
  const { direction, atTop } = useScrollDirection();
  const { setView } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHidden = direction === 'down' && !atTop && !mobileOpen;

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setView('browse')}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-lg font-semibold tracking-tight text-zinc-900">
                LocalSpot
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button onClick={() => setView('browse')} className="px-4 py-1.5 text-sm font-medium text-zinc-900 bg-zinc-100 rounded-full">
                Explore
              </button>
              <button onClick={() => alert('Categories coming soon')} className="px-4 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                Categories
              </button>
              <Button variant="ghost" size="sm" onClick={() => setView('host')}>
                Become a Host
              </Button>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 text-zinc-500" onClick={() => alert('Search feature')}>
                <Search className="w-4 h-4" />
                <span className="text-xs">Search</span>
              </Button>
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" size="sm" className="!p-2" onClick={() => alert('No notifications')}>
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="!p-2" onClick={() => alert('No messages')}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="cursor-pointer" onClick={() => setView('dashboard')}>
                <Avatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face"
                  alt="Profile"
                  size="sm"
                />
              </div>
              <Button variant="ghost" size="sm" className="md:!hidden !p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                <button onClick={() => { setView('browse'); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-100">
                  Explore
                </button>
                <button onClick={() => { alert('Categories'); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-100">
                  Categories
                </button>
                <button onClick={() => { setView('host'); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-100">
                  Become a Host
                </button>
                <hr className="my-2 border-zinc-200" />
                <button onClick={() => { setView('dashboard'); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-100">
                  Dashboard
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
