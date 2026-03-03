import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, CheckCircle, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import type { Pro } from '../types/index';

interface ReviewPageProps {
  pro: Pro;
  onBack: () => void;
  onSubmit: () => void;
}

const CRITERIA = [
  { key: 'ponctualite', label: 'Ponctualité', emoji: '⏱️' },
  { key: 'qualite', label: 'Qualité du travail', emoji: '⭐' },
  { key: 'communication', label: 'Communication', emoji: '💬' },
  { key: 'proprete', label: 'Propreté', emoji: '✨' },
];

const QUICK_TAGS = ['Ponctuel', 'Professionnel', 'Propre', 'Efficace', 'Aimable', 'Rapide', 'Qualité excellente', 'Prix correct', 'Je recommande'];

export function ReviewPage({ pro, onBack, onSubmit }: ReviewPageProps) {
  const [globalRating, setGlobalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onSubmit, 2500);
  };

  const ratingLabels = ['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !'];

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star size={52} className="fill-amber-400 text-amber-400" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Merci pour votre avis !</h2>
          <p className="text-gray-500 text-sm">Votre évaluation aide les autres clients à choisir le bon prestataire.</p>
          <div className="flex justify-center mt-4 gap-0.5">
            {Array(globalRating).fill(0).map((_, i) => (
              <Star key={i} size={28} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={22} /></button>
        <div>
          <p className="font-bold text-gray-900">Évaluer l'intervention</p>
          <p className="text-xs text-gray-500">Partagez votre expérience avec {pro.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 max-w-lg mx-auto w-full">
        {/* Pro info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
            {pro.avatar}
          </div>
          <div>
            <p className="font-bold text-gray-900">{pro.name}</p>
            <p className="text-sm text-gray-500">{pro.specialty}</p>
          </div>
        </div>

        {/* Global rating */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="font-bold text-gray-900 mb-1">Note globale</p>
          <p className="text-sm text-gray-400 mb-4">Quelle est votre satisfaction générale ?</p>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button key={star}
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setGlobalRating(star)}
                className="transition-all">
                <Star size={36}
                  className={star <= (hoverRating || globalRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {(hoverRating || globalRating) > 0 && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-sm font-semibold text-amber-600">
                {ratingLabels[hoverRating || globalRating]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Criteria ratings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="font-bold text-gray-900 text-sm mb-4">Détails de l'évaluation</p>
          <div className="space-y-4">
            {CRITERIA.map(c => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xl w-7 shrink-0">{c.emoji}</span>
                <span className="text-sm text-gray-700 font-medium flex-1">{c.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setCriteriaRatings(prev => ({ ...prev, [c.key]: s }))}>
                      <Star size={18} className={s <= (criteriaRatings[c.key] || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick tags */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2"><ThumbsUp size={15} className="text-blue-500" /> Ce que vous avez aimé</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                {selectedTags.includes(tag) && '✓ '}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <label className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-3">
            <MessageSquare size={15} className="text-blue-500" /> Votre commentaire <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea rows={4} placeholder="Partagez votre expérience avec la communauté..."
            value={comment} onChange={e => setComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" />
          <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</p>
        </div>
      </div>

      {/* Submit */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 shadow-lg">
        <motion.button onClick={handleSubmit} disabled={globalRating === 0}
          whileHover={globalRating > 0 ? { scale: 1.01 } : {}}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${globalRating > 0 ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <Send size={18} /> Publier mon avis
        </motion.button>
        <p className="text-center text-xs text-gray-400 mt-2">Votre avis sera visible publiquement après modération</p>
      </div>
    </div>
  );
}