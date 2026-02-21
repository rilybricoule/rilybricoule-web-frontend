import React, { useState } from 'react';
import { ClientLayout } from '../../components/layouts/ClientLayout';
import { Search, MapPin, Star, Phone } from 'lucide-react';

interface Artisan {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  image: string;
}

export function ClientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Mock data
  const artisans: Artisan[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      specialty: 'Plomberie',
      rating: 4.8,
      reviews: 45,
      location: 'Paris 12ème',
      price: 65,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Marie Martin',
      specialty: 'Électricité',
      rating: 4.9,
      reviews: 62,
      location: 'Paris 15ème',
      price: 75,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'Pierre Leclerc',
      specialty: 'Menuiserie',
      rating: 4.7,
      reviews: 38,
      location: 'Paris 11ème',
      price: 85,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
  ];

  const specialties = ['Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Maçonnerie'];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Rechercher un Artisan</h2>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher par nom ou type de service
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Plombier à Paris..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedSpecialty === specialty
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{artisan.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{artisan.specialty}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-400" size={16} fill="currentColor" />
                  <span className="font-semibold text-gray-800">{artisan.rating}</span>
                  <span className="text-sm text-gray-600">({artisan.reviews} avis)</span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{artisan.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">{artisan.price}€</span>
                  <span className="text-xs text-gray-600">/heure</span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
