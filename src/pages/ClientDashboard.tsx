import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Star, MapPin, Clock, CheckCircle2, Plus,
  ArrowRight, Zap, ShieldCheck, Wrench, Paintbrush,
  Plug, Wind, Hammer, Package, ChevronRight, Calendar,
} from 'lucide-react';
import { NavbarClient } from '../components//navabar/NavbarClient';
import { useAuth } from '../context/AuthContext';

const services = [
  { icon: <Wrench size={22} />, label: 'Plomberie', count: 48, color: 'bg-blue-100 text-blue-600' },
  { icon: <Plug size={22} />, label: 'Électricité', count: 35, color: 'bg-blue-100 text-blue-600' },
  { icon: <Paintbrush size={22} />, label: 'Peinture', count: 62, color: 'bg-sky-100 text-sky-600' },
  { icon: <Wind size={22} />, label: 'Climatisation', count: 29, color: 'bg-cyan-100 text-cyan-600' },
  { icon: <Hammer size={22} />, label: 'Menuiserie', count: 41, color: 'bg-blue-100 text-blue-600' },
  { icon: <Package size={22} />, label: 'Déménagement', count: 18, color: 'bg-sky-100 text-sky-600' },
];

const featuredPros = [
  { name: 'Ahmed Karimi', specialty: 'Plombier certifié', rating: 4.9, reviews: 127, location: 'Casablanca', available: true, price: '150 MAD/h' },
  { name: 'Fatima Zouai', specialty: 'Électricienne', rating: 4.8, reviews: 89, location: 'Rabat', available: true, price: '130 MAD/h' },
  { name: 'Youssef Ben Ali', specialty: 'Peintre décorateur', rating: 4.7, reviews: 204, location: 'Marrakech', available: false, price: '120 MAD/h' },
];

const myRequests = [
  { id: '#1042', service: 'Plomberie - Fuite robinet', status: 'En cours', pro: 'Ahmed K.', date: '20 Fév 2026', statusColor: 'bg-blue-100 text-blue-700' },
  { id: '#1039', service: 'Peinture salon', status: 'Terminé', pro: 'Youssef B.', date: '10 Fév 2026', statusColor: 'bg-green-100 text-green-700' },
  { id: '#1035', service: 'Électricité - Tableau', status: 'En attente', pro: '—', date: '5 Fév 2026', statusColor: 'bg-amber-100 text-amber-700' },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
};

export function ClientDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Client';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarClient />

      {/* Offset for fixed navbar */}
      <div className="pt-16">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <p className="text-blue-200 text-sm font-medium mb-1">{greeting},</p>
              <h1 className="text-3xl font-bold mb-1">{firstName} 👋</h1>
              <p className="text-blue-200 text-sm">Trouvez le professionnel qu'il vous faut, rapidement et en toute confiance.</p>
            </motion.div>

            {/* Search bar */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Plomberie, électricité, peinture..."
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400" />
              </div>
              <button className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm flex items-center gap-2">
                <MapPin size={16} /> Casablanca
              </button>
            </motion.div>

            {/* Stats strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex gap-6 mt-8">
              {[
                { icon: <ShieldCheck size={16} />, label: '100% Vérifiés' },
                { icon: <Zap size={16} />, label: 'Réponse < 2h' },
                { icon: <Star size={16} />, label: '4.8 / 5 moyen' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-2 text-blue-100 text-sm">
                  <span className="text-blue-300">{stat.icon}</span>
                  {stat.label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* Service Categories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Catégories de services</h2>
              <a href="#" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={14} />
              </a>
            </div>
            <motion.div variants={stagger.container} initial="hidden" animate="visible"
              className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {services.map(s => (
                <motion.div key={s.label} variants={stagger.item}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.count} pros</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Featured pros */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Professionnels disponibles</h2>
                <a href="#" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                  Voir tout <ChevronRight size={14} />
                </a>
              </div>
              <motion.div variants={stagger.container} initial="hidden" animate="visible" className="space-y-3">
                {featuredPros.map(pro => (
                  <motion.div key={pro.name} variants={stagger.item}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                      {pro.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{pro.name}</p>
                        {pro.available
                          ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Disponible</span>
                          : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Occupé</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{pro.specialty}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Star size={12} className="fill-amber-400 text-amber-400" /> {pro.rating} ({pro.reviews} avis)
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={12} /> {pro.location}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">{pro.price}</span>
                      </div>
                    </div>
                    <button className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                      Contacter <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: My requests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Mes demandes</h2>
                <button className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <Plus size={13} /> Nouvelle
                </button>
              </div>
              <div className="space-y-3">
                {myRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{req.service}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${req.statusColor}`}>{req.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} /> {req.pro}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {req.date}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{req.id}</p>
                  </div>
                ))}
              </div>

              {/* Quick action card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-1">Besoin d'aide rapide ?</h3>
                <p className="text-blue-200 text-sm mb-4">Publiez une demande et recevez des devis en moins de 2h.</p>
                <button className="w-full bg-white text-blue-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Poster une demande
                </button>
              </div>
            </div>
          </div>

          {/* Bottom promo strip */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <ShieldCheck size={24} className="text-blue-600" />, title: 'Pros vérifiés', desc: 'Chaque prestataire est vérifié et évalué par notre équipe.' },
              { icon: <Zap size={24} className="text-blue-600" />, title: 'Réponse rapide', desc: 'Obtenez des devis en moins de 2h, 7j/7.' },
              { icon: <Star size={24} className="text-blue-600" />, title: 'Satisfaction garantie', desc: 'Des milliers de clients satisfaits à travers le Maroc.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}