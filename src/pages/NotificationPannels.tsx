/**
 * NotificationsPanel.tsx
 *
 * Drop-in notification system.
 *
 * ── USAGE ────────────────────────────────────────────────────────────────────
 *
 * 1. Import the hook + panel in your App / layout:
 *
 *    import { useNotifications, NotificationBell, NotificationsPanel } from './components/NotificationsPanel';
 *
 * 2. Mount the hook once at the top level:
 *
 *    const notifications = useNotifications();
 *
 * 3. Replace your existing bell button with:
 *
 *    <NotificationBell
 *      count={notifications.unreadCount}
 *      onClick={notifications.togglePanel}
 *    />
 *
 * 4. Render the panel anywhere (e.g. just before </body>):
 *
 *    <NotificationsPanel {...notifications} />
 *
 * 5. Fire notifications from anywhere:
 *
 *    notifications.add({ type: 'booking_accepted', proName: 'Ahmed Karimi', proId: 1 });
 *    notifications.add({ type: 'payment_success', amount: 150 });
 *    notifications.add({ type: 'pro_arrived' });
 *    // etc — see NotificationPayload type below
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Bell, X, CheckCircle, XCircle, CreditCard, MapPin,
  Star, Megaphone, ChevronRight, Trash2, BellOff, Check,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type NotificationType =
  | 'booking_accepted'
  | 'booking_denied'
  | 'payment_success'
  | 'payment_failed'
  | 'pro_arrived'
  | 'pro_delayed'
  | 'new_review'
  | 'site_update'
  | 'promo';

export interface NotificationPayload {
  type: NotificationType;
  proName?: string;
  proId?: number;
  amount?: number;
  delay?: string;         // e.g. "10 min"
  updateTitle?: string;
  promoText?: string;
  reviewRating?: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  detail?: string;      // shown when expanded
  color: string;        // tailwind gradient classes
  icon: React.ReactNode;
  time: Date;
  read: boolean;
  payload: NotificationPayload;
}

// ─── Config per type ──────────────────────────────────────────────────────────
function buildNotification(payload: NotificationPayload): Omit<Notification, 'id' | 'time' | 'read'> {
  const { type, proName, amount, delay, updateTitle, promoText, reviewRating } = payload;

  switch (type) {
    case 'booking_accepted':
      return {
        type,
        title: 'Réservation confirmée ✓',
        body: `${proName ?? 'Votre prestataire'} a accepté votre demande.`,
        detail: `${proName ?? 'Le prestataire'} sera chez vous à l'heure convenue. Vous pouvez suivre son arrivée en temps réel depuis l'onglet Suivi.`,
        color: 'from-emerald-500 to-green-600',
        icon: <CheckCircle size={20} />,
        payload,
      };
    case 'booking_denied':
      return {
        type,
        title: 'Réservation refusée',
        body: `${proName ?? 'Le prestataire'} n'est plus disponible.`,
        detail: `Nous sommes désolés. ${proName ?? 'Le prestataire'} a refusé la mission. Notre algorithme va automatiquement vous redispatcher vers le prochain prestataire disponible.`,
        color: 'from-red-500 to-rose-600',
        icon: <XCircle size={20} />,
        payload,
      };
    case 'payment_success':
      return {
        type,
        title: 'Paiement accepté',
        body: `Votre paiement de ${amount ?? '—'} MAD a été traité.`,
        detail: `Transaction confirmée. Montant débité : ${amount ?? '—'} MAD. Un reçu a été envoyé à votre adresse e-mail enregistrée.`,
        color: 'from-blue-500 to-indigo-600',
        icon: <CreditCard size={20} />,
        payload,
      };
    case 'payment_failed':
      return {
        type,
        title: 'Échec du paiement',
        body: 'Votre paiement n\'a pas pu être traité.',
        detail: 'Vérifiez les informations de votre carte et réessayez. Si le problème persiste, contactez votre banque ou choisissez un autre mode de paiement.',
        color: 'from-orange-500 to-red-500',
        icon: <CreditCard size={20} />,
        payload,
      };
    case 'pro_arrived':
      return {
        type,
        title: `${proName ?? 'Prestataire'} est arrivé`,
        body: 'Votre prestataire est devant votre porte.',
        detail: `${proName ?? 'Le prestataire'} vient d'arriver à votre adresse. Pensez à vérifier son badge de vérification avant de commencer.`,
        color: 'from-violet-500 to-purple-600',
        icon: <MapPin size={20} />,
        payload,
      };
    case 'pro_delayed':
      return {
        type,
        title: 'Prestataire en retard',
        body: `${proName ?? 'Votre prestataire'} arrivera dans ${delay ?? 'quelques minutes'}.`,
        detail: `${proName ?? 'Le prestataire'} est en route mais rencontre un léger retard. Nouvelle ETA : +${delay ?? '?'}.`,
        color: 'from-amber-500 to-orange-500',
        icon: <MapPin size={20} />,
        payload,
      };
    case 'new_review':
      return {
        type,
        title: 'Nouvel avis reçu',
        body: `${proName ?? 'Un prestataire'} vous a laissé ${reviewRating ?? ''}★`,
        detail: 'Consultez l\'avis complet dans votre historique de missions.',
        color: 'from-amber-400 to-yellow-500',
        icon: <Star size={20} />,
        payload,
      };
    case 'site_update':
      return {
        type,
        title: updateTitle ?? 'Mise à jour disponible',
        body: 'De nouvelles fonctionnalités ont été ajoutées.',
        detail: 'Découvrez les dernières améliorations : dispatch amélioré, nouveau mode swipe et suivi GPS en temps réel.',
        color: 'from-[#1E5BB8] to-[#243B82]',
        icon: <Megaphone size={20} />,
        payload,
      };
    case 'promo':
      return {
        type,
        title: 'Offre spéciale 🎉',
        body: promoText ?? '20% de réduction sur votre prochaine réservation.',
        detail: 'Utilisez le code PROMO20 lors de votre prochaine réservation. Valable 7 jours. Non cumulable avec d\'autres offres.',
        color: 'from-pink-500 to-rose-500',
        icon: <Star size={20} />,
        payload,
      };
    default:
      return {
        type,
        title: 'Notification',
        body: 'Vous avez un nouveau message.',
        color: 'from-gray-500 to-gray-700',
        icon: <Bell size={20} />,
        payload,
      };
  }
}

// ─── Demo seed data ───────────────────────────────────────────────────────────
const SEED_NOTIFICATIONS: NotificationPayload[] = [
  { type: 'booking_accepted', proName: 'Ahmed Karimi', proId: 1 },
  { type: 'payment_success', amount: 150 },
  { type: 'pro_arrived', proName: 'Zineb Alaoui', proId: 6 },
  { type: 'site_update', updateTitle: 'Dispatch v2 disponible' },
  { type: 'booking_denied', proName: 'Rachida Tazi', proId: 8 },
  { type: 'promo', promoText: '15% de réduction ce week-end !' },
];

function seedId(i: number) { return `seed-${i}`; }

function buildSeed(): Notification[] {
  return SEED_NOTIFICATIONS.map((p, i) => {
    const built = buildNotification(p);
    const minutesAgo = [2, 15, 34, 60, 120, 300][i] ?? i * 20;
    return {
      ...built,
      id: seedId(i),
      time: new Date(Date.now() - minutesAgo * 60 * 1000),
      read: i >= 3,
    };
  });
}

// ─── Time formatter ───────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return 'À l\'instant';
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useNotifications() {
  const [items, setItems]     = useState<Notification[]>(buildSeed);
  const [open, setOpen]       = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const unreadCount = items.filter(n => !n.read).length;

  const add = useCallback((payload: NotificationPayload) => {
    const built = buildNotification(payload);
    const notif: Notification = {
      ...built,
      id: `notif-${Date.now()}-${Math.random()}`,
      time: new Date(),
      read: false,
    };
    setItems(prev => [notif, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  }, []);

  const markRead = useCallback((id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const togglePanel = useCallback(() => {
    setOpen(o => !o);
    setExpanded(null);
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpanded(prev => prev === id ? null : id);
    markRead(id);
  }, [markRead]);

  return {
    items, unreadCount, open,
    expanded, setExpanded,
    add, remove, markRead, markAllRead, clearAll,
    togglePanel, toggleExpanded,
  };
}

export type NotificationsHook = ReturnType<typeof useNotifications>;

// ─── Bell Button ──────────────────────────────────────────────────────────────
export function NotificationBell({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
    >
      <Bell size={18} className="text-white" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Swipeable Notification Row ───────────────────────────────────────────────
function NotifRow({
  notif, expanded, onExpand, onDelete, onMarkRead,
}: {
  notif: Notification;
  expanded: boolean;
  onExpand: () => void;
  onDelete: () => void;
  onMarkRead: () => void;
}) {
  const x          = useMotionValue(0);
  const deleteOp   = useTransform(x, [-80, -20], [1, 0]);
  const background = useTransform(x, [-80, 0], ['rgb(239,68,68)', 'rgb(249,250,251)']);
  const [swiped, setSwiped] = useState(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -60) {
      setSwiped(true);
      setTimeout(onDelete, 280);
    } else {
      x.set(0);
    }
  };

  return (
    <AnimatePresence>
      {!swiped && (
        <motion.div
          layout
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, x: -300 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Delete background */}
          <motion.div
            style={{ opacity: deleteOp, backgroundColor: background as any }}
            className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl bg-red-500"
          >
            <Trash2 size={20} className="text-white" />
          </motion.div>

          {/* Card */}
          <motion.div
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -90, right: 0 }}
            dragElastic={{ left: 0.1, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={() => { onExpand(); onMarkRead(); }}
            className={`relative bg-white rounded-2xl border cursor-pointer transition-colors select-none
              ${notif.read ? 'border-gray-100' : 'border-[#1E5BB8]/20 shadow-sm shadow-blue-100'}`}
          >
            <div className="flex items-start gap-3 p-3.5">
              {/* Color indicator + icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                {notif.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1E5BB8] shrink-0" />
                      )}
                      <p className={`text-sm leading-tight truncate ${notif.read ? 'font-semibold text-gray-700' : 'font-black text-gray-900'}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(notif.time)}</span>
                    <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={13} className="text-gray-300" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded && notif.detail && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-3 p-3 rounded-xl bg-gradient-to-br ${notif.color} bg-opacity-10`}
                        style={{ background: 'rgba(30,91,184,0.06)' }}>
                        <p className="text-xs text-gray-600 leading-relaxed">{notif.detail}</p>
                        {notif.payload.proId && (
                          <button className="mt-2 text-xs font-bold text-[#1E5BB8] flex items-center gap-1 hover:underline">
                            Voir le prestataire <ChevronRight size={11} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom left type pill */}
            <div className={`absolute bottom-3 right-3.5`}>
              <TypePill type={notif.type} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypePill({ type }: { type: NotificationType }) {
  const map: Record<NotificationType, { label: string; cls: string }> = {
    booking_accepted: { label: 'Réservation',  cls: 'bg-emerald-100 text-emerald-700' },
    booking_denied:   { label: 'Réservation',  cls: 'bg-red-100 text-red-600' },
    payment_success:  { label: 'Paiement',     cls: 'bg-blue-100 text-blue-700' },
    payment_failed:   { label: 'Paiement',     cls: 'bg-orange-100 text-orange-700' },
    pro_arrived:      { label: 'Arrivée',      cls: 'bg-violet-100 text-violet-700' },
    pro_delayed:      { label: 'Retard',       cls: 'bg-amber-100 text-amber-700' },
    new_review:       { label: 'Avis',         cls: 'bg-yellow-100 text-yellow-700' },
    site_update:      { label: 'Mise à jour',  cls: 'bg-indigo-100 text-indigo-700' },
    promo:            { label: 'Promo',        cls: 'bg-pink-100 text-pink-700' },
  };
  const { label, cls } = map[type] ?? { label: type, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export function NotificationsPanel({
  items, unreadCount, open, expanded,
  remove, markRead, markAllRead, clearAll,
  togglePanel, toggleExpanded,
}: NotificationsHook) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter tabs
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const visible = tab === 'unread' ? items.filter(n => !n.read) : items;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={togglePanel}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed top-16 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-[#F2F3F5] rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-white/60"
        style={{ maxHeight: 'calc(100vh - 5rem)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E5BB8] to-[#243B82] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Bell size={16} className="text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm leading-none">Notifications</p>
                {unreadCount > 0 && (
                  <p className="text-white/60 text-[11px] mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-semibold transition-colors">
                  <Check size={12} /> Tout lire
                </button>
              )}
              {items.length > 0 && (
                <button onClick={clearAll}
                  className="text-white/50 hover:text-white/80 text-xs transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
              <button onClick={togglePanel}
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all">
                <X size={14} className="text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-xl p-1 gap-1">
            {(['all', 'unread'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === t ? 'bg-white text-[#1E5BB8] shadow-sm' : 'text-white/70 hover:text-white'
                }`}>
                {t === 'all' ? `Toutes (${items.length})` : `Non lues (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Swipe hint */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <span className="text-base leading-none">←</span> Glissez à gauche pour supprimer
          </p>
        </div>

        {/* List */}
        <div className="px-4 pb-4 overflow-y-auto space-y-2" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <BellOff size={22} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-500 text-sm">Aucune notification</p>
              <p className="text-xs text-gray-400 mt-1">Vous êtes à jour !</p>
            </motion.div>
          ) : (
            visible.map(notif => (
              <NotifRow
                key={notif.id}
                notif={notif}
                expanded={expanded === notif.id}
                onExpand={() => toggleExpanded(notif.id)}
                onDelete={() => remove(notif.id)}
                onMarkRead={() => markRead(notif.id)}
              />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Demo page (standalone test) ─────────────────────────────────────────────
// Remove this export if you don't need the standalone demo
export function NotificationsDemoPage() {
  const notifications = useNotifications();

  const fire = (type: NotificationType) => {
    const demos: Record<NotificationType, NotificationPayload> = {
      booking_accepted: { type: 'booking_accepted', proName: 'Ahmed Karimi', proId: 1 },
      booking_denied:   { type: 'booking_denied', proName: 'Rachida Tazi', proId: 8 },
      payment_success:  { type: 'payment_success', amount: 220 },
      payment_failed:   { type: 'payment_failed' },
      pro_arrived:      { type: 'pro_arrived', proName: 'Zineb Alaoui', proId: 6 },
      pro_delayed:      { type: 'pro_delayed', proName: 'Khalid Ouali', proId: 5, delay: '15 min' },
      new_review:       { type: 'new_review', proName: 'Fatima Zouai', reviewRating: 5 },
      site_update:      { type: 'site_update', updateTitle: 'Nouveau : Suivi GPS en temps réel' },
      promo:            { type: 'promo', promoText: '20% de réduction ce week-end !' },
    };
    notifications.add(demos[type]);
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] flex flex-col">
      {/* Fake navbar */}
      <div className="bg-gradient-to-r from-[#1E5BB8] to-[#243B82] px-6 py-3 flex items-center justify-between shadow-lg">
        <p className="text-white font-black text-lg">FixItNow</p>
        <div className="flex items-center gap-3">
          <NotificationBell count={notifications.unreadCount} onClick={notifications.togglePanel} />
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/20">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-xs">C</div>
            <span className="text-white font-semibold text-sm">Mon compte</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notifications.open && <NotificationsPanel {...notifications} />}
      </AnimatePresence>

      {/* Demo controls */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-black text-gray-900">Démo — Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">Cliquez pour déclencher chaque type de notification</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
          {([
            ['booking_accepted', 'Réservation ✓',  'from-emerald-500 to-green-600'],
            ['booking_denied',   'Réservation ✗',  'from-red-500 to-rose-600'],
            ['payment_success',  'Paiement ✓',     'from-blue-500 to-indigo-600'],
            ['payment_failed',   'Paiement ✗',     'from-orange-500 to-red-500'],
            ['pro_arrived',      'Arrivée pro',    'from-violet-500 to-purple-600'],
            ['pro_delayed',      'Retard pro',     'from-amber-500 to-orange-500'],
            ['new_review',       'Nouvel avis',    'from-amber-400 to-yellow-500'],
            ['site_update',      'Mise à jour',    'from-[#1E5BB8] to-[#243B82]'],
            ['promo',            'Promotion 🎉',   'from-pink-500 to-rose-500'],
          ] as [NotificationType, string, string][]).map(([type, label, gradient]) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fire(type)}
              className={`bg-gradient-to-br ${gradient} text-white rounded-2xl px-4 py-4 text-left shadow-md hover:shadow-lg transition-shadow`}
            >
              <p className="font-black text-sm leading-tight">{label}</p>
              <p className="text-white/60 text-[10px] mt-0.5 font-mono">{type}</p>
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center max-w-sm">
          Glissez une notification vers la gauche pour la supprimer · Tapez pour voir les détails
        </p>
      </div>
    </div>
  );
}