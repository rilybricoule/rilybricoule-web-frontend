import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, BadgeCheck, Clock, X, Heart, ArrowLeft, ArrowRight,
  ChevronRight, Zap, ChevronLeft, Sparkles, TrendingUp, AlertCircle,
  CheckCircle, RefreshCw, Search, Filter, SlidersHorizontal,
  ChevronDown, Check, Phone, MessageCircle, Calendar,
} from 'lucide-react';
import type { Pro, Filters, ServiceCategory } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockdata';

// ─── Subcategories ────────────────────────────────────────────────────────────
const SUBCATEGORIES: Record<string, { label: string; emoji: string }[]> = {
  'Tous': [],
  'Plomberie': [
    { label: 'Fuite d\'eau',           emoji: '💧' },
    { label: 'Installation sanitaire', emoji: '🚿' },
    { label: 'Chauffe-eau',            emoji: '🔥' },
    { label: 'Débouchage',             emoji: '🪠' },
    { label: 'Robinetterie',           emoji: '🔧' },
  ],
  'Électricité': [
    { label: 'Panne électrique',     emoji: '⚡' },
    { label: 'Installation tableau', emoji: '🔌' },
    { label: 'Éclairage',            emoji: '💡' },
    { label: 'Climatisation',        emoji: '❄️' },
    { label: 'Domotique',            emoji: '🏠' },
  ],
  'Peinture': [
    { label: 'Peinture intérieure', emoji: '🖌️' },
    { label: 'Peinture extérieure', emoji: '🏠' },
    { label: 'Enduit & crépi',      emoji: '🧱' },
    { label: 'Papier peint',        emoji: '📋' },
    { label: 'Ravalement',          emoji: '🏗️' },
  ],
  'Jardinage': [
    { label: 'Tonte pelouse',     emoji: '🌿' },
    { label: 'Taille haies',      emoji: '✂️' },
    { label: 'Arrosage',          emoji: '💦' },
    { label: 'Plantation',        emoji: '🌱' },
    { label: 'Entretien piscine', emoji: '🏊' },
  ],
  'Ménage': [
    { label: 'Nettoyage régulier',  emoji: '🧹' },
    { label: 'Grand ménage',        emoji: '✨' },
    { label: 'Vitres & fenêtres',   emoji: '🪟' },
    { label: 'Après travaux',       emoji: '🏗️' },
    { label: 'Bureaux & commerces', emoji: '🏢' },
  ],
  'Menuiserie': [
    { label: 'Meubles sur mesure', emoji: '🪑' },
    { label: 'Parquet',            emoji: '🪵' },
    { label: 'Portes',             emoji: '🚪' },
  ],
  'Serrurerie': [
    { label: 'Urgence',     emoji: '🚨' },
    { label: 'Blindage',    emoji: '🚪' },
    { label: 'Coffre-fort', emoji: '🔒' },
  ],
  'Climatisation': [
    { label: 'Installation',     emoji: '🔧' },
    { label: 'Entretien annuel', emoji: '🌡️' },
    { label: 'Réparation',       emoji: '⚙️' },
  ],
  'Déménagement': [
    { label: 'Déménagement complet', emoji: '🚚' },
    { label: 'Petit déménagement',   emoji: '📦' },
    { label: 'Montage meubles',      emoji: '🪑' },
    { label: 'Transport express',    emoji: '⚡' },
    { label: 'Stockage',             emoji: '🏭' },
  ],
  'Sécurité': [
    { label: 'Alarme',            emoji: '🚨' },
    { label: 'Vidéosurveillance', emoji: '📷' },
  ],
};

// ─── Dispatch Algorithm ───────────────────────────────────────────────────────
function normalize(s: string) {
  return s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function tagMatchesSubcategory(tag: string, sub: string): boolean {
  const t = normalize(tag);
  const s = normalize(sub);
  return t === s || t.includes(s) || s.includes(t);
}

function computeScore(pro: Pro, filters: Filters): number {
  const rating      = (pro.rating / 5) * 30;
  const availability = pro.available ? 25 : 0;
  const maxDist     = filters.maxDistance || 50;
  const proximity   = Math.max(0, ((maxDist - pro.distance) / maxDist) * 25);
  const active      = pro.activeJobs ?? 0;
  const equity      = active === 0 ? 20 : active === 1 ? 12 : active === 2 ? 6 : 0;
  const penalty     = Math.min(active * 5, 15);
  const trust       = Math.min((pro.reviews / 100) * 10, 10);
  return rating + availability + proximity + equity - penalty + trust;
}

function runDispatch(pros: Pro[], filters: Filters, category: string, subcategory: string): Pro | null {
  const candidates = pros.filter(p => {
    // Must be available
    if (!p.available) return false;
    // Must match category
    if (category && category !== 'Tous' && p.category !== (category as ServiceCategory)) return false;
    // Must match subcategory tag (strict)
    if (subcategory) return p.tags.some(t => tagMatchesSubcategory(t, subcategory));
    return true;
  });

  if (candidates.length === 0) return null;

  // Return highest scoring candidate
  return candidates.reduce((best, p) =>
    computeScore(p, filters) > computeScore(best, filters) ? p : best
  );
}

// Also used for the optional "browse" mode
function filterAndSort(pros: Pro[], filters: Filters, category: string, subcategory: string, search: string): Pro[] {
  return pros
    .filter(p => {
      if (category && category !== 'Tous' && p.category !== (category as ServiceCategory)) return false;
      if (subcategory && !p.tags.some(t => tagMatchesSubcategory(t, subcategory))) return false;
      if (search) {
        const q = normalize(search);
        return normalize(p.name).includes(q) || normalize(p.specialty).includes(q) || p.tags.some(t => normalize(t).includes(q));
      }
      return true;
    })
    .map(p => ({ pro: p, score: computeScore(p, filters) }))
    .sort((a, b) => b.score - a.score)
    .map(({ pro }) => pro);
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ServicesPageProps {
  filteredPros: Pro[];
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, val: Filters[K]) => void;
  resetFilters: () => void;
  onSelectPro: (pro: Pro) => void;
}

// ─── Searching Animation ──────────────────────────────────────────────────────
function SearchingScreen({ category, subcategory, onFound, onNoResult, pros, filters }: {
  category: string; subcategory: string;
  onFound: (pro: Pro) => void;
  onNoResult: () => void;
  pros: Pro[]; filters: Filters;
}) {
  const [phase, setPhase] = React.useState<'searching' | 'found' | 'none'>('searching');
  const [matched, setMatched] = React.useState<Pro | null>(null);
  const cat = SERVICE_CATEGORIES.find(c => c.label === category);
  const sub = subcategory ? SUBCATEGORIES[category]?.find(s => s.label === subcategory) : null;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const result = runDispatch(pros, filters, category, subcategory);
      if (result) {
        setMatched(result);
        setPhase('found');
      } else {
        setPhase('none');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (phase === 'none') {
      const t = setTimeout(onNoResult, 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1E5BB8] to-[#0f2d5e] flex flex-col items-center justify-center px-6"
    >
      {/* Ripple rings */}
      {phase === 'searching' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="absolute rounded-full border-2 border-white/20"
              initial={{ width: 80, height: 80, opacity: 0.6 }}
              animate={{ width: 320, height: 320, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'searching' && (
          <motion.div key="searching" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white mx-auto mb-6"
            />
            <p className="text-white font-black text-2xl mb-2">Recherche en cours…</p>
            <p className="text-white/60 text-sm mb-4">
              Analyse de {pros.filter(p => p.available).length} prestataires disponibles
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-xl">{cat?.emoji}</span>
              <span className="text-white font-semibold text-sm">{category}</span>
              {sub && <>
                <span className="text-white/40">·</span>
                <span className="text-white/80 text-sm">{sub.emoji} {subcategory}</span>
              </>}
            </div>

            {/* Algorithm steps */}
            <div className="mt-8 space-y-2 text-left max-w-xs mx-auto">
              {[
                { label: 'Vérification disponibilité', delay: 0 },
                { label: 'Analyse proximité & distance', delay: 0.4 },
                { label: 'Calcul score de pertinence', delay: 0.8 },
                { label: 'Équité de répartition', delay: 1.2 },
              ].map(({ label, delay }) => (
                <motion.div key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay }}
                  className="flex items-center gap-2 text-white/70 text-xs">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.2 }}
                    className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center shrink-0">
                    <Check size={9} className="text-white" />
                  </motion.div>
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'found' && matched && (
          <motion.div key="found" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center relative z-10 w-full max-w-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/40">
              <CheckCircle size={32} className="text-white" />
            </motion.div>

            <p className="text-white font-black text-2xl mb-1">Prestataire trouvé !</p>
            <p className="text-white/60 text-sm mb-6">Meilleur match selon notre algorithme</p>

            {/* Pro card */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-6"
            >
              <div className={`h-28 bg-gradient-to-br ${matched.avatarColor} relative flex items-center px-5 gap-4`}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-2xl shrink-0">
                  {matched.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-white text-lg truncate">{matched.name}</p>
                    {matched.verified && <BadgeCheck size={16} className="text-white/80 shrink-0" />}
                  </div>
                  <p className="text-white/70 text-sm truncate">{matched.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-amber-300 text-amber-300" />
                    <span className="text-white font-bold text-sm">{matched.rating}</span>
                    <span className="text-white/60 text-xs">({matched.reviews} avis)</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  ● Disponible
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center bg-blue-50 rounded-xl py-2.5">
                    <p className="font-black text-[#1E5BB8] text-base">{matched.price}</p>
                    <p className="text-[10px] text-gray-400">MAD/h</p>
                  </div>
                  <div className="text-center bg-green-50 rounded-xl py-2.5">
                    <p className="font-bold text-green-700 text-sm">{matched.distance} km</p>
                    <p className="text-[10px] text-gray-400">de vous</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-xl py-2.5">
                    <p className="font-bold text-orange-600 text-sm">{matched.responseTime}</p>
                    <p className="text-[10px] text-gray-400">réponse</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onFound(matched)}
                    className="flex-1 bg-[#1E5BB8] text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 hover:bg-[#243B82] transition-colors">
                    <Calendar size={14} /> Réserver
                  </button>
                  <button
                    onClick={() => onFound(matched)}
                    className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <MessageCircle size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>

            <button
              onClick={onNoResult}
              className="text-white/50 hover:text-white/80 text-sm font-medium transition-colors flex items-center gap-1.5 mx-auto">
              <RefreshCw size={13} /> Voir d'autres options
            </button>
          </motion.div>
        )}

        {phase === 'none' && (
          <motion.div key="none" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10">
            <p className="text-5xl mb-4">😔</p>
            <p className="text-white font-black text-xl mb-2">Aucun prestataire disponible</p>
            <p className="text-white/60 text-sm">Redirection vers la liste…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Swipe Card ───────────────────────────────────────────────────────────────
function SwipeCard({ pro, onSwipe, isTop, onView }: {
  pro: Pro; onSwipe: (d: 'left' | 'right') => void; isTop: boolean; onView: () => void;
}) {
  const x      = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-18, 18]);
  const likeOp = useTransform(x, [30, 120], [0, 1]);
  const nopeOp = useTransform(x, [-120, -30], [1, 0]);

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
      animate={isTop ? {} : { scale: 0.95, y: 12 }}
      className={`${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} select-none`}
    >
      <motion.div style={{ opacity: likeOp }}
        className="absolute top-8 left-8 z-30 rotate-[-20deg] border-4 border-green-500 rounded-2xl px-4 py-2 bg-white/10 backdrop-blur-sm">
        <p className="text-green-500 font-black text-2xl">LIKE 💚</p>
      </motion.div>
      <motion.div style={{ opacity: nopeOp }}
        className="absolute top-8 right-8 z-30 rotate-[20deg] border-4 border-red-500 rounded-2xl px-4 py-2 bg-white/10 backdrop-blur-sm">
        <p className="text-red-500 font-black text-2xl">NOPE ✕</p>
      </motion.div>

      <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
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
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">● Disponible</div>
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
          {(pro.activeJobs ?? 0) > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-3">
              <AlertCircle size={13} className="text-orange-500 shrink-0" />
              <p className="text-xs text-orange-700">{pro.activeJobs} mission{(pro.activeJobs ?? 0) > 1 ? 's' : ''} en cours</p>
            </div>
          )}
          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">{pro.bio}</p>
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
            <MapPin size={11} className="text-[#1E5BB8]" />{pro.location}
            <span className="mx-1">·</span><Clock size={11} />{pro.responseTime}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {pro.tags.map(t => (
              <span key={t} className="text-xs bg-blue-50 text-[#1E5BB8] px-2.5 py-1 rounded-full font-semibold border border-blue-100">{t}</span>
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); onView(); }}
            className="w-full bg-[#1E5BB8] hover:bg-[#243B82] text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
            Voir le profil <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Swipe Overlay ────────────────────────────────────────────────────────────
function SwipeOverlay({ pros, onClose, onViewPro }: {
  pros: Pro[]; onClose: () => void; onViewPro: (pro: Pro) => void;
}) {
  const [stack, setStack]         = useState(() => pros.map(p => p.id));
  const [liked, setLiked]         = useState<number[]>([]);
  const [showLiked, setShowLiked] = useState(false);

  const currentId  = stack[stack.length - 1];
  const nextId     = stack[stack.length - 2];
  const currentPro = pros.find(p => p.id === currentId);
  const nextPro    = pros.find(p => p.id === nextId);
  const likedPros  = pros.filter(p => liked.includes(p.id));

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentId) return;
    if (dir === 'right') setLiked(prev => [...prev, currentId]);
    setStack(prev => prev.slice(0, -1));
  };

  const reset = () => { setStack(pros.map(p => p.id)); setLiked([]); setShowLiked(false); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-[#243B82]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex flex-col items-center justify-center h-full px-4 py-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-white text-lg">Mode Swipe</h3>
            <p className="text-white/60 text-xs">{stack.length} restant{stack.length > 1 ? 's' : ''} · classés par dispatch</p>
          </div>
          <div className="flex items-center gap-2">
            {liked.length > 0 && (
              <button onClick={() => setShowLiked(!showLiked)}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl">
                <Heart size={13} className="fill-red-400 text-red-400" /> {liked.length}
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
        </div>

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
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 text-left">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{p.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.specialty} · {p.price} MAD/h</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
              <button onClick={reset} className="mt-3 w-full text-xs text-[#1E5BB8] font-bold flex items-center justify-center gap-1">
                <RefreshCw size={11} /> Réinitialiser
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {stack.length === 0 ? (
          <div className="pointer-events-auto text-center bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 w-full max-w-md">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-black text-white text-xl mb-1">Tout vu !</p>
            <p className="text-white/70 text-sm mb-6">
              {liked.length} prestataire{liked.length > 1 ? 's' : ''} aimé{liked.length > 1 ? 's' : ''}.
            </p>
            {liked.length > 0 && (
              <button onClick={() => setShowLiked(true)}
                className="bg-white text-[#1E5BB8] font-black px-6 py-3 rounded-xl text-sm mb-3 w-full">
                Voir mes favoris ({liked.length})
              </button>
            )}
            <button onClick={reset} className="text-white/70 hover:text-white text-sm font-semibold flex items-center justify-center gap-1 mx-auto">
              <RefreshCw size={13} /> Recommencer
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto w-full max-w-md" style={{ height: 500, position: 'relative' }}>
            {nextPro && (
              <div className="absolute inset-0 scale-[0.94] translate-y-3 pointer-events-none" style={{ zIndex: 1 }}>
                <div className={`h-full bg-gradient-to-br ${nextPro.avatarColor} rounded-3xl opacity-40`} />
              </div>
            )}
            {currentPro && (
              <SwipeCard key={currentPro.id} pro={currentPro} onSwipe={handleSwipe} isTop
                onView={() => { onViewPro(currentPro); onClose(); }} />
            )}
          </div>
        )}

        {stack.length > 0 && (
          <>
            <div className="pointer-events-auto flex items-center gap-6 mt-5">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-white border-2 border-red-200 shadow-xl flex items-center justify-center text-red-500 hover:bg-red-50">
                <X size={26} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-white border-2 border-green-200 shadow-xl flex items-center justify-center text-green-500 hover:bg-green-50">
                <Heart size={26} />
              </motion.button>
            </div>
            <p className="pointer-events-auto text-white/50 text-xs mt-3 flex items-center gap-4">
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

// ─── Pro Card (browse mode) ───────────────────────────────────────────────────
function ProCard({ pro, rank, onClick }: { pro: Pro; rank: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      onClick={onClick}
      className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden
        hover:border-[#1E5BB8]/30 hover:shadow-lg hover:shadow-blue-100/50 transition-all cursor-pointer"
    >
      {rank === 0 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
          <Sparkles size={9} /> MEILLEUR MATCH
        </div>
      )}
      {rank === 1 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#1E5BB8] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
          <TrendingUp size={9} /> TOP 2
        </div>
      )}

      <div className={`h-20 bg-gradient-to-r ${pro.avatarColor} flex items-center px-4 gap-3`}>
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
        <div className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold ${pro.available ? 'bg-green-500/90 text-white' : 'bg-black/30 text-white/60'}`}>
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
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1"><MapPin size={10} />{pro.distance} km</span>
          <span className="flex items-center gap-1"><Clock size={10} />{pro.responseTime}</span>
          {(pro.activeJobs ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-orange-500">
              <AlertCircle size={10} />{pro.activeJobs} actif{(pro.activeJobs ?? 0) > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {pro.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[11px] bg-blue-50 text-[#1E5BB8] px-2 py-0.5 rounded-full font-medium">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ServicesPage({ filteredPros, filters, updateFilter, resetFilters, onSelectPro }: ServicesPageProps) {
  // Flow: choose service → choose subcategory → dispatching → (assigned | browse)
  const [step, setStep] = useState<'choose-service' | 'choose-sub' | 'dispatching' | 'browse'>('choose-service');
  const [selectedCategory, setSelectedCategory]       = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchQuery, setSearchQuery]                 = useState('');
  const [sidebarOpen, setSidebarOpen]                 = useState(false);
  const [catOpen, setCatOpen]                         = useState(false);
  const [swipeOpen, setSwipeOpen]                     = useState(false);

  const browsePros = useMemo(() => filterAndSort(
    filteredPros, filters, selectedCategory, selectedSubcategory, searchQuery
  ), [filteredPros, filters, selectedCategory, selectedSubcategory, searchQuery]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('');
    updateFilter('category', cat as ServiceCategory);
    const hasSubs = (SUBCATEGORIES[cat]?.length ?? 0) > 0;
    if (cat === 'Tous' || !hasSubs) {
      setStep('dispatching');
    } else {
      setStep('choose-sub');
    }
  };

  const handleSubSelect = (sub: string) => {
    setSelectedSubcategory(sub);
    setStep('dispatching');
  };

  const handleDispatchFound = (pro: Pro) => {
    onSelectPro(pro);
  };

  const handleNoResult = () => {
    setStep('browse');
  };

  const handleReset = () => {
    setStep('choose-service');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchQuery('');
  };

  const currentCat = SERVICE_CATEGORIES.find(c => c.label === (selectedCategory || 'Tous')) || SERVICE_CATEGORIES[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F3F5] relative">

      {/* Dispatching screen (fullscreen overlay) */}
      <AnimatePresence>
        {step === 'dispatching' && (
          <SearchingScreen
            key="dispatch"
            category={selectedCategory}
            subcategory={selectedSubcategory}
            pros={filteredPros}
            filters={filters}
            onFound={handleDispatchFound}
            onNoResult={handleNoResult}
          />
        )}
      </AnimatePresence>

      {/* Swipe overlay */}
      <AnimatePresence>
        {swipeOpen && (
          <SwipeOverlay
            pros={browsePros}
            onClose={() => setSwipeOpen(false)}
            onViewPro={pro => { onSelectPro(pro); setSwipeOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap sm:flex-nowrap">

          {/* Back / breadcrumb */}
          {step !== 'choose-service' && (
            <button onClick={handleReset}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#1E5BB8] transition-colors shrink-0 font-semibold text-sm">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline truncate max-w-[220px]">
                {currentCat.emoji} {selectedCategory || 'Tous'}{selectedSubcategory ? ` · ${selectedSubcategory}` : ''}
              </span>
            </button>
          )}

          {/* Search — browse mode */}
          {step === 'browse' ? (
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1E5BB8] focus-within:ring-2 focus-within:ring-blue-100 transition-all min-w-0">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un prestataire..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0" />
              {searchQuery && <button onClick={() => setSearchQuery('')}><X size={13} className="text-gray-400" /></button>}
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E5BB8] to-[#243B82] flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm leading-none">Dispatch intelligent</p>
                <p className="text-xs text-gray-400">Trouvez le meilleur prestataire automatiquement</p>
              </div>
            </div>
          )}

          {/* Actions — browse mode */}
          {step === 'browse' && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setStep('dispatching')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold shadow-md hover:bg-green-600 transition-all">
                <Zap size={14} /> Relancer dispatch
              </button>
              <button onClick={() => { setSidebarOpen(!sidebarOpen); setCatOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  sidebarOpen ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]' : 'border-gray-200 text-gray-700 hover:border-[#1E5BB8]/40 bg-white'
                }`}>
                <Filter size={14} />
              </button>
              <button onClick={() => setSwipeOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E5BB8] to-[#243B82] text-white text-sm font-black shadow-md">
                <Heart size={14} /> Swipe
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">

        {/* Sidebar — browse mode */}
        <AnimatePresence>
          {step === 'browse' && sidebarOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 270, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="flex-none bg-white border-r border-gray-100 overflow-hidden flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="font-black text-gray-900 flex items-center gap-2 text-sm">
                    <SlidersHorizontal size={14} className="text-[#1E5BB8]" /> Filtres
                  </p>
                  <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-[#1E5BB8] font-semibold hover:underline">
                    <RefreshCw size={11} /> Réinit.
                  </button>
                </div>

                {/* Subcategory chips */}
                {SUBCATEGORIES[selectedCategory]?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sous-catégorie</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setSelectedSubcategory('')}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                          !selectedSubcategory ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>Tous</button>
                      {SUBCATEGORIES[selectedCategory].map(sub => (
                        <button key={sub.label} onClick={() => setSelectedSubcategory(sub.label)}
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                            selectedSubcategory === sub.label ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                          {sub.emoji} {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distance */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Distance max</span>
                    <span className="text-[#1E5BB8]">{filters.maxDistance} km</span>
                  </div>
                  <input type="range" min={1} max={50} value={filters.maxDistance}
                    onChange={e => updateFilter('maxDistance', +e.target.value)} className="w-full accent-[#1E5BB8]" />
                </div>

                {/* Rating */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Note min</span>
                    <span className="text-[#1E5BB8]">{filters.minRating > 0 ? `${filters.minRating}★` : 'Toutes'}</span>
                  </div>
                  <input type="range" min={0} max={5} step={0.5} value={filters.minRating}
                    onChange={e => updateFilter('minRating', +e.target.value)} className="w-full accent-[#1E5BB8]" />
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Budget max</span>
                    <span className="text-[#1E5BB8]">{filters.maxPrice} MAD/h</span>
                  </div>
                  <input type="range" min={50} max={500} step={10} value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', +e.target.value)} className="w-full accent-[#1E5BB8]" />
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

        {/* ── Step content ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">

            {/* Step 1: Choose service */}
            {step === 'choose-service' && (
              <motion.div key="s1"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="flex-1 overflow-y-auto px-4 py-6">
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 bg-[#1E5BB8]/10 border border-[#1E5BB8]/20 rounded-full px-4 py-1.5 mb-4">
                    <Sparkles size={13} className="text-[#1E5BB8]" />
                    <span className="text-xs font-bold text-[#1E5BB8]">Dispatch automatique · Comme Uber</span>
                  </motion.div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">De quoi avez-vous besoin ?</h2>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Sélectionnez un service — notre algorithme vous assigne automatiquement le meilleur prestataire disponible
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
                  {SERVICE_CATEGORIES.filter(c => c.label !== 'Tous').map((cat, i) => (
                    <motion.button key={cat.label}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleCategorySelect(cat.label)}
                      className="relative group bg-white rounded-2xl border border-gray-100 p-4 text-left hover:border-[#1E5BB8]/30 hover:shadow-lg hover:shadow-blue-100/60 transition-all">
                      <div className="text-3xl mb-3">{cat.emoji}</div>
                      <p className="font-bold text-gray-900 text-sm">{cat.label}</p>
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-50 group-hover:bg-[#1E5BB8] flex items-center justify-center transition-all">
                        <Zap size={11} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                  {/* Voir tout — no subcategory, dispatch directly */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategorySelect('Tous')}
                    className="relative group bg-gradient-to-br from-[#1E5BB8] to-[#243B82] rounded-2xl p-4 text-left hover:shadow-lg transition-all">
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="font-bold text-white text-sm">Tous services</p>
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Zap size={11} className="text-white" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose subcategory */}
            {step === 'choose-sub' && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                className="flex-1 overflow-y-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
                  <button onClick={() => setStep('choose-service')}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-[#1E5BB8]/40 shrink-0">
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{SERVICE_CATEGORIES.find(c => c.label === selectedCategory)?.emoji}</span>
                    <div>
                      <h2 className="font-black text-gray-900 text-lg">{selectedCategory}</h2>
                      <p className="text-xs text-gray-500">Précisez votre besoin pour un dispatch optimal</p>
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-2">
                  {(SUBCATEGORIES[selectedCategory] || []).map((sub, i) => (
                    <motion.button key={sub.label}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubSelect(sub.label)}
                      className="w-full flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-4 py-4 hover:border-[#1E5BB8]/30 hover:shadow-md transition-all group text-left">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#1E5BB8]/10">
                        {sub.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{sub.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Dispatch automatique du meilleur prestataire</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#1E5BB8]/10 text-[#1E5BB8] text-xs font-bold px-3 py-1.5 rounded-full shrink-0 group-hover:bg-[#1E5BB8] group-hover:text-white transition-all">
                        <Zap size={11} /> Dispatch
                      </div>
                    </motion.button>
                  ))}

                  {/* Skip — dispatch all in category */}
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    onClick={() => handleSubSelect('')}
                    className="w-full flex items-center gap-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 px-4 py-4 hover:border-[#1E5BB8]/30 hover:bg-blue-50/30 transition-all group text-left mt-2">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shrink-0">⚡</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-600">Peu importe, dispatchez-moi</p>
                      <p className="text-xs text-gray-400 mt-0.5">Tout prestataire disponible en {selectedCategory}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1E5BB8] shrink-0" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Browse mode — fallback when no dispatch result */}
            {step === 'browse' && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden flex flex-col">

                {/* Browse header */}
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-600 shrink-0" />
                    <span className="text-xs text-amber-700 font-semibold">
                      Aucun prestataire disponible maintenant — voici tous les prestataires
                    </span>
                  </div>
                  <button onClick={() => setStep('dispatching')}
                    className="text-xs text-[#1E5BB8] font-bold flex items-center gap-1 shrink-0 ml-2">
                    <RefreshCw size={11} /> Réessayer
                  </button>
                </div>

                <div className="px-4 py-2 bg-white/60 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <span className="text-sm text-gray-500">
                    <span className="font-black text-gray-900">{browsePros.length}</span> prestataire{browsePros.length > 1 ? 's' : ''}
                    {selectedSubcategory && (
                      <span className="ml-2 text-xs bg-[#1E5BB8]/10 text-[#1E5BB8] px-2 py-0.5 rounded-full font-semibold border border-[#1E5BB8]/20 inline-flex items-center gap-1">
                        {selectedSubcategory}
                        <button onClick={() => setSelectedSubcategory('')}><X size={9} /></button>
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles size={11} className="text-[#1E5BB8]" />
                    <span className="text-[#1E5BB8] font-medium">Classés par score</span>
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {browsePros.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-5xl mb-3">🔍</p>
                      <p className="font-bold text-gray-700">Aucun prestataire trouvé</p>
                      <button onClick={resetFilters} className="mt-4 text-[#1E5BB8] font-bold text-sm hover:underline">Réinitialiser les filtres</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {browsePros.map((pro, i) => (
                        <ProCard key={pro.id} pro={pro} rank={i} onClick={() => onSelectPro(pro)} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}