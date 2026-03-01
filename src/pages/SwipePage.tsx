import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, BadgeCheck, Clock, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import type { Pro } from '../types/index';

interface SwipePageProps {
  pros: Pro[];
  onSelectPro: (pro: Pro) => void;
}

function SwipeCard({ pro, onSwipe, isTop }: { pro: Pro; onSwipe: (dir: 'left' | 'right') => void; isTop: boolean }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [30, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -30], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 120) onSwipe('right');
    else if (info.offset.x < -120) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, position: 'absolute', inset: 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={isTop ? {} : { scale: 0.95, y: 8 }}
      className="cursor-grab active:cursor-grabbing select-none"
    >
      {/* LIKE stamp */}
      <motion.div style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 z-20 rotate-[-20deg] border-4 border-green-500 rounded-xl px-4 py-2">
        <p className="text-green-500 font-black text-2xl">LIKE 💚</p>
      </motion.div>

      {/* NOPE stamp */}
      <motion.div style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 z-20 rotate-[20deg] border-4 border-red-500 rounded-xl px-4 py-2">
        <p className="text-red-500 font-black text-2xl">NOPE ❌</p>
      </motion.div>

      {/* Card */}
      <div className="h-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Card header / visual */}
        <div className={`h-52 bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center relative`}>
          <div className="text-6xl font-black text-white/30 select-none">{pro.avatar}</div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-xl">{pro.name}</p>
                {pro.verified && <BadgeCheck size={18} className="text-blue-300" />}
              </div>
              <p className="text-white/80 text-sm">{pro.specialty}</p>
            </div>
          </div>
          {pro.available && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              ● Disponible
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-amber-50 rounded-xl py-2">
              <p className="font-bold text-amber-600 text-lg flex items-center justify-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" /> {pro.rating}
              </p>
              <p className="text-xs text-gray-500">{pro.reviews} avis</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-2">
              <p className="font-bold text-blue-700 text-lg">{pro.price}</p>
              <p className="text-xs text-gray-500">MAD/h</p>
            </div>
            <div className="text-center bg-green-50 rounded-xl py-2">
              <p className="font-bold text-green-700 text-sm">{pro.distance} km</p>
              <p className="text-xs text-gray-500">de vous</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">{pro.bio}</p>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={12} className="text-blue-400" /> {pro.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Clock size={12} className="text-blue-400" /> Répond en {pro.responseTime} · {pro.completedJobs} missions
          </div>

          <div className="flex flex-wrap gap-2">
            {pro.tags.map(tag => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">{tag}</span>
            ))}
          </div>

          {/* Portfolio */}
          <div className="flex gap-2 mt-4">
            {pro.portfolio.map(item => (
              <div key={item.id} className="flex-1 bg-gray-50 rounded-xl py-3 text-center border border-gray-100">
                <p className="text-2xl">{item.emoji}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SwipePage({ pros, onSelectPro }: SwipePageProps) {
  const [stack, setStack] = useState(pros.map(p => p.id));
  const [liked, setLiked] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState<'like' | 'nope' | null>(null);
  const [showLiked, setShowLiked] = useState(false);

  const currentId = stack[stack.length - 1];
  const currentPro = pros.find(p => p.id === currentId);
  const nextPro = pros.find(p => p.id === stack[stack.length - 2]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentId) return;
    setLastAction(dir === 'right' ? 'like' : 'nope');
    if (dir === 'right') setLiked(prev => [...prev, currentId]);
    setStack(prev => prev.slice(0, -1));
    setTimeout(() => setLastAction(null), 700);
  };

  const likedPros = pros.filter(p => liked.includes(p.id));

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Vous avez tout vu !</h2>
        <p className="text-gray-500 text-sm mb-6">Vous avez aimé {liked.length} prestataire{liked.length > 1 ? 's' : ''}.</p>
        {liked.length > 0 && (
          <button onClick={() => setShowLiked(!showLiked)} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Voir mes favoris ({liked.length})
          </button>
        )}
        <button onClick={() => setStack(pros.map(p => p.id))} className="mt-3 text-blue-600 font-medium text-sm hover:underline">
          Recommencer
        </button>
        {showLiked && likedPros.length > 0 && (
          <div className="mt-6 w-full space-y-3 max-w-sm">
            {likedPros.map(pro => (
              <div key={pro.id} onClick={() => onSelectPro(pro)}
                className="flex items-center gap-3 bg-white border border-green-200 rounded-2xl px-4 py-3 cursor-pointer hover:border-green-400 transition-all text-left">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>{pro.avatar}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{pro.name}</p>
                  <p className="text-xs text-gray-500">{pro.specialty} · {pro.price} MAD/h</p>
                </div>
                <Heart size={16} className="text-red-500 fill-red-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Découvrir</h2>
          <p className="text-xs text-gray-500">{stack.length} prestataire{stack.length > 1 ? 's' : ''} restant</p>
        </div>
        <div className="flex items-center gap-2">
          {liked.length > 0 && (
            <button onClick={() => setShowLiked(!showLiked)} className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
              <Heart size={13} className="fill-red-500" /> {liked.length} aimé{liked.length > 1 ? 's' : ''}
            </button>
          )}
          <div className="bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Zap size={12} /> Swipe
          </div>
        </div>
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {lastAction && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-white text-lg shadow-xl ${lastAction === 'like' ? 'bg-green-500' : 'bg-red-500'}`}>
            {lastAction === 'like' ? '💚 Aimé !' : '❌ Passé'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liked side panel */}
      <AnimatePresence>
        {showLiked && liked.length > 0 && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Heart size={16} className="text-red-500 fill-red-500" /> Mes favoris</h3>
              <button onClick={() => setShowLiked(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {likedPros.map(pro => (
                <div key={pro.id} onClick={() => { setShowLiked(false); onSelectPro(pro); }}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>{pro.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{pro.name}</p>
                    <p className="text-xs text-gray-500">{pro.price} MAD/h · ⭐ {pro.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="relative w-full max-w-sm h-[520px]">
          {/* Next card (behind) */}
          {nextPro && (
            <div className="absolute inset-0 scale-95 translate-y-2 pointer-events-none">
              <div className={`h-full bg-gradient-to-br ${nextPro.avatarColor} rounded-3xl opacity-40`} />
            </div>
          )}
          {/* Current card */}
          {currentPro && (
            <SwipeCard key={currentPro.id} pro={currentPro} onSwipe={handleSwipe} isTop={true} />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-6 mt-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white border-2 border-red-200 shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-400 transition-all">
            <X size={28} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => currentPro && onSelectPro(currentPro)}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-blue-700 transition-colors shadow-md">
            Voir profil
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white border-2 border-green-200 shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 hover:border-green-400 transition-all">
            <Heart size={28} />
          </motion.button>
        </div>

        {/* Swipe hint */}
        <p className="text-xs text-gray-400 mt-4 flex items-center gap-4">
          <span className="flex items-center gap-1"><ArrowLeft size={12} /> Passer</span>
          <span>·</span>
          <span className="flex items-center gap-1">Aimer <ArrowRight size={12} /></span>
        </p>
      </div>
    </div>
  );
}