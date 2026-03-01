import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, ArrowRight, CheckCircle, Zap,
  Wrench, Shield, Brush, Trees, Trash2, DoorOpen, Lock,
  Wind, Truck, Clock, BadgeCheck, ChevronRight,
} from 'lucide-react';
import type { Pro, ServiceCategory } from '../types';

interface ExplorePageProps {
  filteredPros: Pro[];
  onSelectPro: (pro: Pro) => void;
  onNavigate: (view: any) => void;
  onCategoryFilter: (cat: ServiceCategory) => void;
}

const FEATURED_SERVICES = [
  { label: 'Plomberie',     icon: <Wrench size={22} />,   color: 'from-blue-500 to-blue-700',     bg: 'bg-blue-50',   accent: 'text-blue-600',   count: 24 },
  { label: 'Électricité',   icon: <Zap size={22} />,      color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', accent: 'text-yellow-600', count: 18 },
  { label: 'Peinture',      icon: <Brush size={22} />,    color: 'from-pink-500 to-rose-500',     bg: 'bg-pink-50',   accent: 'text-pink-600',   count: 15 },
  { label: 'Jardinage',     icon: <Trees size={22} />,    color: 'from-green-500 to-emerald-600', bg: 'bg-green-50',  accent: 'text-green-600',  count: 12 },
  { label: 'Ménage',        icon: <Trash2 size={22} />,   color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', accent: 'text-purple-600', count: 31 },
  { label: 'Menuiserie',    icon: <DoorOpen size={22} />, color: 'from-amber-500 to-yellow-600',  bg: 'bg-amber-50',  accent: 'text-amber-600',  count: 9  },
  { label: 'Serrurerie',    icon: <Lock size={22} />,     color: 'from-slate-500 to-gray-700',    bg: 'bg-slate-50',  accent: 'text-slate-600',  count: 7  },
  { label: 'Climatisation', icon: <Wind size={22} />,     color: 'from-cyan-500 to-sky-600',      bg: 'bg-cyan-50',   accent: 'text-cyan-600',   count: 11 },
  { label: 'Déménagement',  icon: <Truck size={22} />,    color: 'from-orange-500 to-red-500',    bg: 'bg-orange-50', accent: 'text-orange-600', count: 6  },
  { label: 'Sécurité',      icon: <Shield size={22} />,   color: 'from-red-500 to-rose-600',      bg: 'bg-red-50',    accent: 'text-red-600',    count: 8  },
];

const TOP_PROS = [
  { id: 1, name: 'Ahmed Karimi',   specialty: 'Plombier certifié',        rating: 4.9, reviews: 127, avatar: 'AK', color: 'from-blue-500 to-blue-700',    verified: true,  price: 150, distance: 1.2, available: true  },
  { id: 2, name: 'Fatima Zouai',   specialty: 'Électricienne diplômée',   rating: 4.8, reviews: 89,  avatar: 'FZ', color: 'from-yellow-500 to-orange-500', verified: true,  price: 130, distance: 2.1, available: true  },
  { id: 4, name: 'Laila Mansouri', specialty: 'Jardinière paysagiste',    rating: 4.9, reviews: 63,  avatar: 'LM', color: 'from-green-500 to-emerald-600', verified: false, price: 100, distance: 3.4, available: true  },
  { id: 6, name: 'Zineb Alaoui',   specialty: 'Aide ménagère',            rating: 4.8, reviews: 312, avatar: 'ZA', color: 'from-purple-500 to-violet-600', verified: true,  price: 80,  distance: 1.5, available: true  },
];

export function ExplorePage({ filteredPros, onSelectPro, onNavigate, onCategoryFilter }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate('services');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F3F5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#243B82] via-[#1E5BB8] to-[#1a4fa0] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-300/10 rounded-full blur-xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 text-white/90 px-3 py-1.5 rounded-full mb-5 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              +200 prestataires disponibles à Casablanca
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Trouvez le prestataire<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                qu'il vous faut
              </span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Plombier, électricien, jardinier... Réservez en quelques clics, suivez en temps réel.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-blue-900/40">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search size={20} className="text-gray-400 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Quel service recherchez-vous ?"
                    className="flex-1 bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400 text-sm"
                  />
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 border-l border-gray-100">
                  <MapPin size={16} className="text-[#1E5BB8]" />
                  <span className="text-sm text-gray-600 font-medium">Casablanca</span>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-[#E30613] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-500/30 text-sm whitespace-nowrap"
                >
                  Rechercher
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                {['Urgence 24h/7', 'Paiement sécurisé', 'Pros vérifiés'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-white/60 text-xs">
                    <CheckCircle size={12} className="text-green-400" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Nos services</h2>
            <p className="text-gray-500 text-sm mt-1">Choisissez votre catégorie</p>
          </div>
          <button onClick={() => onNavigate('services')}
            className="flex items-center gap-1.5 text-[#1E5BB8] font-bold text-sm hover:gap-2.5 transition-all">
            Tout voir <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {FEATURED_SERVICES.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { onCategoryFilter(s.label as ServiceCategory); onNavigate('services'); }}
              className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#1E5BB8]/30 hover:shadow-lg hover:shadow-blue-100 transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <p className="text-sm font-bold text-gray-800 group-hover:text-[#1E5BB8] transition-colors">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.count} pros</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Top Pros */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Prestataires les mieux notés</h2>
            <p className="text-gray-500 text-sm mt-1">Disponibles près de vous</p>
          </div>
          <button onClick={() => onNavigate('services')}
            className="flex items-center gap-1.5 text-[#1E5BB8] font-bold text-sm hover:gap-2.5 transition-all">
            Voir tous <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_PROS.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => {
                const fullPro = filteredPros.find(p => p.id === pro.id);
                if (fullPro) onSelectPro(fullPro);
              }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#1E5BB8]/30 hover:shadow-xl hover:shadow-blue-100/50 transition-all cursor-pointer group"
            >
              <div className={`h-28 bg-gradient-to-br ${pro.color} relative flex items-center justify-center`}>
                <div className="text-5xl font-black text-white/20">{pro.avatar}</div>
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${pro.available ? 'bg-green-500/90 text-white' : 'bg-gray-500/80 text-white'}`}>
                    {pro.available ? '● Disponible' : '○ Indisponible'}
                  </span>
                </div>
                {pro.verified && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{pro.name}</p>
                    <p className="text-xs text-gray-500">{pro.specialty}</p>
                  </div>
                  <span className="font-black text-[#1E5BB8] text-sm">{pro.price}<span className="text-xs font-normal text-gray-400">MAD</span></span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star size={11} className="fill-amber-400 text-amber-400" /> {pro.rating}
                    <span className="text-gray-400 font-normal">({pro.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={10} /> {pro.distance} km
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} /> Rapide</span>
                  <span className="text-xs text-[#1E5BB8] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Voir profil <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-gradient-to-r from-[#243B82] to-[#1E5BB8] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
          <div>
            <h3 className="text-2xl font-black text-white mb-2">Besoin urgent ?</h3>
            <p className="text-white/70 text-sm">Des prestataires disponibles en moins de 30 minutes.</p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="flex items-center gap-2 bg-[#E30613] hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-900/30 whitespace-nowrap text-sm"
          >
            Trouver maintenant <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}