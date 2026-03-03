import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Clock, CheckCircle2, ArrowRight, Zap,
  TrendingUp, DollarSign, ClipboardList, MessageSquare,
  ChevronRight, Eye, BarChart2, Users, Calendar, Plus,
  Award, ThumbsUp,
} from 'lucide-react';
import { NavbarPrestataire } from '../components/navabar/NavbarPrestataire';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Missions ce mois', value: '14', trend: '+3', icon: <ClipboardList size={20} />, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'Revenus (MAD)', value: '2 450', trend: '+12%', icon: <DollarSign size={20} />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { label: 'Note moyenne', value: '4.8', trend: '★', icon: <Star size={20} />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { label: 'Clients satisfaits', value: '98%', trend: '+2%', icon: <ThumbsUp size={20} />, color: 'bg-orange-50 text-orange-600 border-orange-200' },
];

const newRequests = [
  { id: '#2051', service: 'Réparation robinet', client: 'Karim B.', location: 'Casablanca', budget: '200–350 MAD', urgency: 'Urgent', time: 'Il y a 10 min' },
  { id: '#2049', service: 'Installation chauffe-eau', client: 'Sara M.', location: 'Mohammedia', budget: '500–800 MAD', urgency: 'Normal', time: 'Il y a 45 min' },
  { id: '#2046', service: 'Détection fuite', client: 'Omar T.', location: 'Casablanca', budget: '150–250 MAD', urgency: 'Urgent', time: 'Il y a 2h' },
];

const activeMissions = [
  { id: '#1042', service: 'Plomberie - Fuite robinet', client: 'Ahmed K.', date: '22 Fév 2026', status: 'En cours', payment: '300 MAD' },
  { id: '#1038', service: 'Installation évier cuisine', client: 'Nadia L.', date: '18 Fév 2026', status: 'En attente paiement', payment: '450 MAD' },
];

const recentReviews = [
  { client: 'Karim B.', rating: 5, comment: 'Excellent travail, très professionnel et ponctuel.', date: '19 Fév 2026' },
  { client: 'Sara M.', rating: 5, comment: 'Intervention rapide, je recommande vivement !', date: '15 Fév 2026' },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } },
};

export function PrestataireDashboard() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'Pro';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarPrestataire />

      <div className="pt-16">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-orange-200 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl font-bold mb-1">{firstName} 👷</h1>
                <p className="text-orange-100 text-sm">Votre tableau de bord professionnel — gérez vos missions et développez votre activité.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/30">
                <div className={`w-3 h-3 rounded-full ${availability ? 'bg-green-400' : 'bg-gray-400'} shadow-sm`} />
                <div>
                  <p className="text-white font-semibold text-sm">{availability ? 'Disponible' : 'Indisponible'}</p>
                  <p className="text-orange-200 text-xs">Statut de disponibilité</p>
                </div>
                <button onClick={() => setAvailability(!availability)}
                  className={`ml-2 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${availability ? 'bg-green-400' : 'bg-gray-400'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${availability ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </motion.div>
            </div>

            {/* Stats strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {stats.map(s => (
                <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-200">{s.icon}</span>
                    <span className="text-xs text-green-300 font-semibold">{s.trend}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-orange-200 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left col: New requests + Active missions */}
            <div className="lg:col-span-2 space-y-6">

              {/* New requests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Nouvelles demandes</h2>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{newRequests.length}</span>
                  </div>
                  <a href="#" className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight size={14} />
                  </a>
                </div>
                <motion.div variants={stagger.container} initial="hidden" animate="visible" className="space-y-3">
                  {newRequests.map(req => (
                    <motion.div key={req.id} variants={stagger.item}
                      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">{req.service}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.urgency === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                              {req.urgency === 'Urgent' && '🔴 '}{req.urgency}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1"><Users size={11} /> {req.client}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} /> {req.location}</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {req.time}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-orange-600">{req.budget}</p>
                          <p className="text-xs text-gray-400">{req.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
                          Accepter <ArrowRight size={14} />
                        </button>
                        <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1">
                          <Eye size={14} /> Voir
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Active missions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Missions actives</h2>
                  <a href="#" className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">
                    Historique <ChevronRight size={14} />
                  </a>
                </div>
                <div className="space-y-3">
                  {activeMissions.map(m => (
                    <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-sm transition-all flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <ClipboardList size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{m.service}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                          <span>{m.client}</span>
                          <span className="flex items-center gap-1"><Calendar size={11} /> {m.date}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-orange-700 text-sm">{m.payment}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col: Reviews + Quick actions */}
            <div className="space-y-5">

              {/* Quick actions */}
              <div className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-1 flex items-center gap-2"><Zap size={18} /> Actions rapides</h3>
                <p className="text-orange-100 text-xs mb-4">Gérez votre activité efficacement</p>
                <div className="space-y-2">
                  {[
                    { label: 'Envoyer un devis', icon: <Plus size={14} /> },
                    { label: 'Voir mes messages', icon: <MessageSquare size={14} /> },
                    { label: 'Mes statistiques', icon: <BarChart2 size={14} /> },
                  ].map(a => (
                    <button key={a.label} className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors text-left">
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile completeness */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Award size={16} className="text-orange-500" /> Profil</h3>
                  <span className="text-xs text-orange-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-gray-500 mb-3">Complétez votre profil pour attirer plus de clients.</p>
                <button className="w-full border border-orange-200 text-orange-600 text-sm font-semibold py-2 rounded-xl hover:bg-orange-50 transition-colors">
                  Compléter mon profil
                </button>
              </div>

              {/* Recent reviews */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> Avis récents
                </h3>
                <div className="space-y-4">
                  {recentReviews.map((r, i) => (
                    <div key={i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">{r.client}</p>
                        <div className="flex">
                          {Array(r.rating).fill(0).map((_, j) => <Star key={j} size={11} className="fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                    </div>
                  ))}
                </div>
                <a href="#" className="mt-3 block text-center text-xs text-orange-600 font-medium hover:underline">
                  Voir tous les avis →
                </a>
              </div>
            </div>
          </div>

          {/* Bottom KPI strip */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp size={22} className="text-orange-500" />, title: 'Croissance ce mois', desc: 'Vos revenus ont augmenté de 12% par rapport au mois dernier.' },
              { icon: <CheckCircle2 size={22} className="text-green-500" />, title: 'Taux de réussite', desc: '96% de vos missions sont évaluées positivement par les clients.' },
              { icon: <Clock size={22} className="text-orange-500" />, title: 'Temps de réponse', desc: 'Votre temps de réponse moyen est de 28 minutes — excellent !' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start hover:border-orange-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">{item.icon}</div>
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