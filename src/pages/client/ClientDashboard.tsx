import React from 'react';
import { ClientLayout } from '../../components/layouts/ClientLayout';
import { Search, MapPin, Star } from 'lucide-react';

export function ClientDashboard() {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Réservations Actives</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <MapPin className="text-blue-400" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Artisans Favoris</p>
                <p className="text-3xl font-bold text-orange-600">5</p>
              </div>
              <Star className="text-orange-400" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Services Complétés</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <Search className="text-green-400" size={40} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              Rechercher un Artisan
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors">
              Voir mes Réservations
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Activité Récente</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="font-semibold text-gray-800">Réparation Plomberie</p>
              <p className="text-sm text-gray-600">Complétée - 2 jours ago</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="font-semibold text-gray-800">Installation Étagères</p>
              <p className="text-sm text-gray-600">En cours - Demain 10h00</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
