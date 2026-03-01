import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Phone, MessageSquare, CheckCircle2, Clock, MapPin, ChevronLeft, Wrench } from 'lucide-react';
import type { Pro } from '../types/index';

interface TrackingPageProps {
  pro: Pro;
  onBack: () => void;
  onMessage: (pro: Pro) => void;
}

export function TrackingPage({ pro, onBack, onMessage }: TrackingPageProps) {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState<'preparing' | 'en_route' | 'arriving' | 'arrived'>('preparing');
  const [proPos, setProPos] = useState({ x: 15, y: 70 }); // % positions on fake map

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 1.2, 100);
        if (next < 20) {
          setStatus('preparing');
          setEta(Math.round(12 - next * 0.6));
        } else if (next < 80) {
          setStatus('en_route');
          setEta(Math.max(1, Math.round((100 - next) * 0.12)));
          // Animate pro position toward destination
          setProPos({ x: 15 + (next - 20) * 0.9, y: 70 - (next - 20) * 0.6 });
        } else if (next < 98) {
          setStatus('arriving');
          setEta(1);
          setProPos({ x: 70, y: 35 });
        } else {
          setStatus('arrived');
          setEta(0);
          setProPos({ x: 75, y: 30 });
          clearInterval(timer);
        }
        return next;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const statusConfig = {
    preparing: { label: 'En préparation', sub: 'Le prestataire prépare son intervention', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⏳' },
    en_route: { label: 'En route', sub: `Arrivée estimée dans ${eta} min`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '🚗' },
    arriving: { label: 'Presque arrivé', sub: 'Le prestataire est proche', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: '📍' },
    arrived: { label: 'Arrivé !', sub: 'Votre prestataire est devant chez vous', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', icon: '✅' },
  };
  const cfg = statusConfig[status];

  const steps = [
    { key: 'preparing', label: 'Confirmation', done: progress > 0 },
    { key: 'en_route', label: 'En route', done: progress > 20 },
    { key: 'arriving', label: 'Proche', done: progress > 80 },
    { key: 'arrived', label: 'Arrivé', done: progress >= 100 },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <p className="font-bold text-gray-900">Suivi en temps réel</p>
          <p className="text-xs text-gray-500">{pro.name} · {pro.specialty}</p>
        </div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-3 h-3 bg-green-500 rounded-full shadow-md shadow-green-300" />
        <span className="text-xs text-green-600 font-semibold">Live</span>
      </div>

      {/* Status card */}
      <div className={`mx-4 mt-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cfg.icon}</span>
          <div className="flex-1">
            <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
            <p className="text-sm text-gray-600">{cfg.sub}</p>
          </div>
          {status !== 'arrived' && eta > 0 && (
            <div className="text-center bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
              <p className="text-xl font-black text-blue-700">{eta}</p>
              <p className="text-xs text-gray-500">min</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress steps */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center">
          {steps.map((step, i) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={step.done ? { scale: [1, 1.2, 1] } : {}}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step.done ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {step.done ? <CheckCircle2 size={16} /> : i + 1}
                </motion.div>
                <p className={`text-xs mt-1 font-medium ${step.done ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-4 bg-gray-100 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-blue-500"
                    animate={{ width: steps[i + 1].done ? '100%' : step.done ? '50%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Fake map */}
      <div className="mx-4 mt-4 flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden relative" style={{ minHeight: 220 }}>
        {/* Map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100">
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapgrid)" />
          </svg>
          {/* Fake roads */}
          <div className="absolute top-[30%] left-0 right-0 h-1 bg-white/80" />
          <div className="absolute top-[60%] left-0 right-0 h-0.5 bg-white/60" />
          <div className="absolute left-[40%] top-0 bottom-0 w-1 bg-white/80" />
          <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-white/60" />

          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <line x1="15%" y1="70%" x2="75%" y2="30%" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.6" />
          </svg>

          {/* Client position (destination) */}
          <div className="absolute" style={{ left: '75%', top: '30%', transform: 'translate(-50%, -50%)' }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center shadow-md">
                <MapPin size={16} className="text-blue-600 fill-blue-100" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">Vous</div>
            </div>
          </div>

          {/* Pro position (moving) */}
          <motion.div className="absolute"
            animate={{ left: `${proPos.x}%`, top: `${proPos.y}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            style={{ transform: 'translate(-50%, -50%)' }}>
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-12 h-12 rounded-full bg-orange-100 border-3 border-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                  {pro.avatar}
                </div>
              </motion.div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">{pro.name.split(' ')[0]}</div>
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full border-2 border-orange-400"
              />
            </div>
          </motion.div>
        </div>

        {/* ETA badge on map */}
        {status !== 'arrived' && (
          <div className="absolute top-3 right-3 bg-white rounded-xl shadow-md px-3 py-2 border border-gray-100">
            <p className="text-xs text-gray-500">ETA</p>
            <p className="font-black text-blue-700 text-lg leading-tight">{eta} min</p>
          </div>
        )}
      </div>

      {/* Pro info + actions */}
      <div className="mx-4 my-4 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pro.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
            {pro.avatar}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{pro.name}</p>
            <p className="text-sm text-gray-500">{pro.specialty}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Tarif</p>
            <p className="font-bold text-blue-700">{pro.price} MAD/h</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href={`tel:${pro.phone}`}
            className="flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all">
            <Phone size={15} /> Appeler
          </a>
          <button onClick={() => onMessage(pro)}
            className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
            <MessageSquare size={15} /> Message
          </button>
        </div>
      </div>

      {/* Arrived confirmation */}
      <AnimatePresence>
        {status === 'arrived' && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 pb-8 px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Arrivé !</h2>
              <p className="text-gray-500 text-sm mb-6">{pro.name} est devant chez vous. Bonne intervention !</p>
              <button onClick={onBack} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                Parfait, merci !
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}