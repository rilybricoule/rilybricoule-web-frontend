import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, ChevronDown, XCircle, MessageSquare,
  Users, ChevronRight, Send, AlertCircle, FileText, Zap,
  MapPin, Check, BadgeCheck, Star, Calendar, Lightbulb,
  Search, X,
} from 'lucide-react';
import type { ServiceCategory } from '../types';

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY / SUBCATEGORY DATA
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_TREE: {
  label: string;
  emoji: string;
  subs: string[];
}[] = [
  { label: 'Plomberie',      emoji: '🔧', subs: ['Fuite d\'eau', 'Débouchage', 'Chauffe-eau', 'Robinetterie', 'Salle de bain', 'WC / Toilettes', 'Autre'] },
  { label: 'Électricité',    emoji: '⚡', subs: ['Panne générale', 'Installation prise / interrupteur', 'Tableau électrique', 'Éclairage', 'Domotique', 'Autre'] },
  { label: 'Peinture',       emoji: '🖌️', subs: ['Peinture intérieure', 'Peinture extérieure', 'Enduit / Crépi', 'Décoration murale', 'Autre'] },
  { label: 'Jardinage',      emoji: '🌿', subs: ['Tonte pelouse', 'Taille haies', 'Plantation', 'Arrosage automatique', 'Nettoyage jardin', 'Autre'] },
  { label: 'Ménage',         emoji: '🧹', subs: ['Ménage régulier', 'Grand ménage', 'Après travaux', 'Vitres', 'Tapis / Moquette', 'Autre'] },
  { label: 'Menuiserie',     emoji: '🚪', subs: ['Porte / Fenêtre', 'Parquet / Plancher', 'Placard / Dressing', 'Meuble sur mesure', 'Réparation meuble', 'Autre'] },
  { label: 'Serrurerie',     emoji: '🔒', subs: ['Ouverture de porte', 'Changement serrure', 'Blindage porte', 'Coffre-fort', 'Autre'] },
  { label: 'Climatisation',  emoji: '❄️', subs: ['Installation clim', 'Entretien clim', 'Réparation clim', 'Chauffage', 'VMC / Ventilation', 'Autre'] },
  { label: 'Déménagement',   emoji: '🚚', subs: ['Déménagement local', 'Déménagement longue distance', 'Livraison meuble', 'Monte-charge', 'Garde-meubles', 'Autre'] },
  { label: 'Sécurité',       emoji: '🛡️', subs: ['Alarme', 'Vidéosurveillance', 'Interphone', 'Portail automatique', 'Autre'] },
  { label: 'Maçonnerie',     emoji: '🧱', subs: ['Carrelage', 'Faïence', 'Cloison', 'Ravalement façade', 'Rénovation sol', 'Autre'] },
  { label: 'Informatique',   emoji: '💻', subs: ['Réparation PC / Mac', 'Réseau / WiFi', 'Installation logiciel', 'Récupération données', 'Autre'] },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
export interface Demand {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
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

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const MOCK_DEMANDS: Demand[] = [
  {
    id: 1,
    title: "Fuite sous l'évier cuisine",
    description: "L'eau coule depuis 2 jours sous l'évier, urgence car risque d'inondation. Appartement au 3ème étage.",
    category: 'Plomberie',
    subcategory: "Fuite d'eau",
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
    subcategory: 'Peinture intérieure',
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

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY PICKER MODAL
───────────────────────────────────────────────────────────────────────────── */
function CategoryPicker({
  value, subValue, onChange, onClose,
}: {
  value: string; subValue: string;
  onChange: (cat: string, sub: string) => void;
  onClose: () => void;
}) {
  const [step, setStep]             = useState<'cat' | 'sub'>(value ? 'sub' : 'cat');
  const [selectedCat, setSelectedCat] = useState(value);
  const [search, setSearch]         = useState('');
  const [suggestMode, setSuggestMode] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const filteredCats = CATEGORY_TREE.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const currentTree = CATEGORY_TREE.find(c => c.label === selectedCat);

  const handlePickCat = (cat: string) => {
    setSelectedCat(cat);
    setSearch('');
    setStep('sub');
  };

  const handlePickSub = (sub: string) => {
    onChange(selectedCat, sub);
    onClose();
  };

  const handleSuggest = () => {
    if (!suggestion.trim()) return;
    onChange(`Suggestion: ${suggestion.trim()}`, '');
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
      onClick={onClose}>
      <motion.div initial={{ y: 60, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'sub' && (
              <button onClick={() => { setStep('cat'); setSearch(''); }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <p className="font-black text-gray-900 text-base">
                {step === 'cat' ? 'Catégorie' : `Sous-catégorie — ${selectedCat}`}
              </p>
              <p className="text-xs text-gray-400">
                {step === 'cat' ? 'Choisissez le type de service' : 'Précisez votre besoin'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search (cat step only) */}
        {step === 'cat' && !suggestMode && (
          <div className="px-4 py-3 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une catégorie..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
            </div>
          </div>
        )}

        {/* Suggest mode */}
        {suggestMode ? (
          <div className="flex-1 px-5 py-6 flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Lightbulb size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Votre suggestion sera transmise à notre équipe pour enrichir les catégories disponibles.
              </p>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Décrivez votre besoin
              </label>
              <textarea rows={3} value={suggestion} onChange={e => setSuggestion(e.target.value)}
                placeholder="Ex: Installation panneaux solaires, Réparation machine à laver..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSuggestMode(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                Retour
              </button>
              <button onClick={handleSuggest} disabled={!suggestion.trim()}
                className="flex-1 py-3 rounded-2xl bg-[#1E5BB8] hover:bg-[#243B82] text-white font-bold text-sm transition-colors disabled:opacity-40">
                Suggérer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">
              {step === 'cat' ? (
                <>
                  {filteredCats.map(c => (
                    <button key={c.label} onClick={() => handlePickCat(c.label)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-50/50 transition-colors text-left ${
                        selectedCat === c.label ? 'bg-blue-50' : ''
                      }`}>
                      <span className="flex items-center gap-3">
                        <span className="text-2xl">{c.emoji}</span>
                        <div>
                          <p className={`text-sm font-bold ${selectedCat === c.label ? 'text-[#1E5BB8]' : 'text-gray-800'}`}>{c.label}</p>
                          <p className="text-xs text-gray-400">{c.subs.length - 1} sous-catégories</p>
                        </div>
                      </span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>
                  ))}
                  {/* Suggest option */}
                  <button onClick={() => setSuggestMode(true)}
                    className="w-full flex items-center gap-3 px-5 py-4 border-t border-dashed border-gray-200 hover:bg-amber-50/50 transition-colors mt-1">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Lightbulb size={16} className="text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-amber-700">Suggérer une catégorie</p>
                      <p className="text-xs text-amber-500">Votre besoin ne figure pas dans la liste ?</p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {currentTree?.subs.map(sub => (
                    <button key={sub} onClick={() => handlePickSub(sub)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-50/50 transition-colors text-left ${
                        subValue === sub ? 'bg-blue-50' : ''
                      }`}>
                      <span className={`text-sm font-semibold ${subValue === sub ? 'text-[#1E5BB8] font-bold' : 'text-gray-700'}`}>{sub}</span>
                      {subValue === sub && <Check size={14} className="text-[#1E5BB8]" />}
                    </button>
                  ))}
                  {/* Suggest sub */}
                  <button onClick={() => setSuggestMode(true)}
                    className="w-full flex items-center gap-3 px-5 py-4 border-t border-dashed border-gray-200 hover:bg-amber-50/50 transition-colors mt-1">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Lightbulb size={16} className="text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-amber-700">Suggérer une sous-catégorie</p>
                      <p className="text-xs text-amber-500">Mon problème ne figure pas ci-dessus</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRO RESPONSE CARD
───────────────────────────────────────────────────────────────────────────── */
function ProResponseCard({ r, onBook, onViewProfile }: {
  r: DemandResponse;
  onBook: () => void;
  onViewProfile: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
        <p className="text-[10px] text-gray-400 shrink-0 self-start">{r.time}</p>
      </div>

      {/* Message */}
      <div className="px-4 py-3 bg-gray-50/50">
        <p className="text-sm text-gray-600 leading-relaxed">{r.message}</p>
      </div>

      {/* Actions — book directly, no reply */}
      <div className="px-4 py-3 flex gap-2 border-t border-gray-50">
        <button onClick={onViewProfile}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-50 hover:border-gray-300 transition-colors">
          Voir profil
        </button>
        <button onClick={onBook}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1E5BB8] hover:bg-[#243B82] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-900/20">
          <Calendar size={14} /> Réserver ce prestataire
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEMAND CARD (list)
───────────────────────────────────────────────────────────────────────────── */
function DemandCard({ demand, onOpen }: { demand: Demand; onOpen: () => void }) {
  const catTree = CATEGORY_TREE.find(c => c.label === demand.category);
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
            <span className="text-xs text-gray-400">
              {catTree?.emoji} {demand.category}
              {demand.subcategory ? ` › ${demand.subcategory}` : ''}
              {' '}· {demand.createdAt}
            </span>
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
          {demand.responses.slice(0, 4).map((r, i) => (
            <div key={i}
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${r.proColor} flex items-center justify-center text-white font-bold text-[10px] border-2 border-white shadow ${i > 0 ? '-ml-2' : ''}`}>
              {r.proAvatar}
            </div>
          ))}
          {demand.responses.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-[10px] border-2 border-white -ml-2">
              +{demand.responses.length - 4}
            </div>
          )}
          <span className="text-xs text-gray-500 font-semibold ml-1">
            {demand.responses.length} réponse{demand.responses.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-xs text-[#1E5BB8] font-bold flex items-center gap-1">
          Voir <ChevronRight size={12} />
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEMAND DETAIL
───────────────────────────────────────────────────────────────────────────── */
function DemandDetail({ demand, onBack, onClose, onViewPro, onBookPro }: {
  demand: Demand;
  onBack: () => void;
  onClose: () => void;
  onViewPro: (proId: number) => void;
  onBookPro: (proId: number) => void;
}) {
  const [showClose, setShowClose] = useState(false);
  const catTree = CATEGORY_TREE.find(c => c.label === demand.category);

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1"><ChevronLeft size={22} /></button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 truncate">{demand.title}</p>
          <p className="text-xs text-gray-500">
            {catTree?.emoji} {demand.category}{demand.subcategory ? ` › ${demand.subcategory}` : ''} · {demand.createdAt}
          </p>
        </div>
        {demand.status === 'open' && (
          <button onClick={() => setShowClose(true)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0">
            <XCircle size={13} /> Fermer
          </button>
        )}
      </div>

      {/* Confirm close */}
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
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Demand info */}
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
              <span className="text-xs bg-blue-50 text-[#1E5BB8] px-2.5 py-1 rounded-full font-bold border border-blue-100">
                {catTree?.emoji} {demand.category}{demand.subcategory ? ` › ${demand.subcategory}` : ''}
              </span>
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
              {demand.responses.length}
            </span>
          </div>

          {/* Booking CTA banner */}
          {demand.responses.length > 0 && demand.status === 'open' && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-3">
              <Calendar size={14} className="text-[#1E5BB8] shrink-0 mt-0.5" />
              <p className="text-xs text-[#1E5BB8] leading-relaxed font-semibold">
                Choisissez un prestataire et réservez directement — le contact est débloqué après paiement.
              </p>
            </div>
          )}

          {demand.responses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">En attente de réponses</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Les prestataires de la catégorie "{demand.category}" dans votre zone seront notifiés
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {demand.responses.map((r, i) => (
                <ProResponseCard
                  key={i}
                  r={r}
                  onViewProfile={() => onViewPro(r.proId)}
                  onBook={() => onBookPro(r.proId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE FORM
───────────────────────────────────────────────────────────────────────────── */
function CreateDemand({ onBack, onCreate, userAddress }: {
  onBack: () => void;
  onCreate: (d: Demand) => void;
  userAddress: string;
}) {
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [category, setCategory]         = useState('');
  const [subcategory, setSubcategory]   = useState('');
  const [location, setLocation]         = useState('');
  const [urgent, setUrgent]             = useState(false);
  const [useMyLoc, setUseMyLoc]         = useState(false);
  const [pickerOpen, setPickerOpen]     = useState(false);

  const catTree = CATEGORY_TREE.find(c => c.label === category);
  const catDisplay = category
    ? `${catTree?.emoji ?? '💡'} ${category}${subcategory ? ` › ${subcategory}` : ''}`
    : null;

  const valid = title.trim().length > 3 && description.trim().length > 10 && location.trim().length > 3 && category !== '';

  const handleSubmit = () => {
    if (!valid) return;
    onCreate({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory,
      location: location.trim(),
      urgent,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'open',
      responses: [],
    });
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

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-[#1E5BB8] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1E5BB8] leading-relaxed">
              Décrivez votre besoin. Les prestataires de la catégorie choisie dans votre zone pourront vous répondre. Aucune limite de réponses.
            </p>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Titre *</label>
            </div>
            <div className="px-5 py-3">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Réparation fuite eau, Peinture chambre..."
                className="w-full text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent" />
            </div>
          </div>

          {/* Category picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Catégorie *</label>
            </div>
            <button onClick={() => setPickerOpen(true)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              {catDisplay ? (
                <span className="text-sm font-bold text-gray-800">{catDisplay}</span>
              ) : (
                <span className="text-sm text-gray-300">Choisir la catégorie et sous-catégorie...</span>
              )}
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description *</label>
            </div>
            <div className="px-5 py-3">
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Décrivez votre problème en détail : symptômes, étage, contraintes horaires, matériaux existants..."
                className="w-full text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent resize-none" />
              <p className={`text-xs text-right mt-1 ${description.length >= 10 ? 'text-green-500' : 'text-gray-300'}`}>
                {description.length} car. (min 10)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Localisation *</label>
              {userAddress && (
                <button onClick={() => { setLocation(userAddress); setUseMyLoc(true); }}
                  className="flex items-center gap-1 text-xs text-[#1E5BB8] font-bold hover:underline">
                  <MapPin size={11} /> Utiliser ma position
                </button>
              )}
            </div>
            <div className="px-5 py-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#1E5BB8] shrink-0" />
                <input type="text" value={location}
                  onChange={e => { setLocation(e.target.value); setUseMyLoc(false); }}
                  placeholder="Ex: 12 Rue Hassan II, Maarif, Casablanca"
                  className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-300 bg-transparent" />
              </div>
              {useMyLoc && location && (
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
            <div onClick={() => setUrgent(u => !u)}
              className={`w-12 h-7 rounded-full cursor-pointer transition-colors relative ${urgent ? 'bg-[#E30613]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${urgent ? 'left-6' : 'left-1'}`} />
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
        <p className="text-center text-xs text-gray-400 mt-2">
          Visible uniquement par les prestataires "{category || '...'}" près de votre adresse
        </p>
      </div>

      {/* Category picker modal */}
      <AnimatePresence>
        {pickerOpen && (
          <CategoryPicker
            value={category}
            subValue={subcategory}
            onChange={(cat, sub) => { setCategory(cat); setSubcategory(sub); }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
interface DemandesPageProps {
  onBack: () => void;
  onViewPro?: (proId: number) => void;
  userAddress?: string;
  onBookPro?: (proId: number) => void;
}

type SubView = 'list' | 'create' | 'detail';

export function DemandesPage({
  onBack,
  onViewPro,
  userAddress = '12 Rue Abou Inane, Maarif, Casablanca',
  onBookPro,
}: DemandesPageProps) {
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

  if (subView === 'create') {
    return <CreateDemand onBack={() => setSubView('list')} onCreate={handleCreate} userAddress={userAddress} />;
  }

  if (subView === 'detail' && selected) {
    const freshDemand = demands.find(d => d.id === selected.id) || selected;
    return (
      <DemandDetail
        demand={freshDemand}
        onBack={() => setSubView('list')}
        onClose={handleClose}
        onViewPro={proId => { onViewPro?.(proId); }}
        onBookPro={proId => { onBookPro?.(proId); }}
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
        <span className="ml-auto text-xs text-gray-400 font-medium flex items-center">
          {displayed.length} demande{displayed.length > 1 ? 's' : ''}
        </span>
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