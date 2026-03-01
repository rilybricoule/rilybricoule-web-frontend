import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Phone, MessageSquare, Calendar, BadgeCheck,
  ChevronLeft, Clock, CheckCircle2, Briefcase, User,
  Navigation, Shield, Award, Camera,
} from 'lucide-react';
import type { Pro } from '../types';

interface ProProfilePageProps {
  pro: Pro;
  onBack: () => void;
  onBook: (pro: Pro) => void;
  onMessage: (pro: Pro) => void;
  onTrack: (pro: Pro) => void;
}

type Tab = 'about' | 'portfolio' | 'reviews';

export function ProProfilePage({ pro, onBack, onBook, onMessage, onTrack }: ProProfilePageProps) {
  const [tab, setTab] = useState<Tab>('about');

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5] overflow-hidden">

      {/* ── STICKY BACK BUTTON only (absolutely minimal fixed chrome) ─── */}
      <div className={`bg-gradient-to-r ${pro.avatarColor} shrink-0 px-4 pt-3 pb-0`}>
        <button onClick={onBack}
          className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-semibold bg-black/10 hover:bg-black/20 px-2.5 py-1.5 rounded-lg transition-all w-fit mb-3">
          <ChevronLeft size={13} /> Retour
        </button>
      </div>

      {/* ── SCROLLABLE AREA: header + stats + buttons + tab content ──── */}
      <div className="flex-1 min-h-0 overflow-y-auto">

        {/* HERO — large, rich, scrolls away */}
        <div className={`bg-gradient-to-br ${pro.avatarColor} relative overflow-hidden pb-6`}>
          <div className="absolute right-0 inset-y-0 flex items-center pr-4 text-[150px] font-black text-white/[0.06] select-none pointer-events-none leading-none">
            {pro.avatar}
          </div>
          <div className="relative px-5 pt-1">
            <div className="flex items-start gap-4">
              {/* Big avatar */}
              <div className="w-20 h-20 rounded-3xl bg-white/25 border-2 border-white/40 flex items-center justify-center text-3xl font-black text-white shadow-2xl shrink-0 mt-1">
                {pro.avatar}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-white leading-tight">{pro.name}</h1>
                  {pro.verified && <BadgeCheck size={18} className="text-white/85 shrink-0" />}
                </div>
                <p className="text-white/80 text-sm mt-0.5">{pro.specialty}</p>
                <p className="text-white/55 text-xs flex items-center gap-1 mt-1">
                  <MapPin size={10} />{pro.location}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    pro.available
                      ? 'bg-green-500/30 border border-green-400/40 text-green-100'
                      : 'bg-white/10 border border-white/20 text-white/60'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${pro.available ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                    {pro.available ? 'Disponible maintenant' : 'Indisponible'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full text-xs font-black text-white">
                    {pro.price} MAD/h
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row — inside hero, part of scrollable content */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { icon: <Star size={14} className="fill-amber-300 text-amber-300" />, val: pro.rating.toString(), sub: `${pro.reviews} avis` },
                { icon: <MapPin size={14} className="text-blue-200" />,               val: `${pro.distance}km`,    sub: 'de vous' },
                { icon: <CheckCircle2 size={14} className="text-green-300" />,        val: `${pro.completedJobs}`, sub: 'missions' },
                { icon: <Clock size={14} className="text-orange-300" />,              val: pro.responseTime,       sub: 'réponse' },
              ].map((s, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl py-2.5 flex flex-col items-center border border-white/10">
                  {s.icon}
                  <p className="font-black text-white text-sm mt-1 leading-tight">{s.val}</p>
                  <p className="text-white/55 text-[10px] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BADGES + ACTION BUTTONS — on white, just below hero */}
        <div className="bg-white px-4 py-4 border-b border-gray-100 shadow-sm">
          {(pro.verified || pro.completedJobs > 100) && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {pro.verified && (
                <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-bold">
                  <Shield size={10} /> Professionnel vérifié
                </span>
              )}
              {pro.completedJobs > 100 && (
                <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                  <Award size={10} /> Top prestataire
                </span>
              )}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onMessage(pro)}
              className="flex items-center justify-center gap-1.5 py-3 border-2 border-[#1E5BB8]/30 text-[#1E5BB8] rounded-xl font-bold text-sm hover:bg-blue-50 hover:border-[#1E5BB8]/60 transition-all">
              <MessageSquare size={15} /> Message
            </button>
            <button onClick={() => onBook(pro)} disabled={!pro.available}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all ${
                pro.available
                  ? 'bg-[#1E5BB8] hover:bg-[#243B82] text-white shadow-md shadow-blue-900/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              <Calendar size={15} /> Réserver
            </button>
            <button onClick={() => onTrack(pro)}
              className="flex items-center justify-center gap-1.5 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Navigation size={15} /> Suivre
            </button>
          </div>
        </div>

        {/* TABS — sticky so they stick as you scroll tab content */}
        <div className="sticky top-0 z-20 flex bg-white border-b border-gray-100 shadow-sm">
          {(['about', 'portfolio', 'reviews'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3.5 text-sm font-bold transition-all relative ${
                tab === t ? 'text-[#1E5BB8]' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {t === 'about' ? 'À propos' : t === 'portfolio' ? 'Portfolio' : `Avis (${pro.reviews})`}
              {tab === t && (
                <motion.div layoutId="tab-line"
                  className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#1E5BB8] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENT — no separate scroll container, just flows naturally */}
        <AnimatePresence mode="wait">

          {/* À PROPOS */}
          {tab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 space-y-3 pb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50/70 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1E5BB8]/10 flex items-center justify-center shrink-0">
                    <User size={14} className="text-[#1E5BB8]" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Bio</h3>
                </div>
                <div className="px-5 py-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{pro.bio}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50/70 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1E5BB8]/10 flex items-center justify-center shrink-0">
                    <Briefcase size={14} className="text-[#1E5BB8]" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Spécialités</h3>
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {pro.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-[#1E5BB8] px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-100 hover:bg-blue-100 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50/70 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1E5BB8]/10 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-[#1E5BB8]" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Contact</h3>
                </div>
                <div className="px-5 py-4">
                  <a href={`tel:${pro.phone}`}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 border border-gray-100 hover:border-[#1E5BB8]/30 hover:bg-blue-50/50 transition-all group">
                    <div className="w-11 h-11 bg-[#1E5BB8]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1E5BB8]/20 transition-colors">
                      <Phone size={17} className="text-[#1E5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Téléphone direct</p>
                      <p className="font-black text-gray-900 text-base">{pro.phone}</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* PORTFOLIO */}
          {tab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black text-gray-900">Portfolio</p>
                  <p className="text-xs text-gray-400 mt-0.5">Travaux réalisés par {pro.name}</p>
                </div>
                <span className="text-xs bg-[#1E5BB8] text-white px-3 py-1 rounded-full font-bold shadow-md shadow-blue-900/20">
                  {pro.portfolio.length} projet{pro.portfolio.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pro.portfolio.map(item => (
                  <motion.div key={item.id} whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-[#1E5BB8]/20 transition-all group">
                    <div className={`h-36 bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center`}>
                      <p className="text-7xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</p>
                    </div>
                    <div className="px-3 py-3">
                      <p className="text-sm font-bold text-gray-800 text-center">{item.label}</p>
                    </div>
                  </motion.div>
                ))}
                {Array(Math.max(0, 6 - pro.portfolio.length)).fill(0).map((_, i) => (
                  <div key={`ph-${i}`}
                    className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2"
                    style={{ height: 172 }}>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Camera size={20} className="text-gray-300" />
                    </div>
                    <p className="text-xs text-gray-300 font-medium">Photo à venir</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AVIS */}
          {tab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 space-y-3 pb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-5">
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-black text-amber-500 leading-none">{pro.rating}</p>
                    <div className="flex justify-center gap-0.5 my-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={15} className={i < Math.round(pro.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 font-semibold">{pro.reviews} avis</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === 5 ? 76 : star === 4 ? 17 : star === 3 ? 5 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3 font-medium text-right">{star}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.1 + (5 - star) * 0.05, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" />
                          </div>
                          <span className="text-[10px] text-gray-400 w-7 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {pro.reviewsList.map((review, i) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E5BB8] to-blue-400 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{review.author}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={13} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}