import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle2, XCircle, Calendar, MapPin,
  Phone, ChevronLeft, Bell, BadgeCheck, Star,
} from 'lucide-react';
import type { Pro, BookingDetails } from '../types';

interface BookingConfirmationPageProps {
  pro: Pro;
  booking: Partial<BookingDetails>;
  onBack: () => void;
  /** Called when pro accepts — moves to payment */
  onProAccepted: () => void;
  /** Called when pro declines */
  onProDeclined: () => void;
}

type ConfirmStatus = 'waiting' | 'accepted' | 'declined';

export function BookingConfirmationPage({
  pro, booking, onBack, onProAccepted, onProDeclined,
}: BookingConfirmationPageProps) {
  const [status, setStatus] = useState<ConfirmStatus>('waiting');
  const [elapsed, setElapsed] = useState(0);

  // ── Demo: auto-accept after 5s so you can test the full flow ──────────────
  useEffect(() => {
    const timer = setTimeout(() => setStatus('accepted'), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Elapsed seconds counter while waiting
  useEffect(() => {
    if (status !== 'waiting') return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Notify parent after a short delay so user can see the result screen
  useEffect(() => {
    if (status === 'accepted') {
      const t = setTimeout(onProAccepted, 2200);
      return () => clearTimeout(t);
    }
    if (status === 'declined') {
      const t = setTimeout(onProDeclined, 2200);
      return () => clearTimeout(t);
    }
  }, [status]);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '—';

  return (
    <div className="flex flex-col h-full bg-[#F2F3F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 shadow-sm shrink-0">
        {status === 'waiting' && (
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1">
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold shrink-0 shadow`}>
            {pro.avatar}
          </div>
          <div>
            <p className="font-black text-gray-900 text-base">Confirmation</p>
            <p className="text-xs text-gray-500">{pro.name} · {pro.specialty}</p>
          </div>
          {pro.verified && <BadgeCheck size={16} className="text-[#1E5BB8] ml-auto" />}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── WAITING ─────────────────────────────────────────────────── */}
          {status === 'waiting' && (
            <motion.div key="waiting"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md flex flex-col items-center text-center">

              {/* Pulsing ring */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0, 0.25] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-[#1E5BB8]/20"
                  style={{ margin: -16 }}
                />
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-4xl font-black text-white shadow-xl`}>
                  {pro.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow">
                  <Clock size={14} className="text-white" />
                </div>
              </div>

              <h2 className="text-xl font-black text-gray-900 mb-2">En attente de confirmation</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
                Votre demande a été envoyée à <span className="font-bold text-gray-700">{pro.name}</span>.
                Il a généralement un temps de réponse de <span className="font-bold text-gray-700">{pro.responseTime}</span>.
              </p>

              {/* Booking summary card */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="bg-gray-50/70 px-5 py-3 border-b border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Votre demande</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-[#1E5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Date & heure</p>
                      <p className="text-sm font-bold text-gray-800">{formatDate(booking.date)} à {booking.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-[#1E5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Adresse</p>
                      <p className="text-sm font-bold text-gray-800">{booking.address || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-[#1E5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Téléphone</p>
                      <p className="text-sm font-bold text-gray-800">+212 {booking.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro info strip */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow shrink-0`}>
                  {pro.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-gray-900 text-sm">{pro.name}</p>
                    {pro.verified && <BadgeCheck size={13} className="text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-gray-700">{pro.rating}</span>
                    <span className="text-xs text-gray-400">· {pro.completedJobs} missions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Tarif</p>
                  <p className="font-black text-[#1E5BB8] text-sm">{pro.price} MAD/h</p>
                </div>
              </div>

              {/* Elapsed + notification note */}
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Bell size={12} />
                <span>Vous serez notifié dès qu'il répond · {elapsed}s</span>
              </div>

              {/* Demo controls */}
              <div className="mt-8 flex gap-3 w-full">
                <button onClick={() => setStatus('declined')}
                  className="flex-1 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors">
                  ✕ Simuler refus
                </button>
                <button onClick={() => setStatus('accepted')}
                  className="flex-1 py-2.5 rounded-xl border-2 border-green-200 text-green-600 text-xs font-bold hover:bg-green-50 transition-colors">
                  ✓ Simuler acceptation
                </button>
              </div>
              <p className="text-[10px] text-gray-300 mt-2">Boutons de démonstration — à retirer en production</p>
            </motion.div>
          )}

          {/* ── ACCEPTED ────────────────────────────────────────────────── */}
          {status === 'accepted' && (
            <motion.div key="accepted"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center max-w-xs">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <CheckCircle2 size={48} className="text-green-500" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Réservation confirmée !</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                <span className="font-bold text-gray-700">{pro.name}</span> a accepté votre demande.
                Vous allez être redirigé vers le paiement…
              </p>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.3 }}
                className="mt-6 h-1 bg-green-400 rounded-full w-48" />
            </motion.div>
          )}

          {/* ── DECLINED ────────────────────────────────────────────────── */}
          {status === 'declined' && (
            <motion.div key="declined"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center max-w-xs">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <XCircle size={48} className="text-red-400" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Demande refusée</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                <span className="font-bold text-gray-700">{pro.name}</span> n'est pas disponible
                pour ce créneau. Vous allez être redirigé pour choisir un autre prestataire…
              </p>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.3 }}
                className="mt-6 h-1 bg-red-400 rounded-full w-48" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}