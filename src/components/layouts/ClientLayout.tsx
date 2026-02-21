import React, { useState } from 'react';
import { Menu, X, LogOut, Home, Search, MapPin, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Accueil', href: '/client' },
    { icon: Search, label: 'Rechercher Artisans', href: '/client/search' },
    { icon: MapPin, label: 'Mes Réservations', href: '/client/reservations' },
    { icon: User, label: 'Mon Profil', href: '/client/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-2xl font-bold">RilyBricoule</h2>
          <p className="text-blue-200 text-sm">Client</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon size={20} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md z-40">
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-blue-600"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1 text-center md:text-left md:ml-0 ml-4">
              <h1 className="text-xl font-semibold text-gray-800">
                Bienvenue, {user?.name}!
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
