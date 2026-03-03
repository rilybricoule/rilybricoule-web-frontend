import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MapPin, BadgeCheck, Clock, X, ChevronDown,
  SlidersHorizontal, RefreshCw, Heart, ArrowLeft, ArrowRight,
  Filter, ChevronRight, Check, Zap,
} from 'lucide-react';
import type { Pro, Filters, ServiceCategory } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockdata';

interface ServicesPageProps {
  filteredPros: Pro[];
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, val: Filters[K]) => void;
  resetFilters: () => void;
  onSelectPro: (pro: Pro) => void;
}

const SORT_OPTIONS = [
  { value: 'distance',   label: 'Plus proche' },
  { value: 'rating',     label: 'Mieux noté' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'reviews',    label: 'Plus d\'avis' },
];

/* ── Swipe Card ─────────────────────────────────────────────────────────────── */
function SwipeCard({ pro, onSwipe, isTop, onView }: {
  pro: Pro; onSwipe: (d: 'left'|'right') => void; isTop: boolean; onView: () => void;
}) {
  const x       = useMotionValue(0);
  const rotate  = useTransform(x, [-220, 220], [-18, 18]);
  const likeOp  = useTransform(x, [30, 120], [0, 1]);
  const nopeOp  = useTransform(x, [-120, -30], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate, position: 'absolute', inset: 0, zIndex: isTop ? 2 : 1 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onSwipe('right');
        else if (info.offset.x < -110) onSwipe('left');
      }}
      animate={isTop ? {} : { scale: 0.95, y: 12, zIndex: 1 }}
      className={`${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} select-none`}
    >
      {/* LIKE / NOPE stamps */}
      <motion.div style={{ opacity: likeOp }}
        className="absolute top-8 left-8 z-30 rotate-[-20deg] border-4 border-green-500 rounded-2xl px-4 py-2">
        <p className="text-green-500 font-black text-2xl tracking-wide">LIKE 💚</p>
      </motion.div>
      <motion.div style={{ opacity: nopeOp }}
        className="absolute top-8 right-8 z-30 rotate-[20deg] border-4 border-red-500 rounded-2xl px-4 py-2">
        <p className="text-red-500 font-black text-2xl tracking-wide">NOPE ✕</p>
      </motion.div>

      <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Card header gradient */}
        <div className={`h-52 bg-gradient-to-br ${pro.avatarColor} relative flex items-center justify-center`}>
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
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ● Disponible
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-amber-50 rounded-xl py-3">
              <p className="font-bold text-amber-600 flex items-center justify-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />{pro.rating}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{pro.reviews} avis</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-3">
              <p className="font-bold text-[#1E5BB8] text-base">{pro.price}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">MAD/h</p>
            </div>
            <div className="text-center bg-green-50 rounded-xl py-3">
              <p className="font-bold text-green-700 text-sm">{pro.distance} km</p>
              <p className="text-[11px] text-gray-400 mt-0.5">de vous</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">{pro.bio}</p>

          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
            <MapPin size={11} className="text-[#1E5BB8]" />{pro.location}
            <span className="mx-1">·</span>
            <Clock size={11} />{pro.responseTime}
            <span className="mx-1">·</span>
            {pro.completedJobs} missions
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {pro.tags.map(t => (
              <span key={t} className="text-xs bg-blue-50 text-[#1E5BB8] px-2.5 py-1 rounded-full font-semibold border border-blue-100">{t}</span>
            ))}
          </div>

          <button onClick={e => { e.stopPropagation(); onView(); }}
            className="w-full bg-[#1E5BB8] hover:bg-[#243B82] text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20">
            Voir le profil complet <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Swipe Overlay (full-screen modal over blurred content) ─────────────────── */
function SwipeOverlay({ pros, onClose, onViewPro }: {
  pros: Pro[]; onClose: () => void; onViewPro: (pro: Pro) => void;
}) {
  const [stack, setStack]   = useState(() => pros.map(p => p.id));
  const [liked, setLiked]   = useState<number[]>([]);
  const [lastDir, setLastDir] = useState<'left'|'right'|null>(null);
  const [showLiked, setShowLiked] = useState(false);

  const currentId  = stack[stack.length - 1];
  const nextId     = stack[stack.length - 2];
  const currentPro = pros.find(p => p.id === currentId);
  const nextPro    = pros.find(p => p.id === nextId);
  const likedPros  = pros.filter(p => liked.includes(p.id));

  const handleSwipe = (dir: 'left'|'right') => {
    if (!currentId) return;
    setLastDir(dir);
    if (dir === 'right') setLiked(prev => [...prev, currentId]);
    setStack(prev => prev.slice(0, -1));
    setTimeout(() => setLastDir(null), 600);
  };

  const reset = () => { setStack(pros.map(p => p.id)); setLiked([]); setShowLiked(false); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-[#243B82]/80 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full px-4 py-6 pointer-events-none">

        {/* Header bar */}
        <div className="pointer-events-auto w-full max-w-md flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-white text-lg">Mode Swipe</h3>
            <p className="text-white/60 text-xs">{stack.length} prestataire{stack.length > 1 ? 's' : ''} restant{stack.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {liked.length > 0 && (
              <button onClick={() => setShowLiked(!showLiked)}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
                <Heart size={13} className="fill-red-400 text-red-400" /> {liked.length} aimé{liked.length > 1 ? 's' : ''}
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl flex items-center justify-center transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Liked drawer */}
        <AnimatePresence>
          {showLiked && likedPros.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl p-4 mb-4 shadow-xl">
              <p className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Heart size={14} className="text-red-500 fill-red-500" /> Prestataires aimés
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {likedPros.map(p => (
                  <button key={p.id} onClick={() => { onViewPro(p); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors text-left">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{p.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.specialty} · {p.price} MAD/h</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
              <button onClick={reset} className="mt-3 w-full text-xs text-[#1E5BB8] font-bold hover:underline flex items-center justify-center gap-1">
                <RefreshCw size={11} /> Réinitialiser
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards area */}
        {stack.length === 0 ? (
          <div className="pointer-events-auto text-center bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 w-full max-w-md">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-black text-white text-xl mb-1">Tout vu !</p>
            <p className="text-white/70 text-sm mb-6">
              Vous avez aimé <strong className="text-white">{liked.length}</strong> prestataire{liked.length > 1 ? 's' : ''}.
            </p>
            {liked.length > 0 && (
              <button onClick={() => setShowLiked(true)}
                className="bg-white text-[#1E5BB8] font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm mb-3 w-full">
                Voir mes favoris ({liked.length})
              </button>
            )}
            <button onClick={reset}
              className="text-white/70 hover:text-white text-sm font-semibold flex items-center justify-center gap-1 mx-auto">
              <RefreshCw size={13} /> Recommencer
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto w-full max-w-md" style={{ height: 500, position: 'relative' }}>
            {/* Shadow card behind */}
            {nextPro && (
              <div className="absolute inset-0 scale-[0.94] translate-y-3 pointer-events-none"
                style={{ zIndex: 1 }}>
                <div className={`h-full bg-gradient-to-br ${nextPro.avatarColor} rounded-3xl opacity-40`} />
              </div>
            )}
            {currentPro && (
              <SwipeCard key={currentPro.id} pro={currentPro} onSwipe={handleSwipe} isTop={true}
                onView={() => { onViewPro(currentPro); onClose(); }} />
            )}
          </div>
        )}

        {/* Action buttons */}
        {stack.length > 0 && (
          <div className="pointer-events-auto flex items-center gap-6 mt-5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white border-2 border-red-200 shadow-xl flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-400 transition-all">
              <X size={26} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-white border-2 border-green-200 shadow-xl flex items-center justify-center text-green-500 hover:bg-green-50 hover:border-green-400 transition-all">
              <Heart size={26} />
            </motion.button>
          </div>
        )}
        {stack.length > 0 && (
          <p className="pointer-events-auto text-white/50 text-xs mt-3 flex items-center gap-4">
            <span className="flex items-center gap-1"><ArrowLeft size={11} /> Glisser pour passer</span>
            <span>·</span>
            <span className="flex items-center gap-1">Glisser pour aimer <ArrowRight size={11} /></span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────────── */
export function ServicesPage({ filteredPros, filters, updateFilter, resetFilters, onSelectPro }: ServicesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen]       = useState(false);
  const [catOpen, setCatOpen]         = useState(false);
  const [swipeOpen, setSwipeOpen]     = useState(false);

  const displayed = filteredPros.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSort = SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || 'Trier';
  const currentCat  = SERVICE_CATEGORIES.find(c => c.label === filters.category) || SERVICE_CATEGORIES[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F3F5] relative">

      {/* Swipe overlay */}
      <AnimatePresence>
        {swipeOpen && (
          <SwipeOverlay
            pros={filteredPros}
            onClose={() => setSwipeOpen(false)}
            onViewPro={pro => { onSelectPro(pro); setSwipeOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1E5BB8] focus-within:ring-2 focus-within:ring-blue-100 transition-all min-w-0">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}><X size={13} className="text-gray-400" /></button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button onClick={() => { setSortOpen(!sortOpen); setCatOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#1E5BB8]/40 transition-all whitespace-nowrap">
              <span className="hidden sm:inline">{currentSort}</span>
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 py-1">
                  {SORT_OPTIONS.map(o => (
                    <button key={o.value}
                      onClick={() => { updateFilter('sortBy', o.value as Filters['sortBy']); setSortOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        filters.sortBy === o.value ? 'bg-blue-50 text-[#1E5BB8] font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                      {o.label} {filters.sortBy === o.value && <Check size={13} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter toggle */}
          <button onClick={() => { setSidebarOpen(!sidebarOpen); setSortOpen(false); setCatOpen(false); }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 ${
              sidebarOpen ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]' : 'border-gray-200 text-gray-700 hover:border-[#1E5BB8]/40 bg-white'
            }`}>
            <Filter size={14} />
            <span className="hidden sm:inline">Filtres</span>
          </button>

          {/* SWIPE button — standalone CTA */}
          <button onClick={() => setSwipeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E5BB8] to-[#243B82] text-white text-sm font-black shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 transition-all shrink-0">
            <Zap size={14} /> Swipe
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">

        {/* ── Sidebar filter ──────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 270, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="flex-none bg-white border-r border-gray-100 overflow-hidden flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="font-black text-gray-900">Filtres</p>
                  <button onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-[#1E5BB8] font-semibold hover:underline">
                    <RefreshCw size={11} /> Réinit.
                  </button>
                </div>

                {/* Category — dropdown list (like map page) */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Catégorie</p>
                  <div className="relative">
                    <button onClick={() => setCatOpen(!catOpen)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#1E5BB8]/50 transition-all">
                      <span className="flex items-center gap-2">{currentCat.emoji} {currentCat.label}</span>
                      <ChevronDown size={13} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {catOpen && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-56 overflow-y-auto py-1">
                          {SERVICE_CATEGORIES.map(c => (
                            <button key={c.label}
                              onClick={() => { updateFilter('category', c.label as ServiceCategory); setCatOpen(false); }}
                              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
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
                </div>

                {/* Distance */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Distance max</span>
                    <span className="text-[#1E5BB8]">{filters.maxDistance} km</span>
                  </div>
                  <input type="range" min={1} max={50} value={filters.maxDistance}
                    onChange={e => updateFilter('maxDistance', +e.target.value)}
                    className="w-full accent-[#1E5BB8]" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 km</span><span>50 km</span></div>
                </div>

                {/* Rating */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Note min</span>
                    <span className="text-[#1E5BB8]">{filters.minRating > 0 ? `${filters.minRating}★` : 'Toutes'}</span>
                  </div>
                  <input type="range" min={0} max={5} step={0.5} value={filters.minRating}
                    onChange={e => updateFilter('minRating', +e.target.value)}
                    className="w-full accent-[#1E5BB8]" />
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Budget max</span>
                    <span className="text-[#1E5BB8]">{filters.maxPrice} MAD/h</span>
                  </div>
                  <input type="range" min={50} max={500} step={10} value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', +e.target.value)}
                    className="w-full accent-[#1E5BB8]" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>50 MAD</span><span>500 MAD</span></div>
                </div>

                {/* Available toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${filters.availableOnly ? 'bg-[#1E5BB8]' : 'bg-gray-200'}`}
                    onClick={() => updateFilter('availableOnly', !filters.availableOnly)}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${filters.availableOnly ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Disponibles uniquement</span>
                </label>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Results ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-white/60 border-b border-gray-100 flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500">
              <span className="font-black text-gray-900">{displayed.length}</span> prestataire{displayed.length > 1 ? 's' : ''}
              {filters.category !== 'Tous' && <span className="ml-1.5 text-[#1E5BB8] font-semibold">· {filters.category}</span>}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {displayed.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-bold text-gray-700">Aucun résultat</p>
                <button onClick={resetFilters} className="mt-4 text-[#1E5BB8] font-bold text-sm hover:underline">Réinitialiser les filtres</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayed.map((pro, i) => (
                  <motion.div key={pro.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035 }}
                    onClick={() => onSelectPro(pro)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#1E5BB8]/30 hover:shadow-lg hover:shadow-blue-100/50 transition-all cursor-pointer group"
                  >
                    <div className={`h-20 bg-gradient-to-r ${pro.avatarColor} flex items-center px-4 gap-3 relative`}>
                      <div className="w-14 h-14 rounded-xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-xl shrink-0">
                        {pro.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-white truncate">{pro.name}</p>
                          {pro.verified && <BadgeCheck size={13} className="text-white/80 shrink-0" />}
                        </div>
                        <p className="text-white/70 text-xs truncate">{pro.specialty}</p>
                      </div>
                      <div className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        pro.available ? 'bg-green-500/90 text-white' : 'bg-black/30 text-white/60'
                      }`}>
                        {pro.available ? '● Dispo' : '○'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                          <Star size={12} className="fill-amber-400 text-amber-400" />{pro.rating}
                          <span className="text-gray-400 font-normal text-xs">({pro.reviews})</span>
                        </span>
                        <span className="font-black text-[#1E5BB8]">{pro.price} <span className="text-xs font-normal text-gray-400">MAD/h</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={10} />{pro.distance} km</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{pro.responseTime}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {pro.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[11px] bg-blue-50 text-[#1E5BB8] px-2 py-0.5 rounded-full font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}