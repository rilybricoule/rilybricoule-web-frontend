import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, CreditCard, Wrench, Shield, MessageSquare, Phone } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockdata';
import type { FaqItem } from '../types';

const CATEGORIES = [
  { key: 'all',         label: 'Tout',        icon: <HelpCircle size={14} /> },
  { key: 'utilisation', label: 'Utilisation', icon: <Wrench size={14} /> },
  { key: 'paiement',    label: 'Paiement',    icon: <CreditCard size={14} /> },
  { key: 'technique',   label: 'Technique',   icon: <Wrench size={14} /> },
  { key: 'securite',    label: 'Sécurité',    icon: <Shield size={14} /> },
] as const;

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-white rounded-2xl border transition-all ${isOpen ? 'border-[#1E5BB8]/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
        <p className={`font-semibold text-sm leading-snug ${isOpen ? 'text-[#1E5BB8]' : 'text-gray-800'}`}>{item.question}</p>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown size={18} className={isOpen ? 'text-[#1E5BB8]' : 'text-gray-400'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-5 pb-4 border-t border-gray-50">
              <p className="text-sm text-gray-600 leading-relaxed pt-3">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | FaqItem['category']>('all');
  const [openId, setOpenId]                 = useState<number | null>(null);
  const [showContact, setShowContact]       = useState(false);

  const filtered = FAQ_ITEMS.filter(item =>
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#243B82] to-[#1E5BB8] px-5 py-8 text-center">
        <HelpCircle size={32} className="text-white/60 mx-auto mb-3" />
        <h2 className="font-black text-white text-2xl mb-1">Centre d'aide</h2>
        <p className="text-white/60 text-sm">Comment pouvons-nous vous aider ?</p>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#1E5BB8] text-white border-[#1E5BB8]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E5BB8]/30'
              }`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map(item => (
            <AccordionItem key={item.id} item={item} isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
          ))}
        </div>
      </div>

      {/* Contact support */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence>
            {showContact && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-3">
                  <a href="mailto:support@rilybricoule.ma"
                    className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors">
                    <MessageSquare size={17} className="text-[#1E5BB8] shrink-0" />
                    <div>
                      <p className="text-xs font-black text-[#1E5BB8]">Email</p>
                      <p className="text-xs text-blue-600">support@rilybricoule.ma</p>
                    </div>
                  </a>
                  <a href="tel:+212522000000"
                    className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 hover:bg-green-100 transition-colors">
                    <Phone size={17} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-green-800">Téléphone</p>
                      <p className="text-xs text-green-600">+212 5 22 00 00 00</p>
                    </div>
                  </a>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Disponible Lun–Sam · 8h–20h</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setShowContact(!showContact)}
            className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              showContact ? 'bg-gray-100 text-gray-700' : 'bg-[#1E5BB8] hover:bg-[#243B82] text-white shadow-md shadow-blue-900/20'
            }`}>
            <HelpCircle size={15} />
            {showContact ? 'Masquer les contacts' : 'Contacter le support'}
          </button>
        </div>
      </div>
    </div>
  );
}