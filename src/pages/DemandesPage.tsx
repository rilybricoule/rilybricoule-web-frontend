import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, ChevronDown, XCircle, MessageSquare,
  Users, ChevronRight, Send, AlertCircle, FileText, Zap,
  MapPin, Check, BadgeCheck, Star, ExternalLink,
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockdata';
import type { ServiceCategory } from '../types';

const MAX_RESPONSES = 5;

export interface Demand {
  id: number;
  title: string;
  description: string;
  category: ServiceCategory;
  location: string;
  createdAt: string;
  status: 'open' | 'closed';
  responses: DemandResponse[];
  urgent: boolean;
}

export interface DemandResponse {
  proId: number;
  proName: string;
  proAvatar: string;
  proColor: string;
  proSpecialty: string;
  proRating: number;
  proReviews: number;
  proVerified: boolean;
  message: string;
  time: string;
  price: number;
}

const MOCK_DEMANDS: Demand[] = [
  {
    id: 1,
    title: "Fuite sous l'évier cuisine",
    description: "L'eau coule depuis 2 jours sous l'évier, urgence car risque d'inondation. Appartement au 3ème étage.",
    category: 'Plomberie',
    location: '12 Rue Abou Inane, Maarif, Casablanca',
    createdAt: '20 Fév 2026',
    status: 'open',
    urgent: true,
    responses: [
      {
        proId: 1, proName: 'Ahmed Karimi', proAvatar: 'AK', proColor: 'from-blue-500 to-blue-700',
        proSpecialty: 'Plombier certifié', proRating: 4.8, proReviews: 124, proVerified: true,
        message: "Je suis disponible aujourd'hui. Intervention possible dans 30 min depuis votre adresse. Tarif 150 MAD/h.", time: '10:15', price: 150,
      },
      {
        proId: 7, proName: 'Hamid Chraibi', proAvatar: 'HC', proColor: 'from-slate-500 to-gray-700',
        proSpecialty: 'Serrurier · Plombier', proRating: 4.7, proReviews: 78, proVerified: true,
        message: "Disponible maintenant, 10 ans d'expérience. 160 MAD/h, déplacement offert pour Maarif.", time: '10:22', price: 160,
      },
    ],
  },
  {
    id: 2,
    title: 'Peinture salon 30m²',
    description: 'Besoin de repeindre le salon et entrée. 2 couleurs au choix. Devis souhaité avant intervention.',
    category: 'Peinture',
    location: '47 Bd Zerktouni, Gauthier, Casablanca',
    createdAt: '15 Fév 2026',
    status: 'closed',
    urgent: false,
    responses: [
      {
        proId: 3, proName: 'Youssef Ben Ali', proAvatar: 'YB', proColor: 'from-pink-500 to-rose-500',
        proSpecialty: 'Peintre décorateur', proRating: 4.6, proReviews: 91, proVerified: false,
        message: 'Je peux faire ça ce week-end, 120 MAD/h, matériaux inclus dans le devis.', time: '09:00', price: 120,
      },
    ],
  },
];

/* ── Pro Profile Mini Card (inside demand detail) ──────────────────────────── */
function ProResponseCard({ r, onViewProfile }: { r: DemandResponse; onViewProfile: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Pro header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.proColor} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow`}>
          {r.proAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-black text-gray-900 text-sm">{r.proName}</p>
            {r.proVerified && <BadgeCheck size={13} className="text-blue-500 shrink-0" />}
          </div>
          <p className="text-xs text-gray-400">{r.proSpecialty}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-xs text-amber-600 font-bold">
              <Star size={10} className="fill-amber-400 text-amber-400" /> {r.proRating}
              <span className="text-gray-400 font-normal ml-0.5">({r.proReviews})</span>
            </span>
            <span className="text-xs font-black text-[#1E5BB8]">{r.price} MAD/h</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-gray-400">{r.time}</p>
        </div>
      </div>

      {/* Message */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 leading-relaxed">{r.message}</p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onViewProfile}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1E5BB8] hover:bg-[#243B82] text-white rounded-xl font-bold text-xs transition-colors shadow-md shadow-blue-900/20"
        >
          <ExternalLink size={12} /> Voir profil
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-[#1E5BB8]/30 text-[#1E5BB8] rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors">
          <MessageSquare size={12} /> Répondre
        </button>
        <button className="flex items-center justify-center gap-1 py-2.5 px-3 border-2 border-green-200 text-green-600 rounded-xl font-bold text-xs hover:bg-green-50 transition-colors">
          <Check size={12} /> Choisir
        </button>
      </div>
    </div>
  );
}

/* ── Demand Card (list item) ───────────────────────────────────────────────── */
function DemandCard({ demand, onOpen }: { demand: Demand; onOpen: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#1E5BB8]/30 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 text-sm">{demand.title}</p>
            {demand.urgent && (
              <span className="text-[10px] bg-[#E30613]/10 text-[#E30613] border border-[#E30613]/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap size={9} /> Urgent
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400">{demand.category} · {demand.createdAt}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={9} className="text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-400 truncate">{demand.location}</span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
          demand.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {demand.status === 'open' ? '● Ouverte' : '○ Fermée'}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{demand.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {demand.responses.slice(0, 3).map((r, i) => (
            <div key={i}
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${r.proColor} flex items-center justify-center text-white font-bold text-[10px] border-2 border-white shadow ${i > 0 ? '-ml-2' : ''}`}>
              {r.proAvatar}
            </div>
          ))}
          <span className="text-xs text-gray-500 font-semibold ml-1">
            {demand.responses.length}/{MAX_RESPONSES} réponses
          </span>
        </div>
        <span className="text-xs text-[#1E5BB8] font-bold flex items-center gap-1">
          Voir <ChevronRight size={12} />
        </span>
      </div>
      <div className="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#1E5BB8] to-[#243B82] rounded-full transition-all"
          style={{ width: `${(demand.responses.length / MAX_RESPONSES) * 100}%` }} />
      </div>
    </motion.div>
  );
}

/* ── Demand Detail ─────────────────────────────────────────────────────────── */
function DemandDetail({ demand, onBack, onClose, onViewPro }: {
  demand: Demand; onBack: () => void; onClose: () => void; onViewPro: (proId: number) => void;
}) {
  const [showClose, setShowClose] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1"><ChevronLeft size={22} /></button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 truncate">{demand.title}</p>
          <p className="text-xs text-gray-500">{demand.category} · {demand.createdAt}</p>
        </div>
        {demand.status === 'open' && (
          <button onClick={() => setShowClose(true)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0">
            <XCircle size={13} /> Fermer
          </button>
        )}
      </div>

      {/* Confirm close modal */}
      <AnimatePresence>
        {showClose && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={28} className="text-red-500" />
              </div>
              <h3 className="font-black text-gray-900 text-lg text-center mb-2">Fermer la demande ?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                Les prestataires ne pourront plus répondre à cette demande. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowClose(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button onClick={() => { onClose(); setShowClose(false); }}
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-md">
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Demand info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                demand.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>{demand.status === 'open' ? '● Ouverte' : '○ Fermée'}</span>
              {demand.urgent && (
                <span className="text-xs bg-[#E30613]/10 text-[#E30613] border border-[#E30613]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <Zap size={10} /> Urgent
                </span>
              )}
              <span className="text-xs bg-blue-50 text-[#1E5BB8] px-2.5 py-1 rounded-full font-bold border border-blue-100">{demand.category}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{demand.description}</p>
          </div>
          <div className="px-5 py-3 flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <MapPin size={13} className="text-[#1E5BB8]" />
            </div>
            <p className="text-sm text-gray-600 font-medium">{demand.location}</p>
          </div>
        </div>

        {/* Responses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900 flex items-center gap-2">
              <Users size={15} className="text-[#1E5BB8]" />
              Réponses des prestataires
            </p>
            <span className="text-xs font-black bg-[#1E5BB8] text-white px-2.5 py-1 rounded-full">
              {demand.responses.length}/{MAX_RESPONSES}
            </span>
          </div>

          {demand.responses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">En attente de réponses</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Les prestataires de la catégorie "{demand.category}" dans votre zone seront notifiés</p>
            </div>
          ) : (
            <div className="space-y-3">
              {demand.responses.map((r, i) => (
                <ProResponseCard key={i} r={r} onViewProfile={() => onViewPro(r.proId)} />
              ))}
            </div>
          )}

          {demand.responses.length >= MAX_RESPONSES && (
            <div className="mt-3 flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <AlertCircle size={15} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                Limite de {MAX_RESPONSES} réponses atteinte. Les nouveaux prestataires ne peuvent plus répondre à cette demande.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Create Form ──────────────────────────────────────────────────────────── */
interface CreateForm {
  title: string;
  description: string;
  category: ServiceCategory;
  location: string;
  urgent: boolean;
  catOpen: boolean;
  useMyLocation: boolean;
}

function CreateDemand({ onBack, onCreate, userAddress }: {
  onBack: () => void;
  onCreate: (d: Demand) => void;
  userAddress: string;
}) {
  const [form, setForm] = useState<CreateForm>({
    title: '', description: '', category: 'Plomberie',
    location: '', urgent: false, catOpen: false, useMyLocation: false,
  });
  const set = (k: keyof CreateForm, v: any) => setForm(p => ({ ...p, [k]: v }));

  const valid = form.title.trim().length > 3 && form.description.trim().length > 10 && form.location.trim().length > 3;
  const currentCat = SERVICE_CATEGORIES.find(c => c.label === form.category) || SERVICE_CATEGORIES[1];

  const handleSubmit = () => {
    if (!valid) return;
    const newDemand: Demand = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      location: form.location.trim(),
      urgent: form.urgent,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'open',
      responses: [],
    };
    onCreate(newDemand);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#243B82] to-[#1E5BB8] px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-white/70 hover:text-white p-1 transition-colors"><ChevronLeft size={22} /></button>
        <div className="flex-1">
          <p className="font-black text-white text-base">Créer une demande</p>
          <p className="text-white/60 text-xs">Les prestataires vous contacteront directement</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-[#1E5BB8] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1E5BB8] leading-relaxed">
              Décrivez votre besoin. Les prestataires de la catégorie choisie dans votre zone pourront vous répondre. Max <strong>{MAX_RESPONSES} réponses</strong>.
            </p>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Titre *</label>
            </div>
            <div className="px-5 py-3">
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Ex: Réparation fuite eau, Peinture chambre..."
                className="w-full text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent" />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Catégorie *</label>
            </div>
            <div className="px-5 py-3 relative">
              <button onClick={() => set('catOpen', !form.catOpen)}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-700">
                <span className="flex items-center gap-2">{currentCat.emoji} {currentCat.label}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${form.catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {form.catOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute left-4 right-4 top-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 max-h-64 overflow-y-auto py-1">
                    {SERVICE_CATEGORIES.filter(c => c.label !== 'Tous').map(c => (
                      <button key={c.label}
                        onClick={() => { set('category', c.label as ServiceCategory); set('catOpen', false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                          form.category === c.label ? 'bg-blue-50 text-[#1E5BB8] font-bold' : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                        <span className="flex items-center gap-2.5">{c.emoji} {c.label}</span>
                        {form.category === c.label && <Check size={13} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description *</label>
            </div>
            <div className="px-5 py-3">
              <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Décrivez votre problème en détail : symptômes, étage, contraintes horaires, matériaux existants..."
                className="w-full text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent resize-none" />
              <p className={`text-xs text-right mt-1 ${form.description.length >= 10 ? 'text-green-500' : 'text-gray-300'}`}>
                {form.description.length} car. (min 10)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Localisation *</label>
              {userAddress && (
                <button
                  onClick={() => { set('location', userAddress); set('useMyLocation', true); }}
                  className="flex items-center gap-1 text-xs text-[#1E5BB8] font-bold hover:underline">
                  <MapPin size={11} /> Utiliser ma position
                </button>
              )}
            </div>
            <div className="px-5 py-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#1E5BB8] shrink-0" />
                <input type="text" value={form.location} onChange={e => { set('location', e.target.value); set('useMyLocation', false); }}
                  placeholder="Ex: 12 Rue Hassan II, Maarif, Casablanca"
                  className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent" />
              </div>
              {form.useMyLocation && form.location && (
                <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                  <Check size={10} /> Position du profil utilisée
                </p>
              )}
            </div>
          </div>

          {/* Urgent */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Zap size={14} className="text-[#E30613]" /> Demande urgente
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Intervention nécessaire sous 24h</p>
            </div>
            <div onClick={() => set('urgent', !form.urgent)}
              className={`w-12 h-7 rounded-full cursor-pointer transition-colors relative ${form.urgent ? 'bg-[#E30613]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${form.urgent ? 'left-6' : 'left-1'}`} />
            </div>
          </div>

        </div>
      </div>

      {/* Submit */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 shrink-0">
        <motion.button onClick={handleSubmit} disabled={!valid}
          whileHover={valid ? { scale: 1.01 } : {}} whileTap={valid ? { scale: 0.99 } : {}}
          className={`w-full max-w-2xl mx-auto block py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
            valid
              ? 'bg-[#1E5BB8] hover:bg-[#243B82] text-white shadow-xl shadow-blue-900/20'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          <Send size={16} /> Publier la demande
        </motion.button>
        <p className="text-center text-xs text-gray-400 mt-2">Visible uniquement par les prestataires "{form.category}" près de votre adresse</p>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────────── */
interface DemandesPageProps {
  onBack: () => void;
  onViewPro?: (proId: number) => void;
  userAddress?: string;
}

type SubView = 'list' | 'create' | 'detail';

export function DemandesPage({ onBack, onViewPro, userAddress = '12 Rue Abou Inane, Maarif, Casablanca' }: DemandesPageProps) {
  const [subView, setSubView]   = useState<SubView>('list');
  const [demands, setDemands]   = useState<Demand[]>(MOCK_DEMANDS);
  const [selected, setSelected] = useState<Demand | null>(null);
  const [filter, setFilter]     = useState<'all' | 'open' | 'closed'>('all');

  const displayed = demands.filter(d => filter === 'all' || d.status === filter);

  const handleCreate = (d: Demand) => setDemands(prev => [d, ...prev]);

  const handleClose = () => {
    if (!selected) return;
    setDemands(prev => prev.map(d => d.id === selected.id ? { ...d, status: 'closed' as const } : d));
    setSelected(prev => prev ? { ...prev, status: 'closed' as const } : null);
  };

  const handleViewPro = (proId: number) => {
    if (onViewPro) onViewPro(proId);
  };

  if (subView === 'create') {
    return <CreateDemand onBack={() => setSubView('list')} onCreate={handleCreate} userAddress={userAddress} />;
  }

  if (subView === 'detail' && selected) {
    // Sync selected with latest demand state
    const freshDemand = demands.find(d => d.id === selected.id) || selected;
    return (
      <DemandDetail
        demand={freshDemand}
        onBack={() => setSubView('list')}
        onClose={handleClose}
        onViewPro={handleViewPro}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#243B82] to-[#1E5BB8] px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-white/70 hover:text-white p-1 transition-colors"><ChevronLeft size={22} /></button>
        <div className="flex-1">
          <p className="font-black text-white text-lg">Mes demandes</p>
          <p className="text-white/60 text-xs">Les prestataires vous répondent</p>
        </div>
        <button onClick={() => setSubView('create')}
          className="flex items-center gap-1.5 bg-white text-[#1E5BB8] text-sm font-black px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-md">
          <Plus size={15} /> Nouvelle
        </button>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex gap-2">
        {([['all', 'Toutes'], ['open', 'Ouvertes'], ['closed', 'Fermées']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === k ? 'bg-[#1E5BB8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{l}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 font-medium flex items-center">{displayed.length} demande{displayed.length > 1 ? 's' : ''}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileText size={36} className="text-[#1E5BB8]/40" />
            </div>
            <p className="font-black text-gray-700 text-lg mb-1">Aucune demande</p>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              Créez une demande et recevez des offres de prestataires qualifiés près de chez vous
            </p>
            <button onClick={() => setSubView('create')}
              className="bg-[#1E5BB8] text-white font-black px-6 py-3 rounded-2xl hover:bg-[#243B82] transition-colors text-sm shadow-lg shadow-blue-900/20">
              + Créer ma première demande
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-3">
            {displayed.map(d => (
              <DemandCard key={d.id} demand={d}
                onOpen={() => { setSelected(d); setSubView('detail'); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}