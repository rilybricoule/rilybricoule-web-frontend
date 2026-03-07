/**
 * MapPage.tsx — Real Google Maps JavaScript API integration
 *
 * ─── SETUP ──────────────────────────────────────────────────────────────────
 *
 * 1. INSTALL DEPENDENCIES:
 *    npm install @vis.gl/react-google-maps
 *    (framer-motion and lucide-react should already be installed)
 *
 * 2. ADD YOUR API KEY:
 *    Replace the string "YOUR_GOOGLE_MAPS_API_KEY" on line ~73 with your real key.
 *    OR (recommended) store it in your .env file:
 *      VITE_GOOGLE_MAPS_API_KEY=your_key_here   ← for Vite projects
 *      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key  ← for Next.js projects
 *    Then use: process.env.VITE_GOOGLE_MAPS_API_KEY  or  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 *
 * 3. ENABLE THESE APIS in Google Cloud Console:
 *    - Maps JavaScript API
 *    - (Optional) Places API — for future search autocomplete
 *
 * 4. WRAP YOUR APP (in App.tsx or _app.tsx):
 *    import { APIProvider } from '@vis.gl/react-google-maps';
 *    <APIProvider apiKey={YOUR_KEY}>
 *      <App />
 *    </APIProvider>
 *    NOTE: If you wrap the whole app, remove the <APIProvider> wrapper inside this file.
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  Star, X, BadgeCheck, ChevronRight, Clock, MapPin,
  Filter, Heart, Check, SlidersHorizontal, ChevronDown,
  Search, Zap, RefreshCw, ArrowLeft, ArrowRight,
} from 'lucide-react';
import type { Pro, Filters, ServiceCategory } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockdata';

// ─── 🔑 API KEY — Replace this with your real key or use env variable ────────
const GOOGLE_MAPS_API_KEY = 'AIzaSyAPfb93bmRpz_zRG9xvToYy_5kv39xyo4o';
// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;   // Vite
// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Next.js

// ─── Map center: Casablanca ──────────────────────────────────────────────────
const CASABLANCA_CENTER = { lat: 33.5893, lng: -7.6114 };

// ─── Custom map style (dark navy theme to match the UI) ──────────────────────
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#e8f0f7' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f9ff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a6fa5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f0f4fa' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dde8f5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a8c8e8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#c8e6c9' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

interface MapPageProps {
  filteredPros: Pro[];
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, val: Filters[K]) => void;
  onSelectPro: (pro: Pro) => void;
}

/* ─── Swipe Card ────────────────────────────────────────────────────────────── */
function SwipeCardMap({ pro, onSwipe, isTop, onView }: {
  pro: Pro; onSwipe: (d: 'left' | 'right') => void; isTop: boolean; onView: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOp = useTransform(x, [25, 110], [0, 1]);
  const nopeOp = useTransform(x, [-110, -25], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate, position: 'absolute', inset: 0, zIndex: isTop ? 2 : 1 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
      }}
      animate={isTop ? {} : { scale: 0.94, y: 12, zIndex: 1 }}
      className={`${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} select-none`}
    >
      <motion.div style={{ opacity: likeOp }}
        className="absolute top-8 left-8 z-30 rotate-[-20deg] border-4 border-green-500 rounded-2xl px-4 py-2 bg-white/10 backdrop-blur-sm">
        <p className="text-green-500 font-black text-2xl tracking-wide">LIKE 💚</p>
      </motion.div>
      <motion.div style={{ opacity: nopeOp }}
        className="absolute top-8 right-8 z-30 rotate-[20deg] border-4 border-red-500 rounded-2xl px-4 py-2 bg-white/10 backdrop-blur-sm">
        <p className="text-red-500 font-black text-2xl tracking-wide">NOPE ✕</p>
      </motion.div>

      <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className={`h-52 bg-gradient-to-br ${pro.avatarColor} relative flex items-center justify-center shrink-0`}>
          <div className="text-8xl font-black text-white/15 select-none">{pro.avatar}</div>
          <div className="absolute inset-x-4 bottom-4">
            <div className="bg-black/45 backdrop-blur-md rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="text-white font-black text-xl">{pro.name}</p>
                {pro.verified && <BadgeCheck size={16} className="text-blue-300" />}
              </div>
              <p className="text-white/75 text-sm mt-0.5">{pro.specialty}</p>
            </div>
          </div>
          {pro.available && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">● Disponible</div>
          )}
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-amber-50 rounded-xl py-3">
              <p className="font-bold text-amber-600 flex items-center justify-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />{pro.rating}
              </p>
              <p className="text-[11px] text-gray-400">{pro.reviews} avis</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-3">
              <p className="font-bold text-[#1E5BB8]">{pro.price}</p>
              <p className="text-[11px] text-gray-400">MAD/h</p>
            </div>
            <div className="text-center bg-green-50 rounded-xl py-3">
              <p className="font-bold text-green-700 text-sm">{pro.distance} km</p>
              <p className="text-[11px] text-gray-400">de vous</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">{pro.bio}</p>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {pro.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs bg-blue-50 text-[#1E5BB8] px-2.5 py-1 rounded-full font-semibold border border-blue-100">{t}</span>
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); onView(); }}
            className="w-full bg-[#1E5BB8] hover:bg-[#243B82] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20">
            Voir profil complet <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Swipe Overlay ─────────────────────────────────────────────────────────── */
function MapSwipeOverlay({ pros, onClose, onViewPro, onSwipeFinished }: {
  pros: Pro[]; onClose: () => void;
  onViewPro: (pro: Pro) => void;
  onSwipeFinished: (likedIds: number[]) => void;
}) {
  const [stack, setStack] = useState(() => [...pros].map(p => p.id));
  const [liked, setLiked] = useState<number[]>([]);
  const [showLiked, setShowLiked] = useState(false);

  const currentId = stack[stack.length - 1];
  const nextId = stack[stack.length - 2];
  const currentPro = pros.find(p => p.id === currentId);
  const nextPro = pros.find(p => p.id === nextId);
  const likedPros = pros.filter(p => liked.includes(p.id));

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentId) return;
    const newLiked = dir === 'right' ? [...liked, currentId] : liked;
    if (dir === 'right') setLiked(newLiked);
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    if (newStack.length === 0 && newLiked.length > 0) onSwipeFinished(newLiked);
  };

  const handleApply = () => { onSwipeFinished(liked); onClose(); };
  const handleReset = () => { setStack(pros.map(p => p.id)); setLiked([]); onSwipeFinished([]); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-[#1a2d5a]/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex flex-col items-center justify-center h-full px-4 py-4 pointer-events-none">

        {/* Top bar */}
        <div className="pointer-events-auto w-full max-w-md flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-white text-lg">Swipe les prestataires</h3>
            <p className="text-white/50 text-xs mt-0.5">
              {stack.length} restant{stack.length > 1 ? 's' : ''} · {liked.length} aimé{liked.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {liked.length > 0 && (
              <button onClick={() => setShowLiked(!showLiked)}
                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
                <Heart size={12} className="fill-red-400 text-red-400" /> {liked.length}
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl flex items-center justify-center transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Liked drawer */}
        <AnimatePresence>
          {showLiked && likedPros.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl p-4 mb-4 shadow-2xl overflow-hidden">
              <p className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Heart size={14} className="text-red-500 fill-red-500" /> Prestataires aimés
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {likedPros.map(p => (
                  <button key={p.id} onClick={() => { onViewPro(p); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors text-left">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow`}>{p.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.specialty}</p>
                    </div>
                    <span className="text-xs font-black text-[#1E5BB8]">{p.price} MAD</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card stack */}
        {stack.length === 0 ? (
          <div className="pointer-events-auto text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 w-full max-w-md">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-black text-white text-xl mb-2">Tout vu !</p>
            <p className="text-white/60 text-sm mb-6">
              {liked.length > 0
                ? `Vous avez aimé ${liked.length} prestataire${liked.length > 1 ? 's' : ''}. Ils apparaissent sur la carte.`
                : "Vous n'avez aimé aucun prestataire."}
            </p>
            {liked.length > 0 && (
              <button onClick={handleApply}
                className="w-full bg-[#1E5BB8] text-white font-black py-3 rounded-2xl text-sm mb-3 hover:bg-[#243B82] transition-colors shadow-lg">
                Voir sur la carte ({liked.length})
              </button>
            )}
            <button onClick={handleReset}
              className="flex items-center justify-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold mx-auto transition-colors">
              <RefreshCw size={13} /> Recommencer
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto w-full max-w-md" style={{ height: 500, position: 'relative' }}>
            {nextPro && (
              <div className="absolute inset-0 scale-[0.93] translate-y-4 pointer-events-none" style={{ zIndex: 1 }}>
                <div className={`h-full bg-gradient-to-br ${nextPro.avatarColor} rounded-3xl opacity-35`} />
              </div>
            )}
            {currentPro && (
              <SwipeCardMap key={currentPro.id} pro={currentPro} onSwipe={handleSwipe} isTop={true}
                onView={() => { onViewPro(currentPro); onClose(); }} />
            )}
          </div>
        )}

        {/* Swipe buttons */}
        {stack.length > 0 && (
          <>
            <div className="pointer-events-auto flex items-center gap-6 mt-5">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-white border-2 border-red-200 shadow-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all">
                <X size={26} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-white border-2 border-green-200 shadow-xl flex items-center justify-center text-green-500 hover:bg-green-50 transition-all">
                <Heart size={26} />
              </motion.button>
            </div>
            <p className="pointer-events-auto text-white/40 text-xs mt-3 flex items-center gap-4">
              <span className="flex items-center gap-1"><ArrowLeft size={11} /> Passer</span>
              <span>·</span>
              <span className="flex items-center gap-1">Aimer <ArrowRight size={11} /></span>
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Custom Pro Marker (rendered inside AdvancedMarker) ────────────────────── */
function ProMarker({ pro, isSelected, onClick }: {
  pro: Pro; isSelected: boolean; onClick: () => void;
}) {
  return (
    <AdvancedMarker
      position={{ lat: pro.lat, lng: pro.lng }}
      onClick={onClick}
      zIndex={isSelected ? 100 : 1}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isSelected ? 1.2 : 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex flex-col items-center cursor-pointer group"
      >
        {/* Bubble */}
        <div className={`
          relative w-12 h-12 rounded-full bg-gradient-to-br ${pro.avatarColor}
          flex items-center justify-center text-white font-black text-sm
          border-[3px] shadow-xl transition-all duration-200
          ${isSelected
            ? 'border-[#E30613] shadow-red-400/40 ring-4 ring-[#E30613]/20'
            : 'border-white group-hover:border-[#1E5BB8]/60 group-hover:shadow-blue-400/30'}
        `}>
          <span className="text-lg">{pro.avatar}</span>
          {pro.available && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Label */}
        <div className={`
          mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap
          transition-all duration-200
          ${isSelected
            ? 'bg-[#1E5BB8] text-white'
            : pro.available
              ? 'bg-white text-gray-800 border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200'
              : 'bg-gray-200 text-gray-500'}
        `}>
          {pro.name.split(' ')[0]} · {pro.price} MAD
        </div>

        {/* Pointer triangle */}
        <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px]
          border-l-transparent border-r-transparent -mt-px drop-shadow-sm
          ${isSelected ? 'border-t-[#1E5BB8]' : pro.available ? 'border-t-white' : 'border-t-gray-200'}
        `} />
      </motion.div>
    </AdvancedMarker>
  );
}

/* ─── User Location Marker ──────────────────────────────────────────────────── */
function UserMarker() {
  return (
    <AdvancedMarker position={CASABLANCA_CENTER} zIndex={200}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-[#1E5BB8] border-[3px] border-white shadow-xl" />
          <div className="absolute inset-0 rounded-full bg-[#1E5BB8]/30 animate-ping" />
        </div>
        <div className="mt-1 bg-[#1E5BB8] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow whitespace-nowrap">
          Vous
        </div>
      </div>
    </AdvancedMarker>
  );
}

/* ─── Google Map Inner Component (needs useMap hook) ────────────────────────── */
function MapContent({ pros, selectedPro, onSelectPro }: {
  pros: Pro[]; selectedPro: Pro | null; onSelectPro: (p: Pro) => void;
}) {
  const map = useMap();

  // Pan to selected pro
  useEffect(() => {
    if (selectedPro && map) {
      map.panTo({ lat: selectedPro.lat, lng: selectedPro.lng });
    }
  }, [selectedPro, map]);

  return (
    <>
      <UserMarker />
      {pros.map(pro => (
        <ProMarker
          key={pro.id}
          pro={pro}
          isSelected={selectedPro?.id === pro.id}
          onClick={() => onSelectPro(pro)}
        />
      ))}
    </>
  );
}

/* ─── Main MapPage ──────────────────────────────────────────────────────────── */
export function MapPage({ filteredPros, filters, updateFilter, onSelectPro }: MapPageProps) {
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [likedFilter, setLikedFilter] = useState<number[] | null>(null);

  const currentCat = SERVICE_CATEGORIES.find(c => c.label === filters.category) || SERVICE_CATEGORIES[0];
  const mapPros = likedFilter !== null
    ? filteredPros.filter(p => likedFilter.includes(p.id))
    : filteredPros;

  const handleMapSelect = (pro: Pro) => setSelectedPro(prev => prev?.id === pro.id ? null : pro);
  const handleSwipeFinished = (likedIds: number[]) => { if (likedIds.length > 0) setLikedFilter(likedIds); };
  const handleResetFilter = () => { setLikedFilter(null); setSelectedPro(null); };

  return (
    // ─── APIProvider wraps the whole page ─────────────────────────────────────
    // If you already wrap your app in APIProvider, remove this wrapper here.
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="flex h-full overflow-hidden relative">

        {/* ── SWIPE OVERLAY ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {swipeOpen && (
            <MapSwipeOverlay
              pros={filteredPros}
              onClose={() => setSwipeOpen(false)}
              onViewPro={pro => { onSelectPro(pro); setSwipeOpen(false); }}
              onSwipeFinished={handleSwipeFinished}
            />
          )}
        </AnimatePresence>

        {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 shadow-lg z-10 shrink-0">
          <div className="px-4 py-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                <SlidersHorizontal size={15} className="text-[#1E5BB8]" /> Filtres
              </h3>
              <span className="text-xs font-black bg-[#1E5BB8] text-white w-6 h-6 rounded-full flex items-center justify-center">
                {mapPros.length}
              </span>
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Catégorie</p>
              <button onClick={() => setCatOpen(!catOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#1E5BB8]/50 transition-all">
                <span className="flex items-center gap-2">{currentCat.emoji} {currentCat.label}</span>
                <ChevronDown size={13} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto py-1">
                    {SERVICE_CATEGORIES.map(c => (
                      <button key={c.label} onClick={() => { updateFilter('category', c.label as ServiceCategory); setCatOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                          filters.category === c.label ? 'bg-blue-50 text-[#1E5BB8] font-bold' : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                        <span className="flex items-center gap-2.5">{c.emoji} {c.label}</span>
                        {filters.category === c.label && <Check size={13} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Distance */}
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1.5">
                <span className="text-gray-400 uppercase tracking-widest">Rayon</span>
                <span className="text-[#1E5BB8]">{filters.maxDistance} km</span>
              </div>
              <input type="range" min={1} max={50} value={filters.maxDistance}
                onChange={e => updateFilter('maxDistance', +e.target.value)}
                className="w-full accent-[#1E5BB8]" />
            </div>

            {/* Swipe mode button */}
            <button onClick={() => setSwipeOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#1E5BB8] to-[#243B82] text-white font-bold rounded-xl text-sm shadow-md shadow-blue-900/20 hover:shadow-lg transition-all">
              <Zap size={15} /> Mode Swipe
            </button>
          </div>

          {/* Swipe filter indicator */}
          {likedFilter !== null && (
            <div className="mx-3 mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <Heart size={13} className="text-green-600 fill-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-semibold flex-1">
                {likedFilter.length} prestataire{likedFilter.length > 1 ? 's' : ''} sélectionné{likedFilter.length > 1 ? 's' : ''} par swipe
              </p>
              <button onClick={handleResetFilter} className="text-green-600 hover:text-green-800 transition-colors">
                <RefreshCw size={13} />
              </button>
            </div>
          )}

          {/* Pro list */}
          <div className="border-b border-gray-50 px-4 py-2 mt-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {likedFilter !== null ? 'Prestataires aimés' : 'Prestataires à proximité'} ({mapPros.length})
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 min-h-0">
            {mapPros.map(pro => (
              <button key={pro.id} onClick={() => handleMapSelect(pro)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/40 transition-colors text-left ${
                  selectedPro?.id === pro.id ? 'bg-blue-50 border-r-2 border-[#1E5BB8]' : ''
                }`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow shrink-0`}>
                  {pro.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{pro.name}</p>
                    {pro.verified && <BadgeCheck size={11} className="text-blue-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{pro.specialty}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-[#1E5BB8]">{pro.price} MAD</p>
                  <p className="text-[10px] text-gray-400">{pro.distance} km</p>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${pro.available ? 'bg-green-500' : 'bg-gray-300'}`} />
              </button>
            ))}
            {mapPros.length === 0 && likedFilter !== null && (
              <div className="text-center py-8 px-4">
                <p className="text-gray-400 text-sm">Aucun prestataire aimé</p>
                <button onClick={handleResetFilter} className="mt-2 text-xs text-[#1E5BB8] font-bold hover:underline">Voir tous</button>
              </div>
            )}
          </div>
        </div>

        {/* ── MAP AREA ──────────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">

          {/* ── REAL GOOGLE MAP ────────────────────────────────────────── */}
          <Map
            mapId="casablanca-pro-map"           // Create a Map ID in Google Cloud Console for custom styles
            defaultCenter={CASABLANCA_CENTER}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            zoomControlOptions={{ position: 9 }} // RIGHT_CENTER
            styles={MAP_STYLES}                  // Custom styles (only works without mapId — remove one or the other)
            className="w-full h-full"
          >
            <MapContent
              pros={mapPros}
              selectedPro={selectedPro}
              onSelectPro={handleMapSelect}
            />
          </Map>

          {/* Mobile top bar */}
          <div className="lg:hidden absolute top-3 left-3 right-3 z-20 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 shadow-md">
              <Search size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Casablanca, Maroc</span>
            </div>
            <button onClick={() => setSwipeOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#1E5BB8] to-[#243B82] text-white font-bold px-3 py-2 rounded-xl shadow-md text-xs">
              <Zap size={14} /> Swipe
            </button>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2.5 rounded-xl border shadow-md transition-all ${
                filterOpen ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]' : 'bg-white/95 text-gray-600 border-gray-200'
              }`}>
              <Filter size={16} />
            </button>
          </div>

          {/* Swipe filter banner on mobile */}
          {likedFilter !== null && (
            <div className="lg:hidden absolute top-16 left-3 right-3 z-20 flex items-center gap-2 bg-green-50/95 backdrop-blur-sm border border-green-200 rounded-xl px-3 py-2 shadow-md">
              <Heart size={13} className="text-green-600 fill-green-600" />
              <p className="text-xs text-green-700 font-semibold flex-1">{likedFilter.length} aimé{likedFilter.length > 1 ? 's' : ''} sur la carte</p>
              <button onClick={handleResetFilter} className="text-green-600 hover:text-green-800">
                <RefreshCw size={13} />
              </button>
            </div>
          )}

          {/* Mobile filter panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="lg:hidden absolute top-16 left-3 right-3 z-20 bg-white/98 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-4 space-y-3">
                <div className="relative">
                  <button onClick={() => setCatOpen(!catOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                    <span className="flex items-center gap-2">{currentCat.emoji} {currentCat.label}</span>
                    <ChevronDown size={13} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 max-h-52 overflow-y-auto py-1">
                        {SERVICE_CATEGORIES.map(c => (
                          <button key={c.label} onClick={() => { updateFilter('category', c.label as ServiceCategory); setCatOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${
                              filters.category === c.label ? 'bg-blue-50 text-[#1E5BB8] font-bold' : 'text-gray-700 hover:bg-gray-50'
                            }`}>
                            <span className="flex items-center gap-2">{c.emoji} {c.label}</span>
                            {filters.category === c.label && <Check size={13} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-400">Rayon</span>
                    <span className="text-[#1E5BB8]">{filters.maxDistance} km</span>
                  </div>
                  <input type="range" min={1} max={50} value={filters.maxDistance}
                    onChange={e => updateFilter('maxDistance', +e.target.value)}
                    className="w-full accent-[#1E5BB8]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute top-3 right-3 hidden lg:flex bg-white/90 backdrop-blur-sm rounded-xl shadow px-3 py-2 border border-gray-100 text-xs gap-3 z-20">
            {likedFilter !== null && (
              <span className="flex items-center gap-1 text-green-600 font-bold">
                <Heart size={11} className="fill-green-500 text-green-500" /> Filtrés par swipe
              </span>
            )}
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Disponible</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-full" /> Indisponible</span>
          </div>

          {/* Selected pro panel */}
          <AnimatePresence>
            {selectedPro && (
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                className="absolute bottom-0 left-0 right-0 lg:left-auto lg:right-6 lg:bottom-6 lg:w-96 bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border-t border-gray-100 lg:border p-5 z-30"
              >
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 lg:hidden" />
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPro.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0`}>
                    {selectedPro.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900 text-lg">{selectedPro.name}</p>
                      {selectedPro.verified && <BadgeCheck size={16} className="text-blue-500" />}
                    </div>
                    <p className="text-gray-500 text-sm">{selectedPro.specialty}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                        <Star size={13} className="fill-amber-400 text-amber-400" /> {selectedPro.rating} ({selectedPro.reviews})
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{selectedPro.distance} km</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{selectedPro.responseTime}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPro(null)} className="text-gray-400 hover:text-gray-600 p-1 shrink-0"><X size={18} /></button>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className={`flex-1 text-center text-sm font-bold py-2 rounded-xl ${
                    selectedPro.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{selectedPro.available ? '● Disponible' : '○ Indisponible'}</span>
                  <span className="font-black text-[#1E5BB8] bg-blue-50 px-5 py-2 rounded-xl border border-blue-100 text-sm">{selectedPro.price} MAD/h</span>
                </div>
                <button onClick={() => onSelectPro(selectedPro)}
                  className="w-full bg-[#1E5BB8] hover:bg-[#243B82] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-900/20">
                  Voir le profil complet <ChevronRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </APIProvider>
  );
}