import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Calendar, Clock, MapPin, Phone, FileText,
  CheckCircle2, ArrowRight, BadgeCheck, User,
} from 'lucide-react';
import type { Pro, BookingDetails, UserProfile } from '../types';

interface BookingPageProps {
  pro: Pro;
  booking: Partial<BookingDetails>;
  updateBooking: <K extends keyof BookingDetails>(key: K, val: BookingDetails[K]) => void;
  isValid: boolean;
  onBack: () => void;
  onProceedToPayment: () => void;
  userProfile?: UserProfile;
}

const TIME_SLOTS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];

export function BookingPage({ pro, booking, updateBooking, isValid, onBack, onProceedToPayment, userProfile }: BookingPageProps) {
  const today = new Date().toISOString().split('T')[0];

  // Auto-fill from user profile
  useEffect(() => {
    if (userProfile) {
      if (!booking.address && userProfile.address) updateBooking('address', `${userProfile.address}, ${userProfile.city}`);
      if (!booking.phone  && userProfile.phone)   updateBooking('phone',   userProfile.phone);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1"><ChevronLeft size={22} /></button>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold shrink-0 shadow`}>{pro.avatar}</div>
          <div>
            <p className="font-black text-gray-900 text-base">Réservation</p>
            <p className="text-xs text-gray-500">{pro.name} · {pro.specialty}</p>
          </div>
          {pro.verified && <BadgeCheck size={16} className="text-[#1E5BB8] ml-auto" />}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Auto-fill notice */}
        {userProfile && (booking.address || booking.phone) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
            <User size={15} className="text-[#1E5BB8] shrink-0" />
            <p className="text-sm text-[#1E5BB8] font-semibold">Informations pré-remplies depuis votre profil. Vérifiez et confirmez.</p>
          </motion.div>
        )}

        {/* 2-column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">

          {/* Left col */}
          <div className="space-y-4">
            {/* Date */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-black text-gray-800 mb-3">
                <Calendar size={16} className="text-[#1E5BB8]" /> Date d'intervention <span className="text-[#E30613]">*</span>
              </label>
              <input type="date" min={today} value={booking.date || ''} onChange={e => updateBooking('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all bg-gray-50 font-medium" />
            </div>

            {/* Time slots */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-black text-gray-800 mb-3">
                <Clock size={16} className="text-[#1E5BB8]" /> Heure souhaitée <span className="text-[#E30613]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button key={slot} onClick={() => updateBooking('time', slot)}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      booking.time === slot
                        ? 'bg-[#1E5BB8] text-white border-[#1E5BB8] shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1E5BB8]/40 hover:bg-blue-50'
                    }`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-black text-gray-800 mb-3">
                <FileText size={16} className="text-[#1E5BB8]" /> Notes <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea rows={3} placeholder="Décrivez votre problème, indiquez l'étage, code d'entrée..."
                value={booking.notes || ''} onChange={e => updateBooking('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all resize-none" />
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-4">
            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-black text-gray-800 mb-3">
                <MapPin size={16} className="text-[#1E5BB8]" /> Adresse d'intervention <span className="text-[#E30613]">*</span>
              </label>
              <input type="text" placeholder="Ex: 12 Rue Hassan II, Maarif, Casablanca"
                value={booking.address || ''} onChange={e => updateBooking('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all" />
              {userProfile?.address && (
                <button onClick={() => updateBooking('address', `${userProfile.address}, ${userProfile.city}`)}
                  className="mt-2 text-xs text-[#1E5BB8] hover:underline font-semibold flex items-center gap-1">
                  <User size={11} /> Utiliser mon adresse enregistrée
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-black text-gray-800 mb-3">
                <Phone size={16} className="text-[#1E5BB8]" /> Téléphone <span className="text-[#E30613]">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 w-28 shrink-0">
                  <span className="text-lg">🇲🇦</span>
                  <span className="text-sm font-bold text-gray-700">+212</span>
                </div>
                <input type="tel" placeholder="6 12 34 56 78"
                  value={booking.phone || ''} onChange={e => updateBooking('phone', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E5BB8] focus:border-transparent transition-all" />
              </div>
              {userProfile?.phone && booking.phone !== userProfile.phone && (
                <button onClick={() => updateBooking('phone', userProfile.phone)}
                  className="mt-2 text-xs text-[#1E5BB8] hover:underline font-semibold flex items-center gap-1">
                  <User size={11} /> Utiliser mon numéro enregistré
                </button>
              )}
            </div>

            {/* Summary card */}
            {isValid && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1E5BB8] to-[#243B82] rounded-2xl p-5 text-white shadow-lg">
                <p className="font-black text-sm mb-3 flex items-center gap-2"><CheckCircle2 size={16} /> Récapitulatif</p>
                <div className="space-y-1.5 text-sm text-blue-100">
                  <p>📅 {new Date(booking.date!).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {booking.time}</p>
                  <p>📍 {booking.address}</p>
                  <p>📞 +212 {booking.phone}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 shadow-lg shrink-0">
        <motion.button onClick={onProceedToPayment} disabled={!isValid}
          whileHover={isValid ? { scale: 1.01 } : {}} whileTap={isValid ? { scale: 0.99 } : {}}
          className={`w-full max-w-4xl mx-auto block py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-[#1E5BB8] hover:bg-[#243B82] text-white shadow-xl shadow-blue-900/20'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          Continuer vers le paiement <ArrowRight size={20} />
        </motion.button>
        <p className="text-center text-xs text-gray-400 mt-2">Annulation gratuite jusqu'à 2h avant l'intervention</p>
      </div>
    </div>
  );
}