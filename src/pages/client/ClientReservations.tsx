import React from 'react';
import { ClientLayout } from '../../components/layouts/ClientLayout';
import { Calendar, Clock, MapPin, User, DollarSign, X } from 'lucide-react';

export function ClientReservations() {
  const reservations = [
    {
      id: '1',
      artisan: 'Jean Dupont',
      service: 'Réparation Plomberie',
      date: '2024-02-18',
      time: '09:00',
      location: 'Paris 12ème',
      price: 130,
      status: 'confirmée'
    },
    {
      id: '2',
      artisan: 'Marie Martin',
      service: 'Installation Radiateur',
      date: '2024-02-20',
      time: '14:00',
      location: 'Paris 15ème',
      price: 200,
      status: 'en attente'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmée': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Mes Réservations</h2>

        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{reservation.service}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{reservation.artisan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{reservation.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Prix:</span>
                        <span className="text-2xl font-bold text-blue-600">{reservation.price}€</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                        Modifier
                      </button>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                        <X size={18} /> Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Aucune réservation pour le moment</p>
            <a href="/client/search" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors">
              Réserver un artisan
            </a>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
