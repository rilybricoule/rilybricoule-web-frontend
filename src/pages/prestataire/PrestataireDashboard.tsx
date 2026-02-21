import React from 'react';
import { PrestataireLayout } from '../../components/layouts/PrestataireLayout';
import { Calendar, DollarSign, Star, TrendingUp } from 'lucide-react';

export function PrestataireDashboard() {
  return (
    <PrestataireLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Réservations ce mois</p>
                <p className="text-3xl font-bold text-orange-600">8</p>
              </div>
              <Calendar className="text-orange-400" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenus ce mois</p>
                <p className="text-3xl font-bold text-green-600">1,240€</p>
              </div>
              <DollarSign className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Note Moyenne</p>
                <p className="text-3xl font-bold text-yellow-600">4.8</p>
              </div>
              <Star className="text-yellow-400" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Taux Acceptation</p>
                <p className="text-3xl font-bold text-blue-600">91%</p>
              </div>
              <TrendingUp className="text-blue-400" size={40} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              Ajouter un Service
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors">
              Modifier Tarifs
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors">
              Voir mes Réservations
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Prochaines Réservations</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-orange-600 pl-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Réparation Plomberie</p>
                  <p className="text-sm text-gray-600">Client: Jean Lemoine</p>
                  <p className="text-sm text-gray-600">📍 Paris 12ème - 08:00 AM</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Confirmée</span>
              </div>
            </div>
            <div className="border-l-4 border-orange-600 pl-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Installation Radiateur</p>
                  <p className="text-sm text-gray-600">Client: Marie Dupont</p>
                  <p className="text-sm text-gray-600">📍 Paris 15ème - 14:00 PM</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">En attente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Avis Récents</h3>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="font-semibold text-gray-800">Excellent travail!</span>
              </div>
              <p className="text-sm text-gray-600">Très professionnel et rapide. Je recommande!</p>
              <p className="text-xs text-gray-500 mt-2">Par: Pierre Martin - il y a 2 jours</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                  <Star size={16} className="text-gray-300" />
                </div>
                <span className="font-semibold text-gray-800">Très bien</span>
              </div>
              <p className="text-sm text-gray-600">Bon travail, légèrement en retard mais rien de grave.</p>
              <p className="text-xs text-gray-500 mt-2">Par: Sophie Bernard - il y a 5 jours</p>
            </div>
          </div>
        </div>
      </div>
    </PrestataireLayout>
  );
}
