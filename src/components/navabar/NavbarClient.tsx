import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Map, MessageSquare, HelpCircle, Wrench, Bell, User,
  ChevronDown, LogOut, Menu, X, Home, Grid3X3,
  Zap, Shield, Brush, Trees, Trash2, DoorOpen, Lock, Wind, Truck, FileText,
} from 'lucide-react';
import type { View, ServiceCategory } from '../../types/index';

interface TopNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  unreadMessages: number;
  onCategoryFilter?: (cat: ServiceCategory) => void;
  notificationBell?: React.ReactNode; // ← NEW
}

const SERVICE_MENU: { label: ServiceCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'Plomberie',     icon: <Wrench size={16} />,      color: 'text-blue-500' },
  { label: 'Électricité',   icon: <Zap size={16} />,         color: 'text-yellow-500' },
  { label: 'Peinture',      icon: <Brush size={16} />,       color: 'text-pink-500' },
  { label: 'Jardinage',     icon: <Trees size={16} />,       color: 'text-green-500' },
  { label: 'Ménage',        icon: <Trash2 size={16} />,      color: 'text-purple-500' },
  { label: 'Menuiserie',    icon: <DoorOpen size={16} />,    color: 'text-amber-600' },
  { label: 'Serrurerie',    icon: <Lock size={16} />,        color: 'text-slate-500' },
  { label: 'Climatisation', icon: <Wind size={16} />,        color: 'text-cyan-500' },
  { label: 'Déménagement',  icon: <Truck size={16} />,       color: 'text-orange-500' },
  { label: 'Sécurité',      icon: <Shield size={16} />,      color: 'text-red-500' },
];

export function TopNav({ activeView, onNavigate, unreadMessages, onCategoryFilter, notificationBell }: TopNavProps) {
  const [profileOpen, setProfileOpen]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen]     = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navBtn = (view: View, label: string, icon: React.ReactNode, badge = 0) => {
    const active = activeView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          active
            ? 'bg-[#1E5BB8] text-white shadow-lg shadow-blue-900/30'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="relative">
          {icon}
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#E30613] rounded-full flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">{badge}</span>
            </span>
          )}
        </span>
        {label}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#243B82] border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => onNavigate('explore')}>
          <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center shadow-inner">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-black text-white text-base tracking-tight">RilyBricoule</span>
          <span className="text-[10px] font-bold bg-[#E30613] text-white px-2 py-0.5 rounded-full">CLIENT</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navBtn('explore', 'Accueil', <Home size={16} />)}

          {/* Services dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              onMouseEnter={() => setServicesOpen(true)}
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeView === 'services'
                  ? 'bg-[#1E5BB8] text-white shadow-lg shadow-blue-900/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid3X3 size={16} />
              Services
              <ChevronDown size={12} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catégories</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {SERVICE_MENU.map(s => (
                      <button
                        key={s.label}
                        onClick={() => {
                          onCategoryFilter?.(s.label);
                          onNavigate('services');
                          setServicesOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <span className={`${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#1E5BB8]">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
                    <button
                      onClick={() => { onCategoryFilter?.('Tous'); onNavigate('services'); setServicesOpen(false); }}
                      className="w-full text-center text-sm font-bold text-[#1E5BB8] hover:underline"
                    >
                      Voir tous les services →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navBtn('map', 'Carte', <Map size={16} />)}
          {navBtn('messages', 'Messages', <MessageSquare size={16} />, unreadMessages)}
          {navBtn('faq', 'Aide', <HelpCircle size={16} />)}
          {navBtn('demandes', 'Mes demandes', <FileText size={16} />)}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">

          {/* ── NOTIFICATION BELL: renders passed component, falls back to static bell ── */}
          {notificationBell ?? (
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E30613] rounded-full" />
            </button>
          )}

          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow">C</div>
              <span className="text-sm font-semibold text-white">Mon compte</span>
              <ChevronDown size={12} className={`text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  {[
                    { icon: <User size={14} />,        label: 'Mon profil', view: 'profile-user' as View },
                    { icon: <MessageSquare size={14} />, label: 'Messages',  view: 'messages' as View },
                    { icon: <HelpCircle size={14} />,  label: 'Aide',       view: 'faq' as View },
                  ].map(item => (
                    <button key={item.label}
                      onClick={() => { onNavigate(item.view); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1E5BB8] transition-colors text-left">
                      <span className="text-gray-400">{item.icon}</span>{item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#243B82] overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {[
                { view: 'explore'  as View, label: 'Accueil',      icon: <Home size={16} /> },
                { view: 'services' as View, label: 'Services',     icon: <Grid3X3 size={16} /> },
                { view: 'map'      as View, label: 'Carte',        icon: <Map size={16} /> },
                { view: 'messages' as View, label: 'Messages',     icon: <MessageSquare size={16} /> },
                { view: 'faq'      as View, label: 'Aide',         icon: <HelpCircle size={16} /> },
                { view: 'demandes' as View, label: 'Mes demandes', icon: <FileText size={16} /> },
              ].map(item => (
                <button key={item.view} onClick={() => { onNavigate(item.view); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeView === item.view ? 'bg-[#1E5BB8] text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}>
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}