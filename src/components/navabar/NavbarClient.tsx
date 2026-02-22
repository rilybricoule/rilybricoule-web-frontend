import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Bell, Search, ChevronDown, LogOut, User,
  Settings, FileText, Menu, X, MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Accueil', href: '/dashboard/client' },
    { label: 'Trouver un pro', href: '/dashboard/client/search' },
    { label: 'Mes demandes', href: '/dashboard/client/requests' },
    { label: 'Messages', href: '/dashboard/client/messages' },
  ];

  const notifications = [
    { id: 1, text: 'Votre demande a été acceptée par Ahmed K.', time: '2 min', unread: true },
    { id: 2, text: 'Nouveau devis reçu pour votre plomberie', time: '1h', unread: true },
    { id: 3, text: 'Rappel : RDV demain à 10h00', time: '3h', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/client')}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Wrench size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-blue-700 tracking-tight">RilyBricoule</span>
            <span className="ml-1 text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Client</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all">
              <Search size={15} /> Rechercher...
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                      <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Tout marquer lu</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-blue-50/50' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-tight">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Client'}</p>
                  <p className="text-xs text-gray-400">Client</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/60">
                      <p className="font-semibold text-gray-800 text-sm">{user?.name || 'Client'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    {[
                      { icon: <User size={15} />, label: 'Mon profil', href: '/dashboard/client/profile' },
                      { icon: <FileText size={15} />, label: 'Mes demandes', href: '/dashboard/client/requests' },
                      { icon: <MessageSquare size={15} />, label: 'Messages', href: '/dashboard/client/messages' },
                      { icon: <Settings size={15} />, label: 'Paramètres', href: '/dashboard/client/settings' },
                    ].map(item => (
                      <a key={item.label} href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <span className="text-gray-400">{item.icon}</span> {item.label}
                      </a>
                    ))}
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-blue-100 bg-white overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <a key={link.label} href={link.href}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  {link.label}
                </a>
              ))}
              <button onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2">
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}