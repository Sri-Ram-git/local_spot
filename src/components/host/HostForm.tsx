import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Monitor, Gamepad2, Tag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LocationPicker from '../map/LocationPicker';

const STEPS = ['Category', 'Location', 'Details', 'Preview'];

const CATEGORIES = [
  { value: 'Study Desk', icon: Monitor, desc: 'Quiet space for focused work' },
  { value: 'Board Game', icon: Gamepad2, desc: 'Fun and games with friends' },
  { value: 'Garage Sale', icon: Tag, desc: 'Declutter and sell items' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

export default function HostForm() {
  const { setView, selectedLocation, setSelectedLocation, handleCreateListing } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [category, setCategory] = useState<Category | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const nextStep = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const canProceed = (() => {
    switch (step) {
      case 0: return !!category;
      case 1: return !!selectedLocation;
      case 2: return title.trim().length > 0 && description.trim().length > 0 && Number(price) > 0;
      case 3: return true;
      default: return false;
    }
  })();

  const handlePublish = useCallback(async () => {
    if (!category || !selectedLocation) return;
    setPublishing(true);
    try {
      await handleCreateListing({
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        lat: selectedLocation[0],
        lng: selectedLocation[1],
      });
      setPublished(true);
      setTimeout(() => setView('browse'), 2000);
    } catch {
      /* ignore */
    } finally {
      setPublishing(false);
    }
  }, [category, selectedLocation, title, description, price, handleCreateListing, setView]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    i <= step
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    i <= step
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-3 h-0.5 w-12 sm:w-20 rounded-full transition-colors ${
                    i < step
                      ? 'bg-zinc-900 dark:bg-white'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    What kind of space are you hosting?
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Choose a category that best describes your listing.
                  </p>
                </div>
                <div className="grid gap-3">
                  {CATEGORIES.map(({ value: cat, icon: Icon, desc }) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                        category === cat
                          ? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800'
                          : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          category === cat
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-900 dark:text-white">{cat}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</div>
                      </div>
                      {category === cat && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Where is your space located?
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Click on the map to set your location.
                  </p>
                </div>
                <div className="h-[300px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <MapContainer
                    center={selectedLocation || [28.6139, 77.2090]}
                    zoom={12}
                    className="h-full w-full"
                    style={{ background: '#e8f4f8' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker position={selectedLocation} onLocationSelect={setSelectedLocation} />
                  </MapContainer>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Tell guests about your space
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Share what makes your place unique.
                  </p>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="e.g. Cozy study nook in downtown"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you're offering..."
                      rows={4}
                      className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white resize-none transition-colors"
                    />
                  </div>
                  <Input
                    label="Price per day ($)"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Preview your listing
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Review everything before publishing.
                  </p>
                </div>
                <div className="space-y-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Category</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Title</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Description</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">{description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Price</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">${Number(price).toFixed(2)} / day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Location</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {selectedLocation
                        ? `${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`
                        : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={step === 0 ? () => setView('browse') : prevStep}
          className="gap-1.5"
          size="md"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>

        {step < 3 ? (
          <Button onClick={nextStep} disabled={!canProceed} size="md" className="gap-1.5">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handlePublish} loading={publishing} disabled={publishing} size="md" className="gap-1.5">
            {publishing ? 'Publishing...' : 'Publish'}
          </Button>
        )}
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {published && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                <Check className="h-10 w-10 text-white" />
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                Your listing has been published!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
