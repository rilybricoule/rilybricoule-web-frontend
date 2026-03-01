import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Banknote, ChevronLeft, Lock, CheckCircle,
  Shield, ArrowRight, User,
} from 'lucide-react';
import type { Pro, BookingDetails } from '../types';

interface PaymentPageProps {
  pro: Pro;
  booking: Partial<BookingDetails>;
  updateBooking: <K extends keyof BookingDetails>(key: K, val: BookingDetails[K]) => void;
  onBack: () => void;
  onConfirm: () => void;
  userProfile?: { cardName?: string };
}

export function PaymentPage({ pro, booking, updateBooking, onBack, onConfirm, userProfile }: PaymentPageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]     = useState(false);
  const method = booking.paymentMethod || 'card';

  const fmt  = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const fmtE = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  // Pre-fill card name from profile
  React.useEffect(() => {
    if (userProfile?.cardName && !booking.cardName) updateBooking('cardName', userProfile.cardName);
  }, []);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setConfirmed(true); }, 2000);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
            <CheckCircle size={56} className="text-green-600" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Réservation confirmée !</h2>
          <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
            <strong>{pro.name}</strong> a été notifié et viendra le{" "}
            <strong>{booking.date && new Date(booking.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</strong> à <strong>{booking.time}</strong>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left mb-6 space-y-1.5 max-w-sm mx-auto">
            <p className="text-sm font-black text-[#1E5BB8] mb-2">Récapitulatif</p>
            <p className="text-sm text-[#1E5BB8]">👤 {pro.name} — {pro.specialty}</p>
            <p className="text-sm text-[#1E5BB8]">📅 {booking.date && new Date(booking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {booking.time}</p>
            <p className="text-sm text-[#1E5BB8]">📍 {booking.address}</p>
          </div>
          <button onClick={onConfirm}
            className="w-full max-w-sm bg-[#1E5BB8] hover:bg-[#243B82] text-white font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 mx-auto">
            Suivre mon prestataire <ArrowRight size={20} />
          </button>
          <p className="text-xs text-gray-400 mt-3">SMS envoyé au +212 {booking.phone}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1"><ChevronLeft size={22} /></button>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-base">Paiement</p>
          <div className="flex items-center gap-1 text-xs text-green-600 font-semibold"><Shield size={11} /> Sécurisé 256-bit SSL</div>
        </div>
        <Lock size={16} className="text-green-500" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">

          {/* Left: method selector + card form */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="font-black text-gray-900 text-sm mb-4">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => updateBooking('paymentMethod', 'card')}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${method === 'card' ? 'border-[#1E5BB8] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <CreditCard size={22} className={method === 'card' ? 'text-[#1E5BB8]' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${method === 'card' ? 'text-[#1E5BB8]' : 'text-gray-600'}`}>Carte</span>
                  <span className="text-[11px] text-gray-400">Visa · MC · CMI</span>
                </button>
                <button onClick={() => updateBooking('paymentMethod', 'cash')}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${method === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <Banknote size={22} className={method === 'cash' ? 'text-green-600' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${method === 'cash' ? 'text-green-700' : 'text-gray-600'}`}>Espèces</span>
                  <span className="text-[11px] text-gray-400">À l'arrivée</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {method === 'card' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 overflow-hidden">
                  <p className="font-black text-gray-900 text-sm">Informations de la carte</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Numéro</label>
                    <div className="relative">
                      <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                        value={booking.cardNumber || ''}
                        onChange={e => updateBooking('cardNumber', fmt(e.target.value))}
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all font-mono tracking-widest" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nom sur la carte</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="PRÉNOM NOM"
                        value={booking.cardName || ''}
                        onChange={e => updateBooking('cardName', e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all uppercase tracking-wide" />
                    </div>
                    {userProfile?.cardName && booking.cardName !== userProfile.cardName.toUpperCase() && (
                      <button onClick={() => updateBooking('cardName', userProfile.cardName!.toUpperCase())}
                        className="mt-1.5 text-xs text-[#1E5BB8] hover:underline font-semibold flex items-center gap-1">
                        <User size={10} /> Utiliser {userProfile.cardName.toUpperCase()}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Expiration</label>
                      <input type="text" placeholder="MM/AA" maxLength={5}
                        value={booking.cardExpiry || ''}
                        onChange={e => updateBooking('cardExpiry', fmtE(e.target.value))}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">CVV</label>
                      <div className="relative">
                        <input type="password" placeholder="•••" maxLength={4}
                          value={booking.cardCVV || ''}
                          onChange={e => updateBooking('cardCVV', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full pl-3 pr-8 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all font-mono" />
                        <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {method === 'cash' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-5 overflow-hidden shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0"><Banknote size={18} className="text-green-600" /></div>
                    <div>
                      <p className="font-black text-green-800 text-sm">Paiement en espèces</p>
                      <p className="text-sm text-green-700 mt-1 leading-relaxed">Payez directement au prestataire après l'intervention. Préparez {pro.price} MAD en liquide.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="font-black text-gray-900 text-sm mb-4">Récapitulatif de la commande</p>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold shrink-0`}>{pro.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{pro.name}</p>
                  <p className="text-xs text-gray-500">{pro.specialty}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Tarif horaire</span><span>{pro.price} MAD/h</span></div>
                <div className="flex justify-between text-gray-600"><span>Date</span><span>{booking.date || '—'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Heure</span><span>{booking.time || '—'}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais service</span>
                  <span className="text-gray-400">{method === 'card' ? `${Math.round(pro.price * 0.05)} MAD` : 'Offerts'}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total estimé (1h)</span>
                  <span className="text-[#1E5BB8]">{method === 'card' ? Math.round(pro.price * 1.05) : pro.price} MAD</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-[#1E5BB8]" />
                <p className="text-xs font-black text-[#1E5BB8]">Garanties RilyBricoule</p>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Prestataires vérifiés et assurés</li>
                <li>✓ Annulation gratuite avant 2h</li>
                <li>✓ Remboursement si non satisfaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 px-5 py-4 shadow-lg shrink-0">
        <motion.button onClick={handleConfirm} disabled={loading}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full max-w-4xl mx-auto block py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-[#1E5BB8] hover:bg-[#243B82] text-white shadow-xl shadow-blue-900/20 transition-all disabled:opacity-70">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Confirmation...</>
          ) : (
            <><CheckCircle size={20} /> Confirmer et payer</>
          )}
        </motion.button>
      </div>
    </div>
  );
}